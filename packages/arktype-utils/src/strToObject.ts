/**
 * 
 * @description Modifies the base object the structure of the `str`
 * @param str 
 * @param value 
 * @param base 
 * @returns 
 */
export function strToObject<T>(str: string, value: T, base: object = {}): object {
  const ret = base;
  const parts = str.split('.');
  const keyArrayMatcher = /(\w+)\[(\d+)?\]$/;
  // Start on the outer most object portion;
  let current = ret;

  while(parts.length > 0) {
    let key = parts.shift();
    if(!key) continue;
    
  }
  
  return ret;
}
