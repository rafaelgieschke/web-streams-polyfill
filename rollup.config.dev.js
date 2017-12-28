import babel from 'rollup-plugin-babel';
import rollupConfig from './rollup.config.common.js';

export default {
  ...rollupConfig,
  output: [{
    ...rollupConfig.output,
    file: 'dist/polyfill.js'
  }, {
    ...rollupConfig.output,
    file: 'dist/polyfill.es.js',
    format: 'es'
  }],
  plugins: [
    ...rollupConfig.plugins,
    babel({
      include: 'src/**'
    })
  ]
};
