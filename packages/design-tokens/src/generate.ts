import { readFile } from 'node:fs/promises';
import { Stylesheet } from './stylesheet.js';
import { Token } from './token.js';
import { Config } from './types.js';
import { MediaQuery } from './mediaQuery.js';

export async function generate(configFile: string) {
  const f = await readFile(configFile);
  console.info(f.toString());
  const b = JSON.stringify(f.toString()) as unknown as Config;
  const bob = await buildStylesheet(b);
  return bob;
}

/**
 *
 * @param config a config object
 * @returns a stylesheet
 */
export async function buildStylesheet(config: Config): Promise<Stylesheet> {
  const baseStylesheet = new Stylesheet();

  for (const [type, value] of Object.entries(config)) {
    if (type === 'variants') continue;

    for (const [name, v] of Object.entries(value))
      baseStylesheet.addToken(new Token(name, v, type));
  }

  if (config.variants) {
    for (const [queryValue, map] of Object.entries(config.variants)) {
      const query = new MediaQuery(queryValue);
      for (const [type, kv] of Object.entries(map)) {
        for (const [key, value] of Object.entries(kv))
          query.addToken(new Token(key, value, type));
      }
      baseStylesheet.addQuery(query);
    }
  }

  return baseStylesheet;
}
