import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { buildStylesheet, build } from './generate.js';
import type { Config } from './types.js';

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

    expect(parsed.first.nodes).toHaveLength(4);

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
  describe('Build', () => {
    it('does a thing', async () => {
      const bob = await build({
        configFile: '../design.tokens.ts',
      });
      // TODO: Figure out how to change testing directory
      console.info('hi you', bob);
    });
  });
});
