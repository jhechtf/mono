import maxStaticDestructureDepth from './lib/rules/max-static-destructure-depth';
import preferDestructuring from './lib/rules/prefer-destructuring';

export default {
  rules: {
    'max-static-destructure-depth': maxStaticDestructureDepth,
    'prefer-destructuring': preferDestructuring,
  },
  configs: {
    recommended: {
      plugins: ['@jhechtf/eslint-plugin'],
      extends: 'eslint:recommended',
      env: {
        es6: true,
        node: true,
      },
      parserOptions: {
        ecmaVersion: 2020
      },
      rules: {
        semi: ['error', 'always'],
        quotes: [
          'error',
          'single',
          { avoidEscape: true, allowTemplateLiterals: true },
        ],
        curly: ['error', 'multi-or-nest'],
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed'],
        '@jhechtf/max-static-destructure-depth': ['error', 2],
        '@jhechtf/prefer-destructuring': [
          'error',
          { array: true, object: true },
          { enforceForRenamedProperties: true },
        ],
      },
    },
  },
};
