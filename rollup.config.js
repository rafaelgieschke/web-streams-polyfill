export default {
  input: 'index.es6.js',
  output: {
    file: 'dist/polyfill.js',
    format: 'umd',
    name: 'default',
    exports: 'named',
    sourcemap: true
  },
  plugins: []
};
