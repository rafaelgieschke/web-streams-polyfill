import { TransformStream as TransformStreamPolyfill } from './polyfill/transform-stream';

class TransformStream extends TransformStreamPolyfill {

  constructor(transformer = {}, writableStrategy = {}, readableStrategy = {}) {
    super(transformer, writableStrategy, readableStrategy);
  }

  get readable() {
    return super.readable;
  }

  get writable() {
    return super.writable;
  }

}

export {
  TransformStream
};
