export class WrappingReadableStreamDefaultSource {

  constructor(underlyingReader) {
    this._underlyingReader = underlyingReader;
    this._readableStreamController = undefined;
  }

  start(controller) {
    this._readableStreamController = controller;
  }

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

  cancel(reason) {
    return this._underlyingReader.cancel(reason);
  }

}

export class WrappingReadableByteStreamSource extends WrappingReadableStreamDefaultSource {

  get type() {
    return 'bytes';
  }

  pull() {
    const byobRequest = this._readableStreamController.byobRequest;
    if (byobRequest) {
      return this._pullIntoByobRequest(byobRequest);
    }
    return super.pull();
  }

  _pullIntoByobRequest(byobRequest) {
    // TODO Backpressure?
    return this._underlyingReader.read(byobRequest.view)
      .then(({ value, done }) => {
        const controller = this._readableStreamController;
        const requestView = byobRequest.view;
        if (done) {
          controller.close();
        } else if (value.buffer === requestView.buffer && value.byteOffset === requestView.byteOffset) {
          // responded in same view
          byobRequest.respond(requestView.byteLength);
        } else {
          // responded in different view
          byobRequest.respondWithNewView(value);
        }
      });
  }

}

export class WrappingWritableStreamSink {

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
