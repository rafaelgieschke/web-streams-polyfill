import { getBYOBOrDefaultReader } from './utils';
import assert from '../polyfill/assert';

export function createWrappingReadableSource(readable) {
  // Check if input is a readable byte stream, i.e. it supports BYOB readers
  const { reader, mode } = getBYOBOrDefaultReader(readable);
  reader.releaseLock();

  let source;
  if (mode === 'byob') {
    source = new WrappingReadableByteStreamSource(readable);
  } else {
    source = new WrappingReadableStreamDefaultSource(readable);
  }

  return source;
}

class AbstractWrappingReadableStreamSource {

  constructor(underlyingStream) {
    this._underlyingStream = underlyingStream;
    this._underlyingReader = undefined;
    this._readerMode = undefined;
    this._readableStreamController = undefined;
  }

  start(controller) {
    this._readableStreamController = controller;
  }

  cancel(reason) {
    if (this._underlyingReader !== undefined) {
      return this._underlyingReader.cancel(reason);
    } else {
      return this._underlyingStream.cancel(reason);
    }
  }

  _attachDefaultReader() {
    if (this._readerMode === 'default') {
      return;
    }

    this._detachReader();

    const reader = this._underlyingStream.getReader();
    this._readerMode = 'default';
    this._attachReader(reader);
  }

  _attachReader(reader) {
    assert(this._underlyingReader === undefined);

    this._underlyingReader = reader;
    this._underlyingReader.closed
      .then(() => {
          if (reader === this._underlyingReader) {
            this._readableStreamController.close();
          }
        },
        reason => {
          if (reader === this._underlyingReader) {
            this._readableStreamController.error(reason);
          }
        })
      .catch(ignore => {
        // already closed or errored
      });
  }

  _detachReader() {
    if (this._underlyingReader === undefined) {
      return;
    }

    this._underlyingReader.releaseLock();
    this._underlyingReader = undefined;
    this._readerMode = undefined;
  }

  _pullWithDefaultReader() {
    this._attachDefaultReader();

    // TODO Backpressure?
    return this._underlyingReader.read()
      .then(({ value, done }) => {
        const controller = this._readableStreamController;
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      });
  }

}

class WrappingReadableStreamDefaultSource extends AbstractWrappingReadableStreamSource {

  pull() {
    return this._pullWithDefaultReader();
  }

}

function toUint8Array(view) {
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}

function copyArrayBufferView(from, to) {
  const fromArray = toUint8Array(from);
  const toArray = toUint8Array(to);
  toArray.set(fromArray, 0);
}

class WrappingReadableByteStreamSource extends AbstractWrappingReadableStreamSource {

  constructor(underlyingStream) {
    super(underlyingStream);
  }

  get type() {
    return 'bytes';
  }

  _attachByobReader() {
    if (this._readerMode === 'byob') {
      return;
    }

    this._detachReader();

    const reader = this._underlyingStream.getReader({ mode: 'byob' });
    this._readerMode = 'byob';
    this._attachReader(reader);
  }

  pull() {
    const byobRequest = this._readableStreamController.byobRequest;
    if (byobRequest !== undefined) {
      return this._pullWithByobRequest(byobRequest);
    }
    return this._pullWithDefaultReader();
  }

  _pullWithByobRequest(byobRequest) {
    this._attachByobReader();

    // reader.read(view) detaches the input view, therefore we cannot pass byobRequest.view directly
    // create a separate buffer to read into, then copy that to byobRequest.view
    const buffer = new Uint8Array(byobRequest.view.byteLength);

    // TODO Backpressure?
    return this._underlyingReader.read(buffer)
      .then(({ value, done }) => {
        const controller = this._readableStreamController;
        if (done) {
          controller.close();
        } else {
          copyArrayBufferView(value, byobRequest.view);
          byobRequest.respond(value.byteLength);
        }
      });
  }

}
