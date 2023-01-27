import { Interpreter } from '../interpreter';

function testInterpreter(code: string, expectedValue: unknown) {
  const interpreter = new Interpreter();
  expect(interpreter.evaluate(code)).toBe(expectedValue);
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
});
