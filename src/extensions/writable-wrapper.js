export function createWrappingWritableSink(writable) {
  const writer = writable.getWriter();
  return new WrappingWritableStreamSink(writer);
}

class WrappingWritableStreamSink {

  constructor(underlyingWriter) {
    this._underlyingWriter = underlyingWriter;
    this._writableStreamController = undefined;
  }

  start(controller) {
    this._writableStreamController = controller;

    this._underlyingWriter.closed
      .catch(reason => {
        this._writableStreamController.error(reason);
      })
      .catch(ignore => {
        // already closed or errored
      });
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
