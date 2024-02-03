import { readFile } from 'node:fs/promises';

export async function generate(configFile: string) {
  const f = await readFile(configFile);
}

console.info(import.meta.dirname);
