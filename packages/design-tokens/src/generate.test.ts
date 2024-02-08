import { describe, it, expect } from 'vitest';
import { buildStylesheet } from './generate.js';
import type { Config } from './types.js';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import postcss from 'postcss';

describe('Generate functions', () => {
  it('Builds a thing', async () => {
    const config: Config = {
      primary: '!color.a',
      bob: '!color.a',
      color: {
        a: 'blue',
        blues: {
          300: '#11ff91',
        },
      },
      variants: {
        'prefers-color-schema: dark': {
          color: {
            a: 'red',
            taco: '!color.a',
          },
        },
      },
    };

    const stylesheetFromConfig = await buildStylesheet(config);
    const output = stylesheetFromConfig.build();
    const parsed = postcss.parse(output.css);
    expect(parsed.first.type).toBe('rule');

    if (parsed.first.type !== 'rule') throw new Error('Wrong output');

    expect(parsed.first.nodes).toHaveLength(6);

    parsed.first.nodes.forEach(node => {
      expect(node.type).toBe('decl');
      if (node.type !== 'decl') throw new Error('Node is wrong type');
      switch (node.prop) {
        case '--primary':
          expect(node.value).toBe('var(--color-a)');
          break;
        case '--bob':
          expect(node.value).toBe('var(--color-a)');
          break;
        case '--color-a':
          console.info(node);
          expect(node.value).toBe('blue');

        // default:
        //   throw new Error('How did we get here');
      }
    });

    expect(1).toBe(1);
  });
});
