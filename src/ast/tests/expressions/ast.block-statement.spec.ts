import { testAst } from '../ast-test-utils';
import { AstNodeType } from '../../ast-node';

describe('Block Statements', () => {
  it('should parse block statements with one statement inside', () => {
    testAst('{ 1 + 2; }', {
      type: AstNodeType.BlockStatement,
      statements: [
        {
          type: AstNodeType.BinaryExpression,
          left: {
            type: AstNodeType.NumberLiteral,
            value: 1,
          },
          operator: '+',
          right: {
            type: AstNodeType.NumberLiteral,
            value: 2,
          },
        }
      ]
    });
  });
});
