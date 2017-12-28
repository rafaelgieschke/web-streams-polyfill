import babel from 'rollup-plugin-babel';
import strip from 'rollup-plugin-strip';
import uglify from 'rollup-plugin-uglify';
import rollupConfig from './rollup.config.common.js';

const babelConfig = {
  presets: [
    ['env', {
      targets: {}, // target all environments
      modules: false
    }]
  ],
  plugins: [
    'external-helpers'
  ]
};

export default {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: 'dist/polyfill.min.js'
  },
  plugins: [
    ...rollupConfig.plugins,
    babel({
      babelrc: false,
      ...babelConfig
    }),
    strip({
      functions: ['assert']
    }),
    uglify()
  ]
};
