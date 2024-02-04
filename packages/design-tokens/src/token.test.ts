import { describe, it, expect } from 'vitest';
import { Token } from './token.js';

describe('Tokens class', () => {
  it('Works for basic tokens', () => {
    const primaryToken = new Token('primary', 'blue');

    expect(primaryToken.toJsToken()).toBe(
      "export const primary = 'var(--primary)'",
    );
    const numberToken = new Token('number', 4);
    expect(numberToken.toCssValue()).toBe('4px');
    expect(primaryToken.toCssValue()).toBe('blue');
    expect(primaryToken.getCssKey()).toBe('--primary');
  });

  it('Works for nested tokens', () => {
    const [blueToken, redToken] = ['blue', 'red'].map(t => new Token(t, t));
    expect(blueToken.getCssKey()).toBe('--blue');
    expect(blueToken.toCssValue()).toBe('blue');
    expect(redToken.getCssKey()).toBe('--red');
    expect(redToken.toCssValue()).toBe('red');
    // make nested tokens;
    const primary = new Token('primary', blueToken);
    const secondary = new Token('secondary', redToken);

    expect(primary.getCssKey()).toBe('--primary');
    expect(primary.toCssValue()).toBe('var(--blue)');
    expect(secondary.getCssKey()).toBe('--secondary');
    expect(secondary.toCssValue()).toBe('var(--red)');

    expect(primary.toJsToken()).toBe("export const primary = 'var(--primary)'");
    expect(secondary.toJsToken()).toBe(
      "export const secondary = 'var(--secondary)'",
    );
  });

  it('Works for tokens with a type', () => {
    const primaryToken = new Token('primary', 'blue', 'color');
    expect(primaryToken.toJsToken()).toBe(
      "export const colorPrimary = 'var(--color-primary)'",
    );

    // Check a sub-token situation
    const secondaryToken = new Token('secondary', primaryToken);
    expect(secondaryToken.getCssKey()).toBe('--secondary');
    expect(secondaryToken.toCssValue()).toBe('var(--color-primary)');
    expect(secondaryToken.toJsToken()).toBe(
      "export const secondary = 'var(--secondary)'",
    );
  });

  it('Works with names that have multiple dashes', () => {
    const veryNestedToken = new Token('deep', 10, 'this-is-nested-very');
    expect(veryNestedToken.getCssKey()).toBe('--this-is-nested-very-deep');
    expect(veryNestedToken.toJsToken()).toBe(
      "export const thisIsNestedVeryDeep = 'var(--this-is-nested-very-deep)'",
    );
    expect(veryNestedToken.toCssValue()).toBe('10px');
  });
});
