import { makeConfig } from '../../../src/types.js';

export default makeConfig({
  red: {
    100: 'lightred',
    500: 'red',
    900: 'darkred',
  },

  primary: '!red.900',
  secondary: 'blue',

  variants: {
    'prefers-color-scheme: dark': {
      primary: '!red.100',
    },
  },
});
