import { WritableStream as WritableStreamPolyfill } from './polyfill/writable-stream';

class WritableStream extends WritableStreamPolyfill {

  constructor(underlyingSink = {}, { size, highWaterMark = 1 } = {}) {
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
