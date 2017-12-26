import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'index.es6.js',
  output: {
    file: 'dist/polyfill.js',
    format: 'umd',
    name: 'default',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      namedExports: {
        'spec/reference-implementation/lib/readable-stream.js': ['ReadableStream'],
        'spec/reference-implementation/lib/writable-stream.js': ['WritableStream'],
        'spec/reference-implementation/lib/transform-stream.js': ['TransformStream']
      }
    })
  ]
};
