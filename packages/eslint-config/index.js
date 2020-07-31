require("@rushstack/eslint-patch/modern-module-resolution");

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
    "prefer-const": "off",
    "prefer-let/prefer-let": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
