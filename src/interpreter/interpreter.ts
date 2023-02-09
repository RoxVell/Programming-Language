import {Ast} from '../ast/ast';
import {
  AstNode,
  AstNodeType,
  BinaryExpression,
  BlockStatementNode,
  BooleanLiteralNode, DoWhileStatementNode,
  IfStatementNode,
  NumberLiteralNode,
  StringLiteralNode,
  WhileStatementNode
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

      case AstNodeType.WhileStatement:
        this.whileStatement(node as WhileStatementNode);
        break;

      case AstNodeType.DoWhileStatement:
        this.doWhileStatement(node as DoWhileStatementNode);
        break;

      case AstNodeType.BlockStatement:
        this.blockStatement(node as BlockStatementNode);
        break;
    }

    throw new Error(`Unexpected node type "${node.type}"`);
  }

  private doWhileStatement(node: DoWhileStatementNode): void {
    do {
      this.evalNode(node.body);
    } while (this.evalNode(node.condition))
  }

  private blockStatement(node: BlockStatementNode): void {
    node.statements.forEach(statement => this.evalNode(statement));
  }

  private whileStatement(node: WhileStatementNode): void {
    while (this.evalNode(node.condition)) {
      this.evalNode(node.body);
    }
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
      case '%':
        return left % right;
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
