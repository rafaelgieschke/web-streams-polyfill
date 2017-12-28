import babel from 'rollup-plugin-babel';
import strip from 'rollup-plugin-strip';
import uglify from 'rollup-plugin-uglify';
import rollupConfig from './rollup.config.common.js';

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
      include: 'src/**',
      functions: [
        'assert',
        'debug',
        'verbose'
      ]
    }),
    uglify()
  ]
};
