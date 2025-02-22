import { describe, expect, it } from 'vitest';
import { strToObject } from './strToObject.js';

describe('strToObjects', () => {
  it('does a thing', () => {
    expect(1).toBe(1);
    expect(strToObject('a', 3)).toStrictEqual({
      a: 3,
    });

    expect(strToObject('a.b', 3)).toStrictEqual({
      a: {
        b: 3,
      },
    });
    // const a = strToObject('a[4]', 3);
    // expect(a.a[4]).toBe(3);
    // expect(a.a).toHaveLength(5);
    // expect(a.a.slice(0, 3).every(f => f === undefined)).toBeTruthy();
    // expect(1).toBe(1);

    // const b = strToObject('b[]', 7);
    // expect(b.b).toHaveLength(1);
    // expect(b.b[0]).toBe(7);

    // expect(strToObject('a', 3)).toStrictEqual({
    //   a: 3,
    // });
    // const a = strToObject('a.b', 3);
    // expect(a).toStrictEqual({
    //   a: {
    //     b: 3
    //   }
    // });
    // const b = strToObject('a[]', 3);

    // expect(b).toStrictEqual({
    //   a: [3],
    // });

    // const c = strToObject('a.b.c[]', 4);

    // expect(c).toStrictEqual({
    //   a: {
    //     b: {
    //       c: [4],
    //     },
    //   },
    // });

    // expect(strToObject('a', 3, { b: 7 })).toStrictEqual({
    //   a: 3,
    //   b: 7,
    // });
  });

  // expect(strToObject('a[].b[]', 7)).toStrictEqual({
  //   a: [
  //     { b: [7] }
  //   ]
  // });
});
