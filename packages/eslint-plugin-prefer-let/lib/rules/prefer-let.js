/**
 * @fileoverview Use `let` declarations to bind names to values
 * @author Charles Lowell
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Use `let` declarations to bind names to values",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",  // or "code" or "whitespace"
    schema: [
      {
        type: "object",
        properties: {
          forceUpperCaseConst: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    let sourceCode = context.sourceCode ?? context.getSourceCode();
    let options = context.options[0] || {};
    let forceUpperCaseConst = options.forceUpperCaseConst || false;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getScope(node) {
      let sourceCode = context.sourceCode ?? context.getSourceCode();
      return sourceCode.getScope
        ? sourceCode.getScope(node)
        : context.getScope();
    }

    function isGlobalScope(node) {
      return getScope(node).type === 'global';
    }

    function isModuleScope(node) {
      return getScope(node).type === 'module';
    }

    function isProgramScope(node) {
      return getScope(node).block.type === 'Program';
    }

    function isTopLevelScope(node) {
      return isGlobalScope(node) || isModuleScope(node) || isProgramScope(node);
    }

    function isUpperCase(name) {
      return /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/.test(name);
    }

    function getBindingNames(node) {
      if (node.type === 'Identifier') {
        return [node.name];
      }
      if (node.type === 'ObjectPattern') {
        return node.properties.flatMap(function(prop) {
          return getBindingNames(prop.value || prop.argument);
        });
      }
      if (node.type === 'ArrayPattern') {
        return node.elements.filter(Boolean).flatMap(function(el) {
          return getBindingNames(el);
        });
      }
      if (node.type === 'RestElement') {
        return getBindingNames(node.argument);
      }
      if (node.type === 'AssignmentPattern') {
        return getBindingNames(node.left);
      }
      return [];
    }

    function allDeclaratorsUpperCase(node) {
      return node.declarations.every(function(decl) {
        let names = getBindingNames(decl.id);
        return names.length > 0 && names.every(isUpperCase);
      });
    }

    function isInAmbientContext(node) {
      let current = node.parent;
      while (current) {
        if (current.type === 'TSModuleDeclaration' && current.declare === true) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          if (isInAmbientContext(node)) {
            return;
          }
          context.report({
            message: 'prefer `let` over `var` to declare value bindings',
            node
          });
        } else if (node.kind === 'const') {
          if (isTopLevelScope(node)) {
            if (forceUpperCaseConst && !allDeclaratorsUpperCase(node) && !(node.parent && node.parent.type === 'ExportNamedDeclaration')) {
              let constToken = sourceCode.getFirstToken(node);
              context.report({
                message: '`const` declaration for non-constant names at top-level scope. Use `let` or rename to UPPER_CASE',
                node,
                fix: function(fixer) {
                  return fixer.replaceText(constToken, 'let');
                }
              });
            }
          } else if (node.parent && node.parent.type === 'ExportNamedDeclaration') {
            // ignore `export const` cases
          } else {
            let constToken = sourceCode.getFirstToken(node);
            context.report({
              message: '`const` declaration outside top-level scope',
              node,
              fix: function(fixer) {
                return fixer.replaceText(constToken, 'let');
              }
            });
          }
        } else if (node.kind === 'let' && forceUpperCaseConst && isTopLevelScope(node) && allDeclaratorsUpperCase(node)) {
          let letToken = sourceCode.getFirstToken(node);
          context.report({
            message: 'use `const` for constant names (UPPER_CASE) at top-level scope',
            node,
            fix: function(fixer) {
              return fixer.replaceText(letToken, 'const');
            }
          });
        }
      }
    };
  }
};
