import { itAstExpression } from "../ast-test-utils";
import { AstNodeType } from "../../ast-node";

describe('Variable Declaration', () => {
  itAstExpression('let a = 5;', {
    type: AstNodeType.VariableDeclaration,
    id: {
      type: AstNodeType.Identifier,
      name: 'a',
    },
    kind: 'let',
    init: {
      type: AstNodeType.NumberLiteral,
      value: 5,
    },
  });
});
