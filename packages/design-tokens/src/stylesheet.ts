import { MediaQuery } from './mediaQuery.js';
import { Selector } from './selector.js';
import { Token, TokenConsumer } from './token.js';

export interface BuildOptions {
  directory?: string;
  fileName?: string | Record<'js' | 'css', string>;
}

export class Stylesheet implements TokenConsumer {
  queries = new Map<string, MediaQuery>();
  selectors = new Set<Selector>();

  #root = new Selector(':root');

  constructor() {
    this.selectors.add(this.#root);
  }

  addSelector(selector: Selector) {
    this.selectors.add(selector);
    return this;
  }

  addSelectors(...args: Selector[]) {
    args.forEach(sel => this.addSelector(sel));
    return this;
  }

  addToken(token: Token, selector: Selector = this.#root) {
    if (!this.selectors.has(selector)) this.selectors.add(selector);
    selector.addToken(token);
    return this;
  }

  addTokens(selector: Selector = this.#root, ...tokens: Token[]) {
    if (!this.selectors.has(selector)) this.selectors.add(selector);
    tokens.forEach(token => selector.addToken(token));
    return this;
  }

  addQuery(query: MediaQuery) {
    // This line reads terribly wtf was i thinking
    if (!this.queries.has(query.query)) this.queries.set(query.query, query);
    return this;
  }

  build() {
    return {
      css: this.buildCss(),
      js: this.buildJs(),
      scss: this.buildScss(),
    };
  }

  buildCss() {
    let output = '';
    for (const selector of this.selectors.values()) output += selector.build();

    output += '\n\n';
    for (const mq of this.queries.values()) {
      if (mq.hasTokens()) output += mq.build() + '\n';
    }
    return output;
  }

  buildJs() {
    let output = '';
    for (const token of this.#root.tokens.values())
      output += token.toJsToken() + ';\n';

    return output;
  }

  buildScss() {
    let output = '';
    for (const token of this.#root.tokens.values())
      output += `\n$${token.getCssKey().slice(2)}: ${token.value} !default;`;
    return output;
  }
}
