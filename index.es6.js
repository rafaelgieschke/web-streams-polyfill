export const
  { ReadableStream } = require('./src/readable-stream'),
  { WritableStream } = require('./src/writable-stream'),
  ByteLengthQueuingStrategy = require('./src/byte-length-queuing-strategy'),
  CountQueuingStrategy = require('./src/count-queuing-strategy'),
  { TransformStream } = require('./src/transform-stream');

const interfaces = {
  ReadableStream,
  WritableStream,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  TransformStream
};

// Export
export default interfaces;

// Add classes to window
if ( typeof window !== "undefined" )
  Object.assign( window, interfaces );
