import { testAst } from '../ast-test-utils';
import { AstNodeType } from '../../ast-node';

describe('Number Literal', function () {
  it('should parse a single number literal', () => {
    testAst('5', {
      type: AstNodeType.NumberLiteral,
      value: 5
    });
  });
});

describe('String Literal', function () {
  it('should parse a string literal', () => {
    testAst('"some string"', {
      type: AstNodeType.StringLiteral,
      value: 'some string'
    });
  });
});

describe('Boolean Literal', function () {
  it('should parse true boolean literal', () => {
    testAst('true', {
      type: AstNodeType.BooleanLiteral,
      value: true
    });
  });

  it('should parse false boolean literal', () => {
    testAst('false', {
      type: AstNodeType.BooleanLiteral,
      value: false
    });
  });
});
