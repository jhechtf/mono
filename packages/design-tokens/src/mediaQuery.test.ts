import { describe, it, expect } from 'vitest';
import { MediaQuery } from './mediaQuery.js';
import { Token } from './token.js';

describe('MediaQuery class', () => {
  it('Keeps the uniqueness of media queries', () => {
    const dark1 = new MediaQuery('prefers-color-schema: dark');
    const dark2 = new MediaQuery('prefers-color-schema: dark');
    expect(dark1).toStrictEqual(dark2);
  });

  it('Works with tokens', () => {
    const darkQuery = new MediaQuery('prefers-color-scheme: dark', true);
    const token = new Token('primary', 'blue', 'color');
    darkQuery.addToken(token);
    const output = darkQuery.build();
    expect(output).toMatch(/@media screen and \(prefers-color-scheme: dark\)/);
    expect(output).toContain(':root {');
    expect(output).toMatch(
      /@media screen and \(prefers-color-scheme: dark\)\s?\{[\s\S]+:root\s?\{[\s\S]*\}[\s\S]+\}/,
    );
    expect(output).toContain('--color-primary: blue;');
  });
});
