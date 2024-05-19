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

export const makeConfig = <T extends Record<string, unknown>>(
  config: Config<T>,
) =>
  // TODO: resolve references at runtime here
  config as Config<T> & ResolveReferences<T>;

type WithReferences<T extends Record<string, unknown>> =
  ObjectKeyPaths<T> extends infer Keys extends string
    ? WithReferencesHelper<T, `!${Keys}`>
    : never;

type WithReferencesHelper<T, Keys extends string> = T extends object
  ? {
      [Key in keyof T]: T[Key] extends string
        ? // TODO: disallow circular references
          Keys | (string & NonNullable<unknown>)
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
