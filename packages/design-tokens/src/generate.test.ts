import { describe, it, expect } from 'vitest';
import { buildStylesheet } from './generate.js';
import type { Config } from './types.js';

describe('Generate functions', () => {
  it('Builds a thing', async () => {
    const config: Config = {
      primary: '!color.a',
      bob: '!color.a',
      color: {
        a: 'blue',
        // blues: {
        //   300: '#11ff91',
        // },
      },
      // variants: {
      //   'prefers-color-schema: dark': {
      //     color: {
      //       a: 'red',
      //     },
      //   },
      // },
    };
    const bob = await buildStylesheet(config);
    const output = bob.build();
    console.info(output);
    expect(1).toBe(1);
  });
});
