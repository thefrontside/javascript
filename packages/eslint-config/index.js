module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "prefer-let",
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "arrow-spacing": "error",
    "eol-last": "error",
    "no-empty-function": "off",
    "no-multi-spaces": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "one-var": ["error", { initialized: "never" }],
    "prefer-const": "off",
    "prefer-let/prefer-let": "error",
    semi: ["error", "always", { omitLastInOneLineBlock: true }],
  }
}
