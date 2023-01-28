import { Interpreter } from '../interpreter';

function testInterpreter(code: string, expectedValue: unknown) {
  const interpreter = new Interpreter();
  expect(interpreter.evaluate(code)).toBe(expectedValue);
}

function testExpressionResult(code: string, result: any) {
  it(`should evaluate expression "${code}" correctly`, () => testInterpreter(code, result));
}

describe('Interpreter', function () {
  describe('Math operations', function () {
    it('should evaluate expression "3 + 2 * 5 ** 2" correctly', () => {
      testInterpreter('3 + 2 * 5 ** 2', 53);
    });

    it('should evaluate expression `"left" + " " + "right"` correctly', () => {
      testInterpreter('"left" + " " + "right"', 'left right');
    });
  });

  describe('Boolean Literals', function () {
    it('should evaluate "true" boolean literal correctly', () => {
      testInterpreter('true', true);
    });

    it('should evaluate "false" boolean literal correctly', () => {
      testInterpreter('false', false);
    });
  });

  describe('Comparison Operators', () => {
    testExpressionResult('1 < 2', true);
    testExpressionResult('3 < 2', false);
    testExpressionResult('2 > 1', true);
    testExpressionResult('2 > 3', false);
    testExpressionResult('1 <= 1', true);
    testExpressionResult('1 <= 2', true);
    testExpressionResult('1 <= 0', false);
    testExpressionResult('1 >= 1', true);
    testExpressionResult('1 >= 2', false);
    testExpressionResult('1 >= 0', true);
  });
});
