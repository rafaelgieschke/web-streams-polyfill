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
      include: 'node_modules/**',
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};
