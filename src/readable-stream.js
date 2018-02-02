import { ReadableStream as ReadableStreamPolyfill } from './polyfill/readable-stream';
import { createWrappingReadableSource } from './extensions/readable-wrapper';

class ReadableStream extends ReadableStreamPolyfill {

  constructor(underlyingSource = {}, { size, highWaterMark } = {}, wrapped = false) {
    if (!wrapped) {
      const wrappedReadableStream = new ReadableStreamPolyfill(underlyingSource, { size, highWaterMark });
      underlyingSource = createWrappingReadableSource(wrappedReadableStream);
      highWaterMark = 0;
    }

    super(underlyingSource, { size, highWaterMark });
  }

  get locked() {
    return super.locked;
  }

  cancel(reason) {
    return super.cancel(reason);
  }

  getReader(options = {}) {
    return super.getReader(options);
  }

  pipeThrough(pair, options) {
    return super.pipeThrough(pair, options);
  }

  pipeTo(dest, options = {}) {
    return super.pipeTo(dest, options);
  }

  tee() {
    const [branch1, branch2] = super.tee();

    const wrapped1 = new ReadableStream(createWrappingReadableSource(branch1), {}, true);
    const wrapped2 = new ReadableStream(createWrappingReadableSource(branch2), {}, true);
    return [wrapped1, wrapped2];
  }

}

Object.defineProperty(ReadableStream, 'name', { value: 'ReadableStream' });

export {
  ReadableStream
};
