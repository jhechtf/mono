import { makeConfig } from './src/types.js';

export default makeConfig({
  something: 'blue',
  variants: {
    'prefer-color-scheme: dark': {
      something: 'red',
    },
  },
});
