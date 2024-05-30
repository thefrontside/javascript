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
      // fill in your schema
    ]
  },

  create: function(context) {
    let sourceCode = context.getSourceCode();

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

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            message: 'prefer `let` over `var` to declare value bindings',
            node
          });
        } else if (node.kind !== 'let' && !isTopLevelScope(node)) {
          let constToken = sourceCode.getFirstToken(node);

          context.report({
            message: '`const` declaration outside top-level scope',
            node,
            fix: function(fixer) {
              return fixer.replaceText(constToken, 'let');
            }
          });
        }
      }
    };
  }
};
