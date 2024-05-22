export function add(...args: (number | bigint)[]): number | bigint {
  if (args.length === 1) return args[0];
  return args.reduce((sum, cur) => {
    if (typeof cur === 'bigint' || typeof sum === 'bigint')
      return BigInt(cur) + BigInt(sum);

    return cur + sum;
  }, 0);
  return 0;
}

console.info(add(1, 10, 3, 5));
