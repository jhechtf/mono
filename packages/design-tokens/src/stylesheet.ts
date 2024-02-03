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
  // Used for tokens that reference one that has yet to be resolved in build
  needsResolving = new Map<string, Token[]>();
  // Complete list of all tokens
  tokenRefs = new Map<string, Token>();

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

  addResolveRef(token: Token): Stylesheet {
    if (typeof token.value === 'string' && token.value.startsWith('!')) {
      const tokenName = token.value.slice(1);
      if (!this.needsResolving.has(tokenName))
        this.needsResolving.set(tokenName, []);

      const arr = this.needsResolving.get(tokenName);
      arr.push(token);
    }
    return this;
  }

  addToken(token: Token, selector: Selector = this.#root) {
    // If this is a reference to another token value, look it up and set it to
    // that value, otherwise, add it to the de-referencing queue
    if (typeof token.value === 'string' && token.value.startsWith('!'))
      this.addResolveRef(token);
    else {
      if (this.needsResolving.has(token.refName)) {
        const tokens = this.needsResolving.get(token.refName);
        for (const t of tokens) t.value = token;

        this.needsResolving.delete(token.refName);
      }
    }
    // Thought: should maybe look stuff up here once we add in the media query stuff??
    this.tokenRefs.set(token.refName, token);

    if (!this.selectors.has(selector)) this.selectors.add(selector);
    selector.addToken(token);
    return this;
  }

  addTokens(selector: Selector = this.#root, ...tokens: Token[]) {
    if (!this.selectors.has(selector)) this.selectors.add(selector);
    tokens.forEach(token => {
      this.addToken(token, selector);
      // console.info(token);
      // selector.addToken(token);
      // this.tokenRefs.set()
    });
    return this;
  }

  addQuery(query: MediaQuery) {
    // This line reads terribly wtf was i thinking
    if (!this.queries.has(query.query)) this.queries.set(query.query, query);
    return this;
  }

  resolveRefs() {
    for (const [ref, tokens] of this.needsResolving.entries()) {
      if (this.tokenRefs.has(ref)) {
        const token = this.tokenRefs.get(ref);
        tokens.forEach(t => (t.value = token));
        this.needsResolving.delete(ref);
      }
    }
  }

  build() {
    // Try to resolve the references that might be remaining
    this.resolveRefs();
    // If after all that we have unresolved references, throw an error
    if (this.needsResolving.size > 0) throw new Error('Unresolved references');
    // the object
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
    for (const mq of this.queries.values())
      if (mq.hasTokens()) output += mq.build() + '\n';

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
      output += `\n$${token.getCssKey().slice(2)}: ${token.toCssValue()} !default;`;
    return output;
  }
}
