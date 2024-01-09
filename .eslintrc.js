// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  plugins: [
    "@jhechtf/esling-plugin"
  ],
  extends: ["@jhechtf/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
