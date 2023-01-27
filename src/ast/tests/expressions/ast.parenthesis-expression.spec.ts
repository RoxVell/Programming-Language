import { testAst } from '../ast-test-utils';
import { AstNodeType } from '../../ast-node';

describe('Parenthesis Expression', function () {
  it('should parse simple parenthesis expression', () => {
    testAst(`(1)`, {
      type: AstNodeType.NumberLiteral,
      value: 1
    });
  });

  it('should resolve order correctly', () => {
    testAst(`(1 + 2) + 3`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.NumberLiteral,
          value: 1,
        },
        operator: '+',
        right: {
          type: AstNodeType.NumberLiteral,
          value: 2,
        }
      },
      operator: '+',
      right: {
        type: AstNodeType.NumberLiteral,
        value: 3,
      }
    });
  });

  it('should resolve multiple parenthesis expression', () => {
    testAst(`((1 + 2) + 3) ** ((5))`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.BinaryExpression,
          left: {
            type: AstNodeType.NumberLiteral,
            value: 1,
          },
          operator: '+',
          right: {
            type: AstNodeType.NumberLiteral,
            value: 2,
          }
        },
        operator: '+',
        right: {
          type: AstNodeType.NumberLiteral,
          value: 3,
        }
      },
      operator: '**',
      right: {
        type: AstNodeType.NumberLiteral,
        value: 5,
      }
    });
  });
});
