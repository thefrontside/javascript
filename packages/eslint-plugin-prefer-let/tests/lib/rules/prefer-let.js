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
    }
  ],

  invalid: [
    {
      code: "function y() { const x = 'y'; return x; }",
      output: "function y() { let x = 'y'; return x; }",
      errors: [{
        message: "`const` declaration outside top-level scope",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "function y() { const {x, y} = {x: 'x', y: 'y'}}",
      output: "function y() { let {x, y} = {x: 'x', y: 'y'}}",
      errors: [{
        message: "`const` declaration outside top-level scope",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "var x = 'y';",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "function y() { var x = 'y'};",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "function y() { var { x, y } = {}; }",
      errors: [{
        message: "prefer `let` over `var` to declare value bindings",
        type: "VariableDeclaration"
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
        message: "`const` declaration outside top-level scope",
        type: "VariableDeclaration"
      }]
    },
  ]
});
