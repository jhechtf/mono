export type Config<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  configFile?: string;
  outputDir?: string;
  tokens: WithReferences<T>;
  variants?: {
    [query: string]: WithReferences<T>;
  };
};

export const bob = <T extends Record<string, unknown>>(config: Config<T>) =>
  config.tokens as ResolveReferences<T>;

export const makeConfig = <T extends Record<string, unknown>>(
  config: Config<T>,
) =>
  // TODO: resolve references at runtime here
  config.tokens as ResolveReferences<T>;

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
