import { debounce } from './debounce.js';
import { expect, describe, it } from 'vitest';
import { waitFor } from './util.js';
import { vi } from 'vitest';

const bob = vi.fn();

describe('Debounce', () => {
  it('Works', async () => {
    const debouncedBob = debounce(bob);
    debouncedBob(1);
    debouncedBob(2);
    debouncedBob(3);
    await waitFor(301);
    expect(bob).toHaveBeenCalledTimes(1);
    expect(bob).toHaveBeenCalledWith(3);
  });
});
