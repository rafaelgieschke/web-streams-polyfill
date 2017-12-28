import babel from 'rollup-plugin-babel';
import rollupConfig from './rollup.config.common.js';

export default {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: 'dist/polyfill.js'
  },
  plugins: [
    ...rollupConfig.plugins,
    babel()
  ]
};
