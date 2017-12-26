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
        'src/readable-stream.js': ['ReadableStream'],
        'src/writable-stream.js': ['WritableStream'],
        'src/transform-stream.js': ['TransformStream']
      }
    })
  ]
};
