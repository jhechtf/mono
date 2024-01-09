/**
 * @fileoverview Testing max static destructure depth
 * @author @jhechtf
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/max-static-destructure-depth.js';
import { RuleTester } from 'eslint';
import { describe, it, beforeAll } from 'vitest';


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('Max static-destructure-depth', () => {

  let ruleTester: RuleTester;

  beforeAll(() => {
    ruleTester = new RuleTester({
      env: {
        es6: true,
      }
    })
  });

  it('Runs correct', () => {
    ruleTester.run("max-static-destructure-depth", rule, {
      valid: [
        // Check destructure with default values
        {
          code: 'const { DB_NAME = \'dev\', DB_HOST = \'127.0.0.1\', DB_PASS = \'verySecure\' } = process.env'
        },
        // check destructure without default values
        {
          code: "const {a,b,c} = some.variable.depth;",
          options: [5]
        },
        {
          code: "let {a, b, c} = someFunctionCall();"
        }
      ],
      invalid: [
        {
          code: "const {a, b, c} = process.env.something",
          errors: [{
            messageId: 'maximumDepthBreach',
            data: {
              actual: 3,
              allowed: 2
            }
          }]
        },
        {
          code: 'const {a,b,c} = some.variable.depth.longer',
          errors: [{
            messageId: 'maximumDepthBreach',
            data: {
              actual: 4,
              allowed: 3
            }
          }],
          options: [3]
        }
      ],

    });

  });

});

