/**
 * @fileoverview Use `let` declarations to bind names to values
 * @author Charles Lowell
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-let");

var RuleTester = require("eslint").RuleTester;
var globals = require('globals')

RuleTester.setDefaultConfig({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("prefer-let", rule, {

  valid: [
    {
      code: "const PI = 3.14;"
    },
    {
      code: "const { foo, bar } = {};"
    },
    {
      code: `export const AlsoObject = Object;`
    },
    {
      languageOptions: {
        sourceType: "script",
        globals: {
          ...globals.node
        }
      },
      code: "const PI = 3.14;"
    },
    {
      code: "declare global { var foo: any; }",
      languageOptions: {
        parser: require("@typescript-eslint/parser")
      }
    },
    {
      code: "declare module 'foo' { var bar: any; }",
      languageOptions: {
        parser: require("@typescript-eslint/parser")
      }
    },
    {
      code: "declare namespace MyNamespace { var baz: any; }",
      languageOptions: {
        parser: require("@typescript-eslint/parser")
      }
    },
    // forceUpperCaseConst: const with UPPER_CASE at top level is valid
    {
      code: "const FOO_BAR = 'baz';",
      options: [{ forceUpperCaseConst: true }]
    },
    {
      code: "const FOO = 1;",
      options: [{ forceUpperCaseConst: true }]
    },
    {
      code: "const API_BASE_URL = 'http://example.com';",
      options: [{ forceUpperCaseConst: true }]
    },
    {
      code: "export const FOO_BAR = 'baz';",
      options: [{ forceUpperCaseConst: true }]
    },
    // forceUpperCaseConst: let with non-upper-case at top level is valid
    {
      code: "let fooBar = 'baz';",
      options: [{ forceUpperCaseConst: true }]
    },
    // forceUpperCaseConst: const UPPER_CASE inside function is still invalid
    // (no special treatment for non-top-level)
  ],

  invalid: [
    {
      code: "function y() { const x = 'y'; return x; }",
      output: "function y() { let x = 'y'; return x; }",
      errors: [{
        message: "`const` declaration outside top-level scope"
      }]
    },
    {
      code: "function y() { const {x, y} = {x: 'x', y: 'y'}}",
      output: "function y() { let {x, y} = {x: 'x', y: 'y'}}",
      errors: [{
        message: "`const` declaration outside top-level scope"
      }]
    },
    {
      code: "var x = 'y';",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings"
      }]
    },
    {
      code: "function y() { var x = 'y'};",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings"
      }]
    },
    {
      code: "function y() { var { x, y } = {}; }",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings"
      }]
    },
    {
      languageOptions: {
        sourceType: "script",
        globals: {
          ...globals.node
        }
      },
      code: "function y() { const x = 'y'; return x; }",
      output: "function y() { let x = 'y'; return x; }",
      errors: [{
        message: "`const` declaration outside top-level scope"
      }]
    },
    // forceUpperCaseConst: const with non-upper-case at top level is invalid
    {
      code: "const fooBar = 'baz';",
      output: "let fooBar = 'baz';",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "`const` declaration for non-constant names at top-level scope. Use `let` or rename to UPPER_CASE"
      }]
    },
    {
      code: "const { foo, bar } = {};",
      output: "let { foo, bar } = {};",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "`const` declaration for non-constant names at top-level scope. Use `let` or rename to UPPER_CASE"
      }]
    },
    {
      code: "export const AlsoObject = Object;",
      output: "export let AlsoObject = Object;",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "`const` declaration for non-constant names at top-level scope. Use `let` or rename to UPPER_CASE"
      }]
    },
    // forceUpperCaseConst: let with UPPER_CASE at top level is invalid
    {
      code: "let FOO_BAR = 'baz';",
      output: "const FOO_BAR = 'baz';",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "use `const` for constant names (UPPER_CASE) at top-level scope"
      }]
    },
    {
      code: "let FOO = 1;",
      output: "const FOO = 1;",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "use `const` for constant names (UPPER_CASE) at top-level scope"
      }]
    },
    // forceUpperCaseConst: const UPPER_CASE inside function is still invalid
    {
      code: "function y() { const FOO_BAR = 'baz'; return FOO_BAR; }",
      output: "function y() { let FOO_BAR = 'baz'; return FOO_BAR; }",
      options: [{ forceUpperCaseConst: true }],
      errors: [{
        message: "`const` declaration outside top-level scope"
      }]
    },
  ]
});
