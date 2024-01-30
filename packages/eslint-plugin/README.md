# Core Fabrications ESLint Plugin

## Custom Rules

This plugin currently provides the following custom rules

1. [@jhecht/max-static-destructure-depth](#max-static-destructure-depth)
2. [@jhecht/prefer-destructuring](#prefer-destructuring)

### max-static-destructure-depth

This rule applies in contexts where you are utilizing destructuring, but you only wish to directly destructure a static length into a property.
The most common use case for this would be pulling variables from `process.env`, where the normal destructuring rules try to enforce a code style that honestly doesn't make a lot of sense.

```js
// example using ESLint's default destructuring rule

const { NODE_ENV, OTHER_VARIABLE } = process.env; // Will complain about this, suggesting it to be rewritten as
const {
  env: { NODE_ENV, OTHER_VARIABLE },
} = process; // Why?
```

`max-static-destructure-depth` takes an integer argument to determine how far down a developer should be allowed to destructure statically. It defaults to 2 levels, meaning with `max-static-destructure-depth` being enforced, our previous code

```js
const { NODE_ENV, OTHER_VARIABLE } = process.env; // a-ok

const { foo, bar } = some.nested.variable; // not okay, as we nest 3 levels here.
```

To change the maximum in your own ESLint config, simply add a line to your `rules` that looks like this

```json
"rules": {
  "@jhecht/max-static-destructure-depth": ["error", 4]
}
```

### prefer-destructuring

This is a carbon-copy of the ESLint [prefer-destructuring](https://eslint.org/docs/rules/prefer-destructuring) rule, modified not to output "errors" caused by our custom destructuring rule. Please see the link for any configuration documentation.

## Provided Configs

This plugin currently provides the following custom configs. **Note** Unless otherwise stated, these extend the `eslint:recommended` configuration.

1. plugin:@jhecht/recommended

### @jhecht/recommended

The recommended rule profile has the following values

```js
// We use semi colons
semi: ['error', 'always'],
// We use single quotes whenever possible, but allow double quotes to avoid escapes.
quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
// Destructuring is a helpful pattern
'prefer-destructuring': ['error', { array: true, object: true }, { enforceForRenamedProperties: true }],
// Curly bracers for multi-line or nested statements
curly: ['error', 'multi-or-nest'],
'arrow-body-style': ['error', 'as-needed'],
// If we don't need arrow parenthesis, we won't add them
'arrow-parens': ['error', 'as-needed'],
'@jhecht/max-static-destructure-depth': ['error', 2]
'@jhecht/prefer-destructuring': ['error', { array: true, object: true }, { enforceForRenamedProperties: true }]
```

## License

The license of this project is MIT. You are free to use and modify it to suit your needs so long as you understand that Core Fabrications is in no way offering support to your project.
