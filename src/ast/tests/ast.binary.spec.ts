import { itAstExpression, testAst } from './ast-test-utils';
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

  it('should parse expression "true + false" correctly', () => {
    testAst(`true + false`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BooleanLiteral,
        value: true
      },
      operator: '+',
      right: {
        type: AstNodeType.BooleanLiteral,
        value: false
      }
    });
  });

  it('should parse expression `"left string" + "right string"` correctly', () => {
    testAst(`"left string" + "right string"`, {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.StringLiteral,
        value: 'left string'
      },
      operator: '+',
      right: {
        type: AstNodeType.StringLiteral,
        value: 'right string'
      }
    });
  });

  itAstExpression('2 > 1 < 3 >= 3 <= 4', {
    type: AstNodeType.BinaryExpression,
    left: {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.BinaryExpression,
          left: {
            type: AstNodeType.NumberLiteral,
            value: 2
          },
          operator: '>',
          right: {
            type: AstNodeType.NumberLiteral,
            value: 1
          }
        },
        operator: '<',
        right: {
          type: AstNodeType.NumberLiteral,
          value: 3
        }
      },
      operator: '>=',
      right: {
        type: AstNodeType.NumberLiteral,
        value: 3
      }
    },
    operator: '<=',
    right: {
      type: AstNodeType.NumberLiteral,
      value: 4
    }
  });

  itAstExpression('true || false && true', {
    type: AstNodeType.BinaryExpression,
    left: {
      type: AstNodeType.BooleanLiteral,
      value: true,
    },
    operator: '||',
    right: {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BooleanLiteral,
        value: false,
      },
      operator: '&&',
      right: {
        type: AstNodeType.BooleanLiteral,
        value: true
      }
    }
  });

  itAstExpression('5 * 5 / 5 % 2', {
    type: AstNodeType.BinaryExpression,
    left: {
      type: AstNodeType.BinaryExpression,
      left: {
        type: AstNodeType.BinaryExpression,
        left: {
          type: AstNodeType.NumberLiteral,
          value: 5
        },
        operator: '*',
        right: {
          type: AstNodeType.NumberLiteral,
          value: 5
        }
      },
      operator: '/',
      right: {
        type: AstNodeType.NumberLiteral,
        value: 5
      }
    },
    operator: '%',
    right: {
      type: AstNodeType.NumberLiteral,
      value: 2
    }
  });

  itAstExpression('a = 5;', {
    type: AstNodeType.Assignment,
    id: {
      type: AstNodeType.Identifier,
      name: 'a'
    },
    kind: '=',
    init: {
      type: AstNodeType.NumberLiteral,
      value: 5,
    },
  })
});

