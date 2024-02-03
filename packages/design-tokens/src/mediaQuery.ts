import { Buildable } from './buildable.js';
import { Selector } from './selector.js';
import { Token, TokenConsumer } from './token.js';
import { normalizeCssQuery } from './util.js';

export class MediaQuery implements Buildable, TokenConsumer {
  static queries = new Map<string, MediaQuery>();
  #selector = new Selector(':root');

  constructor(
    public query: string,
    public screenOnly = false,
  ) {
    const normalized = normalizeCssQuery(query);
    if (MediaQuery.queries.has(`${normalized}_${screenOnly}`))
      return MediaQuery.queries.get(normalized) as MediaQuery;

    MediaQuery.queries.set(`${normalized}_${screenOnly}`, this);
    this.query = normalized;
  }

  build() {
    let output = `@media${
      this.screenOnly ? ' screen and' : ''
    } (${this.query}) {`;
    output += '\n' + this.#selector.build().split('\n').join('\n  ');
    output += '\n}';
    return output;
  }

  hasTokens() {
    return this.#selector.tokens.size > 0;
  }

  get selector() {
    return this.#selector.tokens;
  }

  addToken(token: Token): unknown {
    this.#selector.addToken(token);
    return this;
  }
}
