const { createFilter } = require('rollup-pluginutils');
const { walk } = require('estree-walker');
const MagicString = require('magic-string');

// Rewrites the exports in helpers.js so the Rollup CommonJS plugin can
// optimally transform it to ESM without wrapping with createCommonjsModule
module.exports = function optimizeHelperExports(options) {
  const filter = createFilter(options.include, options.exclude);
  const sourceMap = options.sourceMap !== false;

  return {
    transform(code, id) {
      if (!filter(id)) {
        return undefined;
      }

      const ast = this.parse(code);
      const magicString = new MagicString(code);
      walk(ast, {
        enter(node, parent) {
          if (sourceMap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }

          if (node._skip) {
            this.skip();
            return;
          }

          // IN: exports.foo = (...)
          // OUT: const foo = (...); exports.foo = foo
          if (node.type === 'AssignmentExpression' &&
            node.left.type === 'MemberExpression' &&
            node.right.type !== 'Identifier') { // skip exports.Call = Call
            const { left } = node;
            const { object, property } = left;
            if (object.type === 'Identifier' && object.name === 'exports' && property.type === 'Identifier') {
              left._skip = true;
              magicString.overwrite(left.start, left.end, `const ${property.name}`);
              magicString.appendLeft(parent.end, `\nexports.${property.name} = ${property.name};`);
            }
          }

          // IN: exports.foo(a, b)
          // OUT: foo(a, b)
          if (node.type === 'CallExpression' &&
            node.callee.type === 'MemberExpression') {
            const { callee } = node;
            const { object, property } = callee;
            if (object.type === 'Identifier' && object.name === 'exports' && property.type === 'Identifier') {
              object._skip = true;
              magicString.remove(object.start, property.start);
            }
          }
        }
      });

      code = magicString.toString();
      const map = sourceMap ? magicString.generateMap() : null;

      return { code, map };
    }
  };
};
