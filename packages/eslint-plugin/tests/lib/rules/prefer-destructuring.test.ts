/**
 *
 * @fileoverview Fuck you
 * @author @jhechtf
 */
'use strict';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/prefer-destructuring';
import { RuleTester } from 'eslint';
import { describe, it, beforeAll } from 'vitest';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('Prefer Destructuring', () => {
  let ruleTester: RuleTester;
  beforeAll(() => {
    ruleTester = new RuleTester({
      env: {
        es6: true,
      },
    });
  });
  it('works as expected', () => {
    ruleTester.run('prefer-destructuring', rule, {
      valid: [
        {
          code: 'var [ foo ] = array;',
        },
        {
          code: 'var foo = array[someIndex];',
        },
        {
          code: 'var { bar } = object.foo',
        },
      ],
      invalid: [
        {
          code: 'var foo = array[0];',
          errors: [
            {
              messageId: 'preferDestructuring',
            },
          ],
        },
        {
          code: "const foo = object['foo']",
          errors: [
            {
              messageId: 'preferDestructuring',
            },
          ],
        },
      ],
    });
  });
});
