import { getBYOBOrDefaultReader } from './utils';

export function createWrappingReadableSource(readable) {
  const { reader, mode } = getBYOBOrDefaultReader(readable);

  let source;
  if (mode === 'byob') {
    source = new WrappingReadableByteStreamSource(reader);
  } else {
    source = new WrappingReadableStreamDefaultSource(reader);
  }

  return source;
}

export function createWrappingWritableSink(writable) {
  const writer = writable.getWriter();
  return new WrappingWritableStreamSink(writer);
}

class AbstractWrappingReadableStreamSource {

  constructor(underlyingReader) {
    this._underlyingReader = underlyingReader;
    this._readableStreamController = undefined;
  }

  start(controller) {
    this._readableStreamController = controller;
  }

  cancel(reason) {
    return this._underlyingReader.cancel(reason);
  }

}

class WrappingReadableStreamDefaultSource extends AbstractWrappingReadableStreamSource {

  pull() {
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

function toUint8Array(view) {
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}

function copyArrayBufferView(from, to) {
  const fromArray = toUint8Array(from);
  const toArray = toUint8Array(to);
  toArray.set(fromArray, 0);
}

const DEFAULT_CHUNK_SIZE = 1024;

class WrappingReadableByteStreamSource extends AbstractWrappingReadableStreamSource {

  get type() {
    return 'bytes';
  }

  pull() {
    const byobRequest = this._readableStreamController.byobRequest;
    if (byobRequest !== undefined) {
      return this._pullWithByobRequest(byobRequest);
    }
    return this._pullWithEnqueue();
  }

  _pullWithByobRequest(byobRequest) {
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

  _pullWithEnqueue() {
    const buffer = new Uint8Array(DEFAULT_CHUNK_SIZE);

    // TODO Backpressure?
    return this._underlyingReader.read(buffer)
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

class WrappingWritableStreamSink {

  constructor(underlyingWriter) {
    this._underlyingWriter = underlyingWriter;
    this._writableStreamController = undefined;
  }

  start(controller) {
    this._writableStreamController = controller;
  }

  write(chunk) {
    const writer = this._underlyingWriter;

    writer.write(chunk)
      .catch(reason => {
        const controller = this._writableStreamController;
        controller.error(reason);
      });

    // Apply backpressure
    if (writer.desiredSize <= 0) {
      return writer.ready;
    }
    return undefined;
  }

  close() {
    return this._underlyingWriter.close();
  }

  abort(reason) {
    return this._underlyingWriter.abort(reason);
  }

}
