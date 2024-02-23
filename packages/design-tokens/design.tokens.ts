import { makeConfig } from './src/types.js';

export default makeConfig({
  tokens: {
    red: {
      100: 'lightred',
      500: 'red',
      900: 'darkred',
    },
    blue: {
      100: 'lightblue',
      500: 'blue',
      900: 'darkblue',
    },

    primary: '!blue.900',
    secondary: '!red.100',
  },
  variants: {
    'prefer-color-scheme: dark': {
      something: 'red',
      primary: '!blue.100',
    },
  },
});
