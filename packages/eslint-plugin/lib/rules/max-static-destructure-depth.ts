/**
 * @fileoverview Maximum allowable static destructure depth
 * @author Core Fabrications
 */
"use strict";
import type { Rule } from 'eslint';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
  meta: {
    messages: {
      maximumDepthBreach: 'Destructure depth of {{actual}} exceeds maximum allowed of {{allowed}}'
    },
    docs: {
      description: "Fuck you",
      category: "Fill me in",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        oneOf: [
          {
            type: "integer",
            minimum: 1
          }
        ]
      }
    ]
  },
  /**
   * 
   * @param {import('eslint').Rule.RuleContext} context 
   */
  create: function (context) {
    const { getSourceCode, options } = context;
    const sourceCode = getSourceCode();
    const [depth = 2] = options;

    return {
      VariableDeclarator(node) {
        if (node.id.type === 'ObjectPattern' && node.init.type === 'MemberExpression') {
          const sourceText = sourceCode.getText(node.init);
          const sourceDepth = sourceText.split('.').length;
          if (sourceDepth > depth) {
            context.report({
              node: node.init,
              messageId: 'maximumDepthBreach',
              data: {
                actual: sourceDepth.toString(),
                allowed: depth
              }
            });
          }
        }
      }
    };
  }
} satisfies Rule.RuleModule;
