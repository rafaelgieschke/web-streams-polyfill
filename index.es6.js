import { ReadableStream } from './src/readable-stream';
import { WritableStream } from './src/writable-stream';
import ByteLengthQueuingStrategy from './src/byte-length-queuing-strategy';
import CountQueuingStrategy from './src/count-queuing-strategy';
import { TransformStream } from './src/transform-stream';

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
  Object.assign( window, interfaces );
