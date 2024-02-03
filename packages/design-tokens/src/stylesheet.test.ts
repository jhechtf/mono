import { describe, it, expect } from 'vitest';
import { Stylesheet } from './stylesheet.js';
import { Token } from './token.js';
import { MediaQuery } from './mediaQuery.js';
import postcss from 'postcss';

describe('Stylesheet class', () => {
  it('Should output a blank stylesheet', () => {
    const sheet = new Stylesheet();
    const output = sheet.build();
    expect(
      Object.values(output)
    ).toHaveLength(3);

    expect(output.js).not.toBeUndefined();
    expect(output.css).not.toBeUndefined();
    expect(output.scss).not.toBeUndefined();

    expect(output.js).toBe('');
    expect(output.css.replace(/\n/g, '')).toBe(':root {}');
    expect(output.scss).toBe('');

  });

  it('should work with some values', () => {
    const styles = new Stylesheet();
    const primary = new Token('primary', 'blue');
    styles.addToken(primary);

    const output = styles.build();

    expect(output.js).toStrictEqual('export const colorPrimary = \'var(--color-primary)\';\n');
    expect(output.css).toBe(':root {\n  --color-primary: blue;\n}\n\n');
    expect(output.scss).toBe('\n$color-primary: blue !default;');
  });

  it('should work with media queries', () => {
    const styles = new Stylesheet();
    const mq = new MediaQuery('prefers-color-scheme: dark');
    const primary = new Token('primary', 'blue');

    primary.addMediaQueryValue(mq, 'red');
    styles.addQuery(mq);
    styles.addToken(primary);

    const output = styles.build();

    expect(output.js).toBe('export const colorPrimary = \'var(--color-primary)\';\n');

    expect(output.css).toContain('--color-primary: blue');
    const parsedCss = postcss.parse(output.css);

    expect(parsedCss.nodes).toHaveLength(2);
    expect(parsedCss.nodes[0].type).toBe('rule');
    expect(parsedCss.nodes[0]).toHaveProperty('nodes');

    const [
      decl
    ] = (parsedCss.nodes[0] as postcss.Rule).nodes as [postcss.Declaration];

    expect(decl.type).toBe('decl');
    expect(decl.prop).toBe('--color-primary');
    expect(decl.value).toBe('blue');

    expect(parsedCss.nodes[1].type).toBe('atrule');
    const atRule = parsedCss.nodes[1] as postcss.AtRule;
    expect(atRule.params).toBe('(prefers-color-scheme: dark)');
    expect(atRule.nodes).toHaveLength(1);
    const [baseRule] = atRule.nodes as [postcss.Rule];
    expect(baseRule.selector).toBe(':root');
    const [mediaRuleDecl] = baseRule.nodes as [postcss.Declaration];

    expect(mediaRuleDecl.prop).toBe('--color-primary');
    expect(mediaRuleDecl.value).toBe('red');

  });
});