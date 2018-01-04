import { ReadableStream as ReadableStreamPolyfill } from './polyfill/readable-stream';

class ReadableStream extends ReadableStreamPolyfill {

  constructor(underlyingSource = {}, { size, highWaterMark } = {}) {
    super(underlyingSource, { size, highWaterMark });
  }

  get locked() {
    return super.locked;
  }

  cancel(reason) {
    return super.cancel(reason);
  }

  getReader(options) {
    return super.getReader(options);
  }

  pipeThrough(pair, options) {
    return super.pipeThrough(pair, options);
  }

  pipeTo(dest, options) {
    return super.pipeTo(dest, options);
  }

}

Object.defineProperty(ReadableStream, 'name', { value: 'ReadableStream' });

export {
  ReadableStream
};
