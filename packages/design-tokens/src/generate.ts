import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { Stylesheet } from './stylesheet.js';
import { CssValue, Token } from './token.js';
import type { Config } from './types.js';
import { MediaQuery } from './mediaQuery.js';

export interface BuildArgs {
  configFile?: string;
  noJs?: boolean;
  noScss?: boolean;
  noCss?: boolean;
}

export async function build({
  configFile = './design.tokens.ts',
  noCss = false,
  noJs = false,
  noScss = false,
}: BuildArgs) {
  /**
   * 1. Determine the config file, based on passed args
   * 2. Generate the Stylesheet
   * 3. Write out the files.
   */

  const fileName = resolve(import.meta.dirname, configFile);

  const rawFile = await import(fileName).then((r) => r.default);
  const stylesheet = await buildStylesheet(rawFile);

  const output = stylesheet.build();

  const resp = await Promise.allSettled([
    writeFile(resolve(dirname(fileName), 'tokens.css'), output.css),
    writeFile(resolve(dirname(fileName), 'tokens.js'), output.js),
    writeFile(resolve(dirname(fileName), 'tokens.scss'), output.scss),
  ]);

  return resp.every((r) => r.status === 'fulfilled');
}

/**
 *
 * @param configFile file path.
 * @returns
 */
export async function generate(configFile: string) {
  const configFileContents = await readFile(configFile);
  const configJson = JSON.parse(
    configFileContents.toString(),
  ) as unknown as Config;
  console.info('from generate ?');
  const stylesheet = await buildStylesheet(configJson);

  return stylesheet;
}

/**
 *
 * @param config a config object
 * @returns a stylesheet
 */
export async function buildStylesheet(config: Config): Promise<Stylesheet> {
  const baseStylesheet = new Stylesheet();

  for (const [type, value] of Object.entries(config.tokens)) {
    if (typeof value === 'object') {
      for (const [name, v] of Object.entries(value)) {
        if (typeof v === 'object') {
          const tmp = parseKeyValuePairs(v as Record<string, unknown>, [
            type,
            name,
          ]);
          baseStylesheet.addTokens(undefined, ...tmp);
          continue;
        }

        baseStylesheet.addToken(new Token(name, v, type));
      }
    } else baseStylesheet.addToken(new Token(type, value as CssValue));
  }

  // We are now looking at media queries
  if (config.variants) {
    // Get the query to use for the MediaQuery and the values which we will turn into Tokens
    for (const [query, values] of Object.entries(config.variants)) {
      // Create the MediaQuery. because of how the MediaQuery constructor is setup
      // there will only ever be 1 instance of the normalized media query value
      const mq = new MediaQuery(query);
      // parses the values into tokens.
      const tokens = parseKeyValuePairs(values);
      // Iterate over the tokens, adding each one to the MediaQuery
      tokens.forEach((token) => {
        mq.addToken(token);
        baseStylesheet.addResolveRef(token);
      });
      // Add the MQ to the base stylesheet
      baseStylesheet.addQuery(mq);
    }
  }

  return baseStylesheet;
}

function parseKeyValuePairs(
  kv: Record<string, unknown>,
  basis: string[] = [],
): Token[] {
  const returned: Token[] = [];
  for (const [key, value] of Object.entries(kv)) {
    if (typeof value === 'object' && !(value instanceof Token)) {
      returned.push(
        ...parseKeyValuePairs(
          value as Record<string, unknown>,
          basis.concat(key),
        ),
      );
    } else returned.push(new Token(key, value as CssValue, basis.join('-')));
  }
  return returned;
}
