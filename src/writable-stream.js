import { WritableStream as WritableStreamPolyfill } from './polyfill/writable-stream';
import { createWrappingWritableSink } from './extensions/writable-wrapper';

class WritableStream extends WritableStreamPolyfill {

  constructor(underlyingSink = {}, { size, highWaterMark } = {}) {
    const wrappedWritableStream = new WritableStreamPolyfill(underlyingSink, { highWaterMark: 1 });
    underlyingSink = createWrappingWritableSink(wrappedWritableStream);

    super(underlyingSink, { size, highWaterMark });
  }

  get locked() {
    return super.locked;
  }

  abort(reason) {
    return super.abort(reason);
  }

  getWriter() {
    return super.getWriter();
  }

}

Object.defineProperty(WritableStream, 'name', { value: 'WritableStream' });

export {
  WritableStream
};
