import { Token } from './token.js';

export type CssValue = number | string | Token;
export type SubToken = Record<string | number, CssValue>;
export type TokenMap = Record<string, CssValue | SubToken>;

export interface TypeMap {
  [type: string]: TokenMap;
}

export type CConfig = {
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
} & {
  [key: string]:
    | number
    | string
    | Token
    | {
        [key: string]: number | string | Token;
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

const makeConfig = <T extends Record<string, unknown>>(
  config: WithReferences<T>,
) =>
  // TODO: resolve references at runtime here
  config as ResolveReferences<T>;

export type Config = typeof config;

type WithReferences<T extends Record<string, unknown>> =
  ObjectKeyPaths<T> extends infer Keys extends string
    ? WithReferencesHelper<T, `!${Keys}`>
    : never;

type WithReferencesHelper<T, Keys extends string> = T extends object
  ? {
      [Key in keyof T]: T[Key] extends string
        ? // TODO: disallow circular references
          Keys | (string & {})
        : WithReferencesHelper<T[Key], Keys>;
    }
  : T;

type ResolveReferences<T, Root = T> = T extends object
  ? {
      [Key in keyof T]: T[Key] extends `!${infer Path extends string}`
        ? Get<Root, Path>
        : ResolveReferences<T[Key], Root>;
    }
  : T;

type ObjectKeyPaths<
  T extends object,
  IsRoot extends boolean = true,
  K extends keyof T = keyof T,
> = K extends string | number
  ?
      | ExpandKey<K, IsRoot>
      | (T[K] extends object
          ? `${ExpandKey<K, IsRoot>}${ObjectKeyPaths<T[K], false>}`
          : never)
  : never;

type ExpandKey<
  K extends string | number,
  IsRoot extends boolean,
> = IsRoot extends true ? `${K}` : `.${K}`;

type Get<T, K> = K extends `${infer Key}.${infer Rest}`
  ? Get<GetKey<T, Key>, Rest>
  : GetKey<T, K>;

type GetKey<T, K> = K extends keyof T ? T[K] : never;

const conf = makeConfig({
  a: 'string',
  b: '!a',
  c: {
    nested: 1,
    b: 3,
    v: {
      deeply: {
        nested: 'bob',
      },
    },
  },
  d: '!c.nested',
  e: '!c.v.deeply.nested',
});
