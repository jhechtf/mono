import type { Type } from 'arktype';

export function validateObject<T extends Type<any>>(obj: unknown, validator: T): T extends Type<infer R> ? R : any {
  const { data, problems } = validator(obj);

  if (problems) throw problems;

  return data;
}
