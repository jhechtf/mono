import { MediaQuery } from './mediaQuery.js';
import { camelCase } from './util.js';
export class Token {
  queries = new Set<MediaQuery>();

  public value: string | Token;

  constructor(
    public key: string,
    value: string | number | Token,
    public type = '',
  ) {
    this.value = typeof value === 'number' ? `${value}px` : value;
  }

  addMediaQueryValue(mq: MediaQuery, value: string | Token): Token {
    if (typeof value === 'string')
      value = new Token(this.key, value, this.type);
    else value = new Token(this.key, value);

    mq.addToken(value);
    this.queries.add(mq);

    return this;
  }

  getCssKey() {
    return `--${this.type !== '' ? `${this.type}-` : ''}${this.key}`;
  }
  toCssValue(): string {
    if (this.value instanceof Token) return `var(${this.value.getCssKey()})`;

    return this.value;
  }
  toJsToken() {
    return `export const ${camelCase(
      `${this.type !== '' ? `${this.type}-` : ''}${this.key}`,
    )} = 'var(${this.getCssKey()})'`;
  }
}

export interface TokenConsumer {
  addToken(token: Token, ...args: unknown[]): unknown;
}
