import { describe, it, expect } from 'vitest';
import { Token } from './token.js';

describe('Tokens class', () => {
  it('Works for basic tokens', () => {
    const primaryToken = new Token('primary', 'blue');

    expect(primaryToken.toJsToken()).toBe(
      "export const colorPrimary = 'var(--color-primary)'",
    );
    const numberToken = new Token('number', 4);
    expect(numberToken.toCssValue()).toBe('4px');
    expect(primaryToken.toCssValue()).toBe('blue');
    expect(primaryToken.getCssKey()).toBe('--color-primary');
  });

  it('Works for nested tokens', () => {
    const [blueToken, redToken] = ['blue', 'red'].map((t) => new Token(t, t));
    expect(blueToken.getCssKey()).toBe('--color-blue');
    expect(blueToken.toCssValue()).toBe('blue');
    expect(redToken.getCssKey()).toBe('--color-red');
    expect(redToken.toCssValue()).toBe('red');
    // make nested tokens;
    const primary = new Token('primary', blueToken);
    const secondary = new Token('secondary', redToken);

    expect(primary.getCssKey()).toBe('--color-primary');
    expect(primary.toCssValue()).toBe('var(--color-blue)');
    expect(secondary.getCssKey()).toBe('--color-secondary');
    expect(secondary.toCssValue()).toBe('var(--color-red)');

    expect(primary.toJsToken()).toBe(
      "export const colorPrimary = 'var(--color-primary)'",
    );
    expect(secondary.toJsToken()).toBe(
      "export const colorSecondary = 'var(--color-secondary)'",
    );
  });
});
