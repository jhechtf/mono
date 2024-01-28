import { describe, it, expect } from 'vitest';
import { validateObject } from './validator.js';
import { type } from 'arktype';

describe('Validators', () => {
  it('Works as expected', () => {
    let values = validateObject({ a: 'hi' }, type({ a: 'string>=2' }));
    expect(values).toStrictEqual({
      a: 'hi'
    });
    expect(() => validateObject({ a: 'hi' }, type({ a: 'string>=3' }))).toThrow();
  });
});