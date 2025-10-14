import type { Resolver } from './util.js';

export function batch<TIn, TOut>(
  fn: (args: TIn[]) => Promise<BatchReturn<TIn, TOut>>,
  wait = 300,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let queue: [Resolver<TOut>, TIn][] = [] as [Resolver<TOut>, TIn][];

  return (args: TIn) => {
    if (!timeout) {
      timeout = setTimeout(async () => {
        const finder = await fn(queue.map((q) => q[1]));
        for (const [resolver, args] of queue) resolver(finder(args));

        queue = [];
        timeout = null;
      }, wait);
    }

    return new Promise<TOut>((res) => {
      // Add things to the queue
      queue.push([res, args]);
    });
  };
}

export type BatchableFunction<
  TParams extends readonly unknown[],
  TOut = unknown,
> = (...args: TParams) => BatchReturn<TParams, TOut>;

export type BatchReturn<In = unknown, Out = unknown> = Promise<
  (args: In) => Out
>;
