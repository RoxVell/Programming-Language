import { testAst } from "../ast-test-utils";
import { AstNodeType } from "../../ast-node";

describe('If Statement', () => {
  it('should correctly parse an if statement with then block only', () => {
    testAst('if (5) {}', {
      type: AstNodeType.IfStatement,
      condition: {
        type: AstNodeType.NumberLiteral,
        value: 5
      },
      then: {
        type: AstNodeType.BlockStatement,
        statements: []
      },
      else: null
    });
  });

  it('should correctly parse an if statement with then and else blocks', () => {
    testAst('if (5) {} else 3', {
      type: AstNodeType.IfStatement,
      condition: {
        type: AstNodeType.NumberLiteral,
        value: 5
      },
      then: {
        type: AstNodeType.BlockStatement,
        statements: []
      },
      else: {
        type: AstNodeType.NumberLiteral,
        value: 3
      }
    });
  });

  it('should correctly parse nested is statements', () => {
    testAst(`
      if (false) {
        1 + 2;
      } else if (true) {
        'not yet'; 
      } else {
        'right here';
      }
    `, {
      type: AstNodeType.IfStatement,
      condition: {
        type: AstNodeType.BooleanLiteral,
        value: false
      },
      then: {
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
            }
          }
        ]
      },
      else: {
        type: AstNodeType.IfStatement,
        condition: {
          type: AstNodeType.BooleanLiteral,
          value: true
        },
        then: {
          type: AstNodeType.BlockStatement,
          statements: [
            {
              type: AstNodeType.StringLiteral,
              value: 'not yet',
            }
          ]
        },
        else: {
          type: AstNodeType.BlockStatement,
          statements: [
            {
              type: AstNodeType.StringLiteral,
              value: 'right here',
            }
          ]
        }
      }
    });
  });
});