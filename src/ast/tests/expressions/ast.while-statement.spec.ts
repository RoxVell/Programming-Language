import { itAstExpression } from "../ast-test-utils";
import { AstNodeType } from "../../ast-node";

describe('While Statement', () => {
  itAstExpression('while (true) {}', {
    type: AstNodeType.WhileStatement,
    condition: {
      type: AstNodeType.BooleanLiteral,
      value: true,
    },
    body: {
      type: AstNodeType.BlockStatement,
      statements: []
    }
  });
});

describe('Do While Statement', () => {
  itAstExpression('do {} while (true)', {
    type: AstNodeType.DoWhileStatement,
    condition: {
      type: AstNodeType.BooleanLiteral,
      value: true,
    },
    body: {
      type: AstNodeType.BlockStatement,
      statements: []
    }
  });
});