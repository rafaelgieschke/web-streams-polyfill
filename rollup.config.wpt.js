import babel from 'rollup-plugin-babel';
import rollupConfig from './rollup.config.common.js';

// Web platform tests with jsdom must run in Node 6+ environments
// since they rely on native support for ES2015 classes
// Babel must not transpile these classes, otherwise the tests fail
const babelConfig = {
  presets: [
    ['env', {
      targets: {
        'node': 6
      },
      modules: false
    }]
  ],
  plugins: [
    'external-helpers'
  ]
};

export default {
  ...rollupConfig,
  output: [{
    ...rollupConfig.output,
    file: 'dist/polyfill.wpt.js'
  }],
  plugins: [
    ...rollupConfig.plugins,
    babel({
      babelrc: false,
      ...babelConfig
    })
  ]
};
