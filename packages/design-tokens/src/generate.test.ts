import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { build, buildStylesheet } from './generate.js';
import type { Config } from './types.js';
import { Token } from './token.js';
import { Stylesheet } from './stylesheet.js';
import { MediaQuery } from './mediaQuery.js';

describe('Generate functions', () => {
  it('Builds a thing', async () => {
    const config: Config = {
      tokens: {
        primary: '!color.a',
        bob: '!color.a',
        waffle: '!color.b',
        color: {
          a: 'blue',
          blues: {
            300: '#11ff91',
          },
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
          expect(node.value).toBe('blue');

        // default:
        //   throw new Error('How did we get here');
      }
    });

    expect(1).toBe(1);
  });
  describe('Outputs files in the correct locations', () => {
    it('does a thing', async () => {
      const d = new Token('red-100', 'lightred');
      const b = new Token('primary', '!red.100');
      const s = new Stylesheet();
      s.addToken(d);
      const m = new MediaQuery('prefers-color-scheme: dark');
      s.addQuery(m);
      m.addToken(b);
      const f = s.build();
      console.info('Testing', f);
      const output = await build({
        configFile: '../tests/builds/base/design.tokens.ts',
      });

      expect(output).toBeTruthy();
      const cssFile = resolve(
        import.meta.dirname,
        '../tests/builds/base/tokens.css',
      );

      expect(existsSync(cssFile)).toBeTruthy();
      // TODO: Figure out how to change testing directory
    });
  });
});
