import { ReadableStream } from './readable-stream';
import { WritableStream } from './writable-stream';
import ByteLengthQueuingStrategy from './byte-length-queuing-strategy';
import CountQueuingStrategy from './count-queuing-strategy';
import { TransformStream } from './transform-stream';

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
