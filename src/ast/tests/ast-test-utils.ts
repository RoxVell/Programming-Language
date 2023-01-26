import { Ast } from '../ast';

export function testAst(code: string, expectedAst: Record<string, unknown>) {
  const ast = new Ast(code);
  expect(ast.parse()).toEqual({
    statements: [expectedAst]
  });
}
