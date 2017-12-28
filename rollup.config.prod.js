import babel from 'rollup-plugin-babel';
import strip from 'rollup-plugin-strip';
import uglify from 'rollup-plugin-uglify';
import rollupConfig from './rollup.config';

export default {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: 'dist/polyfill.min.js'
  },
  plugins: [
    ...rollupConfig.plugins,
    babel(),
    strip({
      functions: ['assert']
    }),
    uglify()
  ]
};