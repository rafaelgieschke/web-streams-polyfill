import rollupConfig from './rollup.config.common.js';

export default {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: 'dist/polyfill.js'
  }
};
