export function camelCase(str: string): string {
  return str.replace(/(\w)-(\w)/g, (_, a, b) => `${a}${b.toUpperCase()}`);
}

export function normalizeCssQuery(str: string): string {
  return str.replace(/(.*?):\s?(.*)/g, (_, a, b) => `${a}: ${b}`);
}
