/**
 *
 * @description Modifies the base object the structure of the `str`
 * @param str
 * @param value
 * @param base
 * @returns
 */
export function strToObject<T>(
  str: string,
  value: T,
  base: unknown = {},
): unknown {
  const ret = base;
  let current = ret;
  const parts = str.split('.');

  while (parts.length > 0) {
    const key = parts.shift();
    if (!key) continue;
    if (parts.length === 0) current[key] = value;
    else {
      ret[key] = {};
      current = ret[key];
    }
  }

  return ret;
}
