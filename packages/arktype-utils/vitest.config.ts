import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Need this to use File in the tests
    environment: 'jsdom'
  }
});
