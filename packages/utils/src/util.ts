/**
 *
 * @param wait the amount of time we are waiting for
 * @returns fuck all, it's a wait util
 */
export function waitFor(wait = 300) {
  return new Promise<void>((res) => setTimeout(res, wait));
}

export type TimeoutType = typeof setTimeout;
export type TimeoutReturnType = ReturnType<TimeoutType>;

export type ThenableCallback<T> = (value: T) => void;
export type Resolver<T> = ThenableCallback<T>;
