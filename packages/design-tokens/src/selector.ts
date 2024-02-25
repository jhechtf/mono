import { Token, TokenConsumer } from './token.js';

export class Selector implements TokenConsumer {
  tokens = new Set<Token>();

  constructor(public readonly selector: string = ':root') {}

  addToken(token: Token): Selector {
    this.tokens.add(token);
    return this;
  }
  build() {
    let output = `${this.selector} {`;
    for (const token of this.tokens.values())
      output += `\n  ${token.getCssKey()}: ${token.toCssValue()};`;

    output += '\n}';
    return output;
  }
}
