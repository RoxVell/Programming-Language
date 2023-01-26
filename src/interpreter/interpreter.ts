import { Ast } from '../ast/ast';
import { AnyAstNode, AstNodeType, BinaryExpression, NumberLiteralNode } from '../ast/ast-node';
import { BinaryOperator } from '../ast/ast-operators';

export class Interpreter {
  constructor() {
  }

  evaluate(code: string) {
    const astParser = new Ast(code);
    const ast = astParser.parse();

    ast.statements.slice(1).forEach(statement => {
      this.evalNode(statement);
    });

    return this.evalNode(ast.statements[ast.statements.length - 1]);
  }

  private evalNode(node: AnyAstNode): any {
    switch (node.type) {
      case AstNodeType.NumberLiteral:
        return this.evalNumberLiteral(node as NumberLiteralNode);

      case AstNodeType.BinaryExpression:
        return this.evaluateBinaryExpression(node as BinaryExpression<BinaryOperator>)
    }

    throw new Error(`Unexpected node type "${node.type}"`);
  }

  private evalNumberLiteral(node: NumberLiteralNode) {
    return node.value;
  }

  private evaluateBinaryExpression(node: BinaryExpression<BinaryOperator>) {
    const left = this.evalNode(node.left);
    const right = this.evalNode(node.right);

    switch (node.operator) {
      case '+':
        return left + right;
      case '-':
        return left + right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '**':
        return left ** right;
    }
  }
}