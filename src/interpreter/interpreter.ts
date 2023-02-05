import {Ast} from '../ast/ast';
import {
  AstNode,
  AstNodeType,
  BinaryExpression,
  BooleanLiteralNode, IfStatementNode,
  NumberLiteralNode,
  StringLiteralNode
} from '../ast/ast-node';
import {BinaryOperator} from '../ast/ast-operators';

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

  private evalNode(node: AstNode): any {
    switch (node.type) {
      case AstNodeType.NumberLiteral:
      case AstNodeType.StringLiteral:
      case AstNodeType.BooleanLiteral:
        return (node as NumberLiteralNode | StringLiteralNode | BooleanLiteralNode).value;

      case AstNodeType.IfStatement:
        return this.evalIfStatement(node as IfStatementNode);

      case AstNodeType.BinaryExpression:
        return this.evaluateBinaryExpression(node as BinaryExpression<BinaryOperator>);
    }

    throw new Error(`Unexpected node type "${node.type}"`);
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
      case '>':
        return left > right;
      case '<':
        return left < right;
      case '>=':
        return left >= right;
      case '<=':
        return left <= right;
      case '||':
        return left || right;
      case '&&':
        return left && right;
    }
  }

  private evalIfStatement(node: IfStatementNode) {
    if (this.evalNode(node.condition)) {
      this.evalNode(node.then);
    } else if (node.else) {
      this.evalNode(node.else);
    }
  }
}
