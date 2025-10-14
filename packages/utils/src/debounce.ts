import { TimeoutReturnType } from './util.js';

export function debounce<TFn extends unknown[], TReturn = void>(
  fn: (...args: TFn) => TReturn | Promise<TReturn>,
  wait = 300,
) {
  let timeout: TimeoutReturnType | null = null;

  return (...args: TFn) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn(...args);
    }, wait);
  };
}
