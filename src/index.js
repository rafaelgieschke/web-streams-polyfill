/* global window */

import { ReadableStream } from './polyfill/readable-stream';
import { WritableStream } from './polyfill/writable-stream';
import ByteLengthQueuingStrategy from './polyfill/byte-length-queuing-strategy';
import CountQueuingStrategy from './polyfill/count-queuing-strategy';
import { TransformStream } from './polyfill/transform-stream';

const interfaces = {
  ReadableStream,
  WritableStream,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  TransformStream
};

// Export
export default interfaces;
export {
  ReadableStream,
  WritableStream,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  TransformStream
};

// Add classes to window
if (typeof window !== 'undefined') {
  Object.assign(window, interfaces);
}
