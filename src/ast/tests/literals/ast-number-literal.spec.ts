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
