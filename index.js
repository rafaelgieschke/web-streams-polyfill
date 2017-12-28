require("babel-register")({
  presets: [
    [require("babel-preset-env"), {
      "targets": {
        "node": "current"
      }
    }]
  ]
});

require("babel-polyfill");

module.exports = require("./index.es6");
