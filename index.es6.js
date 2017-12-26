import { ReadableStream } from './spec/reference-implementation/lib/readable-stream';
import { WritableStream } from './spec/reference-implementation/lib/writable-stream';
import ByteLengthQueuingStrategy from './spec/reference-implementation/lib/byte-length-queuing-strategy';
import CountQueuingStrategy from './spec/reference-implementation/lib/count-queuing-strategy';
import { TransformStream } from './spec/reference-implementation/lib/transform-stream';

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
}

// Add classes to window
if ( typeof window !== "undefined" )
    Object.assign(window, ...Object.keys(interfaces).filter(k => !(k in window)).map(k => ({[k]: interfaces[k]})));
