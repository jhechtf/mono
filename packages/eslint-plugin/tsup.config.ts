import { defineConfig } from 'tsup';

export default defineConfig({
  format: 'cjs',
  entry: ['./index.ts'],
  external: ['espree', 'eslint'],
  cjsInterop: true,
});
