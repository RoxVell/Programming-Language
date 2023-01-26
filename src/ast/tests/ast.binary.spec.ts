import { testAst } from './ast-test-utils';
import { AstNodeType } from '../ast-node';

describe('Binary Ast Expressions', function () {
  it(`should parse expression "69 + 1337" correctly`, () => {
    const leftNumber = 69;
    const rightNumber = 1337;

    testAst(`${leftNumber} + ${rightNumber}`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.NumberLiteral,
        value: leftNumber
      },
      operator: '+',
      right: {
        type: AstNodeType.NumberLiteral,
        value: rightNumber
      }
    });
  });

  it(`should parse expression "69 + 1337 + 33" correctly`, () => {
    const firstNumber = 69;
    const secondNumber = 1337;
    const thirdNumber = 1337;

    testAst(`${firstNumber} + ${secondNumber} + ${thirdNumber}`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.NumberLiteral,
          value: firstNumber
        },
        operator: '+',
        right: {
          type: AstNodeType.NumberLiteral,
          value: secondNumber
        }
      },
      operator: '+',
      right: {
        type: AstNodeType.NumberLiteral,
        value: thirdNumber
      }
    });
  });

  it(`should parse expression "3 + 2 * 5" correctly`, () => {
    const firstNumber = 3;
    const secondNumber = 2;
    const thirdNumber = 5;

    testAst(`${firstNumber} + ${secondNumber} * ${thirdNumber}`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.NumberLiteral,
        value: firstNumber
      },
      operator: '+',
      right: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.NumberLiteral,
          value: secondNumber
        },
        operator: '*',
        right: {
          type: AstNodeType.NumberLiteral,
          value: thirdNumber
        }
      }
    });
  });

  it('should parse expression "3 * 2 ** 5" correctly', () => {
    const firstNumber = 3;
    const secondNumber = 2;
    const thirdNumber = 5;

    testAst(`${firstNumber} * ${secondNumber} ** ${thirdNumber}`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.NumberLiteral,
        value: firstNumber
      },
      operator: '*',
      right: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.NumberLiteral,
          value: secondNumber
        },
        operator: '**',
        right: {
          type: AstNodeType.NumberLiteral,
          value: thirdNumber
        }
      }
    });
  });
});

// function itAstExpression(expression: string, ast: Record<string, unknown>) {
//   it(`should parse expression "${expression}" correctly`, () => {
//     testAst(expression, ast);
//   });
// }
