import { testAst } from './ast-test-utils';
import { AstNodeType } from '../ast-node';

describe('Functions', () => {
  describe('Function Declaration', () => {
    it('should parse function with parameters', () => {
      testAst('fn add(n1, n2 = 5) {}', {
        type: AstNodeType.FunctionDeclaration,
        name: {
          type: AstNodeType.Identifier,
          name: 'add'
        },
        params: [
          {
            type: AstNodeType.FunctionParam,
            name: 'n1',
            hasDefaultValue: false,
          },
          {
            type: AstNodeType.FunctionParam,
            name: 'n2',
            hasDefaultValue: true,
            defaultValue: {
              type: AstNodeType.NumberLiteral,
              value: 5
            }
          },
        ],
        body: {
          type: AstNodeType.BlockStatement,
          statements: []
        }
      });
    });
  });

  describe('Function calls', () => {
    it('should parse simple function call without arguments', () => {
      testAst('addNumbers();', {
        type: AstNodeType.CallExpression,
        callee: {
          type: AstNodeType.Identifier,
          name: 'addNumbers',
        },
        arguments: []
      });
    });

    it('should parse function call of result of another call expression', () => {
      testAst('addNumbers()();', {
        type: AstNodeType.CallExpression,
        callee: {
          type: AstNodeType.CallExpression,
          callee: {
            type: AstNodeType.Identifier,
            name: 'addNumbers',
          },
          arguments: []
        },
        arguments: []
      });
    });
  });
});