import { MediaQuery } from './mediaQuery.js';
import { camelCase } from './util.js';

export type CssValue = string | number | Token;

export class Token {
  queries = new Set<MediaQuery>();

  public value: string | Token;

  constructor(
    public key: string,
    value: CssValue,
    public type = '',
  ) {
    this.value = typeof value === 'number' ? `${value}px` : value;
  }

  addMediaQueryValue(mq: MediaQuery, value: CssValue): Token {
    if (typeof value === 'string')
      value = new Token(this.key, value, this.type);
    else value = new Token(this.key, value);

    mq.addToken(value);
    this.queries.add(mq);

    return this;
  }

  get refName() {
    return this.getCssKey().slice(2).replace(/-/g, '.');
  }

  get jsTokenName() {
    return camelCase(`${this.type !== '' ? `${this.type}-` : ''}${this.key}`);
  }

  getCssKey() {
    return `--${this.type !== '' ? `${this.type}-` : ''}${this.key}`;
  }

  toCssValue(): string {
    if (this.value instanceof Token) return `var(${this.value.getCssKey()})`;

    return this.value;
  }

  toJsToken() {
    return `export const ${this.jsTokenName} = 'var(${this.getCssKey()})'`;
  }
}

export interface TokenConsumer {
  addToken(token: Token, ...args: unknown[]): unknown;
}
