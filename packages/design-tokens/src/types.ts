import { Token } from './token.js';

export type CssValue = number | string | Token;
export type SubToken = Record<number, CssValue>;
export type TokenMap = Record<string, CssValue | SubToken>;

export interface TypeMap {
  [type: string]: TokenMap;
}

export type Config = TypeMap & {
  variants?: {
    [query: string]: TypeMap;
  };
};

export type CConfig = {
  [key: string]:
    | number
    | string
    | Token
    | {
        [key: string]: number | string | Token;
      };
  variants: {
    [query: string]: {
      [key: string]:
        | number
        | string
        | Token
        | {
            [key: string]: number | string | Token;
          };
    };
  };
};

/**
 * Example for jim's brain
 */
export const config = {
  colors: {
    purple: '#f0f',
    blue: '#00f',
    green: '#0f0',
    yellow: '#ff0',
    teal: '#0ff',
  },
  size: {
    s: '0.5em',
    m: '1em',
    lg: '1.25em',
  },
  primary: '!colors.purple',
  accent: '!primary',
  variants: {
    'prefers-color-schema: dark': {
      primary: '!colors.teal',
    },
  },
};

/**
 * Should output:
 * :root {
 *   --colors-purple: ...,
 *   --primary: var(--colors-purple);
 *   --accent: var(--primary);
 * }
 *
 * @media (prefers-color-schema: dark) {
 *    :root {
 *      primary: var(--colors-teal)
 *    }
 * }
 */
