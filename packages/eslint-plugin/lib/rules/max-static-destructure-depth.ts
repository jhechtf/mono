/**
 * @fileoverview Maximum allowable static destructure depth
 * @author @jhechtf
 */
'use strict';
import type { Rule } from 'eslint';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const maxStaticDepth: Rule.RuleModule = {
  meta: {
    messages: {
      maximumDepthBreach:
        'Destructure depth of {{actual}} exceeds maximum allowed of {{allowed}}',
    },
    docs: {
      description: 'Fuck you',
      category: 'Fill me in',
      recommended: false,
    },
    schema: [
      {
        oneOf: [
          {
            type: 'integer',
            minimum: 1,
          },
        ],
      },
    ],
  },
  create: function (context: Rule.RuleContext) {
    const { getSourceCode, options } = context;
    const sourceCode = getSourceCode();
    const [depth = 2] = options;

    return {
      VariableDeclarator(node) {
        if (
          node.id.type === 'ObjectPattern' &&
          node.init &&
          node.init.type === 'MemberExpression'
        ) {
          const sourceText = sourceCode.getText(node.init);
          // eslint-disable-next-line @jhecht/prefer-destructuring
          const sourceDepth = sourceText.split('.').length;
          if (sourceDepth > depth) {
            context.report({
              node: node.init,
              messageId: 'maximumDepthBreach',
              data: {
                actual: sourceDepth.toString(),
                allowed: depth,
              },
            });
          }
        }
      },
    };
  },
};

export default maxStaticDepth;
