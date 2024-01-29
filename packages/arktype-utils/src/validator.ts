import type { Type } from 'arktype';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateObject<T extends Type<any>>(
  obj: unknown,
  validator: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): T extends Type<infer R> ? R : any {
  const { data, problems } = validator(obj);

  if (problems) throw problems;

  return data;
}
