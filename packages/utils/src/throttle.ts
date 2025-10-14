import type { ThenableCallback, TimeoutReturnType } from './util.js';

export function throttle<TFnParams extends unknown[], TReturn = unknown>(
  fn: (...args: TFnParams) => TReturn,
  wait = 300,
) {
  let lastCall: TFnParams = [] as TFnParams;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: TFnParams) => {
    lastCall = args;
    if (!timeout) {
      timeout = setTimeout(() => {
        fn(...lastCall);
        timeout = null;
      }, wait);
    }
  };
}

/**
 * Will resolve batches of promise with the result that ends up being called.
 * @param fn
 * @param wait
 */
export function asyncThrottle<TFnParams extends unknown[], TReturn = unknown>(
  fn: (...args: TFnParams) => TReturn,
  wait = 300,
) {
  let lastCall: TFnParams = [] as TFnParams;
  let timeout: TimeoutReturnType | null = null;
  const f: Set<ThenableCallback<TReturn>> = new Set();

  return (...args: TFnParams): Promise<TReturn> => {
    lastCall = args;
    if (!timeout) {
      timeout = setTimeout(() => {
        // Get the last response call
        const response = fn(...lastCall);
        // For each thenable we've returned since our last run,
        // set the response to our throttled response
        for (const res of f.values()) res(response);
        // Clear out the set
        f.clear();
        // Reset the argument array
        lastCall = [] as TFnParams;
        // reset the timeout
        timeout = null;
      }, wait);
    }

    return new Promise<TReturn>((res) => {
      f.add(res);
    });
  };
}
