import { readFile } from 'node:fs/promises';
import { Stylesheet } from './stylesheet.js';
import { Token } from './token.js';
import { Config, SubToken } from './types.js';
import { MediaQuery } from './mediaQuery.js';

export async function generate(configFile: string) {
  const configFileContents = await readFile(configFile);
  const configJson = JSON.parse(
    configFileContents.toString(),
  ) as unknown as Config;
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

  for (const [type, value] of Object.entries(config)) {
    if (type === 'variants') continue;

    if (typeof value === 'object') {
      for (const [name, v] of Object.entries(value)) {
        if (typeof v === 'object') {
          const tmp = parseKeyValuePairs(v as SubToken, [type, name]);
          baseStylesheet.addTokens(undefined, ...tmp);
          continue;
        }

        baseStylesheet.addToken(new Token(name, v, type));
      }
    } else baseStylesheet.addToken(new Token(type, value));
  }

  if (config.variants) {
    for (const [query, values] of Object.entries(config.variants)) {
      const mq = new MediaQuery(query);
      const tokens = parseKeyValuePairs(values);
      tokens.forEach(token => {
        mq.addToken(token);
        baseStylesheet.addToken(token);
      });
      baseStylesheet.addQuery(mq);
    }
  }

  return baseStylesheet;
}

function parseKeyValuePairs(kv: SubToken, basis: string[] = []): Token[] {
  const returned: Token[] = [];
  for (const [key, value] of Object.entries(kv)) {
    if (typeof value === 'object' && !(value instanceof Token)) {
      returned.push(
        ...parseKeyValuePairs(value as SubToken, basis.concat(key)),
      );
    } else returned.push(new Token(key, value, basis.join('-')));
  }
  return returned;
}
