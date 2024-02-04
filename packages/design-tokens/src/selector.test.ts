import { describe, it, expect } from 'vitest';
import { Selector } from './selector.js';
import { Token } from './token.js';

describe('Selector class', () => {
  it('Outputs an empty declaration', () => {
    const selector = new Selector();
    const output = selector.build();
    console.info(output);
    const hardcoded = ':root {\n}';
    expect(output).toBe(hardcoded);
  });

  it('Works with tokens', () => {
    const selector = new Selector();
    const primaryToken = new Token('primary', 'value');
    const secondaryToken = new Token('secondary', '10px', 'size');

    selector.addToken(primaryToken).addToken(secondaryToken);

    const output = selector.build();

    expect(output).toContain('--primary: value;');
    expect(output).toContain('--size-secondary: 10px');
  });

  it('Works with a custom selector', () => {
    const selector = new Selector('@media (prefers-color-scheme: light)');
    const primaryToken = new Token('primary', 'value');
    selector.addToken(primaryToken);
    const output = selector.build();
    expect(
      output.startsWith('@media (prefers-color-scheme: light)'),
    ).toBeTruthy();
    expect(output).toContain('--primary: value;');
  });
});
