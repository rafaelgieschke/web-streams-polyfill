export function createWrappingWritableSink(writable) {
  const writer = writable.getWriter();
  return new WrappingWritableStreamSink(writer);
}

class WrappingWritableStreamSink {

  constructor(underlyingWriter) {
    this._underlyingWriter = underlyingWriter;
    this._writableStreamController = undefined;
    this._pendingWrite = undefined;
    this._state = 'writable';
    this._errorPromise = new Promise((resolve, reject) => {
      this._errorPromiseReject = reject;
    });
    this._errorPromise.catch(() => {});
  }

  start(controller) {
    this._writableStreamController = controller;

    this._underlyingWriter.closed
      .then(() => this._finishPendingWrite())
      .catch(reason => this._finishErroring(reason));
  }

  write(chunk) {
    const writer = this._underlyingWriter;
    const writeRequest = writer.write(chunk);

    // Detect errors
    writeRequest.catch(reason => this._finishErroring(reason));
    writer.ready.catch(reason => this._finishErroring(reason));

    // Reject write when errored
    const write = Promise.race([writeRequest, this._errorPromise]);

    this._setPendingWrite(write);
    return write;
  }

  close() {
    return this._underlyingWriter.close();
  }

  abort(reason) {
    if (this._state === 'errored') {
      return undefined;
    }

    const writer = this._underlyingWriter;
    return writer.abort(reason);
  }

  _setPendingWrite(writePromise) {
    let pendingWrite;
    const finishWrite = () => {
      if (this._pendingWrite === pendingWrite) {
        this._pendingWrite = undefined;
      }
    };
    this._pendingWrite = pendingWrite = writePromise.then(finishWrite, finishWrite);
  }

  _finishPendingWrite() {
    if (this._pendingWrite === undefined) {
      return undefined;
    }
    const afterWrite = () => this._finishPendingWrite();
    return this._pendingWrite.then(afterWrite, afterWrite);
  }

  _finishErroring(reason) {
    if (this._state !== 'writable') {
      return;
    }
    this._state = 'errored';
    this._errorPromiseReject(reason);
    this._writableStreamController.error(reason);
  }

}
