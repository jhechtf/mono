import { describe, it, expect } from 'vitest';
import { throttle, asyncThrottle } from './throttle.js';
import { vi } from 'vitest';
import { waitFor } from './util.js';

const example = vi.fn();
const exampleReturn = vi.fn((n: number) => n);

describe('Throttle', () => {
  it('Works in the batches', async () => {
    const throttled = throttle(example, 50);
    throttled(1);
    throttled(2);
    throttled(3);
    await waitFor(100);
    expect(example).toBeCalledWith(3);
    expect(example).toBeCalledTimes(1);
  });
});

describe('Async Throttle', () => {
  it('Works for multiple calls', async () => {
    const throttled = asyncThrottle(exampleReturn, 50);
    let all: unknown = Promise.all([throttled(1), throttled(2), throttled(3)]);

    expect(await all).toStrictEqual([3, 3, 3]);

    expect(
      await Promise.all([throttled(4), throttled(5), throttled(6)]),
    ).toStrictEqual([6, 6, 6]);

    const a = [throttled(1), throttled(2), throttled(3)];
    await waitFor(75);
    a.push(throttled(4));

    all = Promise.all(a);

    expect(await all).toStrictEqual([3, 3, 3, 4]);

    expect(exampleReturn).toHaveBeenCalledTimes(4);
  });
});
