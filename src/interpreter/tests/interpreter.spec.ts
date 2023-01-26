import { Interpreter } from '../interpreter';

function testInterpreter(code: string, expectedValue: unknown) {
  const interpreter = new Interpreter();
  expect(interpreter.evaluate(code)).toBe(expectedValue);
}

describe('Interpreter', function () {
  describe('Math operations', function () {
    it('should evaluate expression "3 + 2 * 5 ** 2"', () => {
      testInterpreter('3 + 2 * 5 ** 2', 53);
    });
  });
});
