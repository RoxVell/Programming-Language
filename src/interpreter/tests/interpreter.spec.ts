import { Interpreter } from '../interpreter';

function testInterpreter(code: string, expectedValue: unknown) {
  const interpreter = new Interpreter();
  expect(interpreter.evaluate(code)).toBe(expectedValue);
}

function testExpressionResult(code: string, result: any) {
  it(`should evaluate expression "${code}" correctly`, () => testInterpreter(code, result));
}

function shouldThrowError(code: string, errorMessage: string) {
  const interpreter = new Interpreter();
  expect(() => interpreter.evaluate(code)).toThrow(errorMessage);
}

describe('Interpreter', function () {
  describe('Math operations', function () {
    it('should evaluate expression "3 + 2 * 5 ** 2" correctly', () => {
      testInterpreter('3 + 2 * 5 ** 2', 53);
    });

    it('should evaluate expression `"left" + " " + "right"` correctly', () => {
      testInterpreter('"left" + " " + "right"', 'left right');
    });

    it('should evaluate expression `5 * 5 / 5 % 2` correctly', () => {
      testInterpreter('5 * 5 / 5 % 2', 1);
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

  describe('Logical Operators', () => {
    testExpressionResult('true && false', false);
    testExpressionResult('true && true', true);
    testExpressionResult('false && false', false);
    testExpressionResult('false || true', true);
    testExpressionResult('false || false', false);
    testExpressionResult('true || true', true);
    testExpressionResult('true || true && false', true);
    testExpressionResult('false || true && false', false);
  });

  describe('Variables', () => {
    testExpressionResult('let a; a;', undefined);
    testExpressionResult('let a; a = 5; a;', 5);
    testExpressionResult('let a = 5; a;', 5);
    testExpressionResult('let a = 5; let b = a + 1; b;', 6);
    testExpressionResult('let a = 5; a *= 6; a;', 30);
    testExpressionResult('let a = 10; a /= 2; a;', 5);

    it('should not find a variable that belongs to a different scope', () => {
      shouldThrowError(`{ let a = 5; } a;`, `Property with name "a" not found`);
    });

    it('should find a variable that belongs to a parent scope', () => {
      testInterpreter(`let b; { let a = 5; { b = a; } } b;`, 5);
    });

    it('should not allow to reassign the constant variable', () => {
      shouldThrowError(`const a = 5; a = 10; a;`, `Assignment to constant variable`);
    });
  });

  describe('If', () => {
    testExpressionResult('let a; if (false) { a = false; } else { a = true; } a;', true);
  });

  describe('Function', () => {
    testExpressionResult('fn returnFive() { return 5; } returnFive();', 5);

    testExpressionResult('fn add(n1, n2) { return n1 + n2; } add(1, 2);', 3);
    testExpressionResult('fn add(n1, n2) { return n1 + n2; } add(1, 2) + add(5, 6);', 14);
    testExpressionResult('fn add(n1, n2 = 10) { return n1 + n2; } add(5);', 15);
    testExpressionResult(`
      fn anotherFn() { return 15; }
    
      fn add(n1, n2 = 10) {
        return n1 + n2 + anotherFn();
      }
          
      add(5) + anotherFn();
    `, 45);
  });
});
