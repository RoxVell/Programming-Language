import { Ast } from '../ast/ast';
import {
  AssignmentNode,
  AstNode,
  AstNodeType,
  BinaryExpression,
  BlockStatementNode,
  BooleanLiteralNode,
  DoWhileStatementNode,
  IdentifierNode,
  IfStatementNode,
  NumberLiteralNode,
  StringLiteralNode,
  VariableDeclarationNode,
  WhileStatementNode
} from '../ast/ast-node';
import { BinaryOperator } from '../ast/ast-operators';
import { Scope } from './scope';

function exhaustiveCheck(param: never) {
}

export class Interpreter {
  private currentScope = new Scope();

  evaluate(code: string) {
    const astParser = new Ast(code);
    const ast = astParser.parse();

    ast.statements.slice(0, -1).forEach(statement => {
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
        return this.whileStatement(node as WhileStatementNode);

      case AstNodeType.DoWhileStatement:
        return this.doWhileStatement(node as DoWhileStatementNode);

      case AstNodeType.BlockStatement:
        return this.blockStatement(node as BlockStatementNode);

      case AstNodeType.VariableDeclaration:
        return this.declareVariable(node as VariableDeclarationNode);

      case AstNodeType.Identifier:
        return this.getIdentifierValue(node as IdentifierNode);

      case AstNodeType.Assignment:
        return this.assignVariable(node as AssignmentNode);
    }

    throw new Error(`Unexpected node type "${node.type}"`);
  }

  private doWhileStatement(node: DoWhileStatementNode): void {
    do {
      this.evalNode(node.body);
    } while (this.evalNode(node.condition))
  }

  private blockStatement(node: BlockStatementNode): void {
    const previousScope = this.currentScope;
    this.currentScope = new Scope(previousScope);
    node.statements.forEach(statement => this.evalNode(statement));
    this.currentScope = previousScope;
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

  private declareVariable(node: VariableDeclarationNode) {
    const variableValue = node.init !== null ? this.evalNode(node.init) : undefined;

    switch (node.kind) {
      case 'let':
        this.currentScope.defineVariable(node.id.name, variableValue);
        break;

      case 'const':
        this.currentScope.defineConstant(node.id.name, variableValue);
        break;

      default:
        exhaustiveCheck(node.kind);
    }
  }

  private getIdentifierValue(node: IdentifierNode) {
    return this.currentScope.getVariable(node.name);
  }

  private assignVariable(node: AssignmentNode) {
    let initialValue = this.getIdentifierValue(node.id);
    const rightHandValue = this.evalNode(node.init);

    switch (node.kind) {
      case '=':
        initialValue = rightHandValue;
        break;

      case '+=':
        initialValue += rightHandValue;
        break;

      case '-=':
        // @ts-ignore
        initialValue -= rightHandValue;
        break;

      case '*=':
        // @ts-ignore
        initialValue *= rightHandValue;
        break;

      case '/=':
        // @ts-ignore
        initialValue /= rightHandValue;
        break;

      case '**=':
        // @ts-ignore
        initialValue **= rightHandValue;
        break;

      case '%=':
        // @ts-ignore
        initialValue %= rightHandValue;
        break;

      case '<<=':
        // @ts-ignore
        initialValue <<= rightHandValue;
        break;

      case '>>=':
        // @ts-ignore
        initialValue >>= rightHandValue;
        break;

      case '>>>=':
        // @ts-ignore
        initialValue >>>= rightHandValue;
        break;

      case '&=':
        // @ts-ignore
        initialValue &= rightHandValue;
        break;

      case '^=':
        // @ts-ignore
        initialValue ^= rightHandValue;
        break;

      case '|=':
        // @ts-ignore
        initialValue |= rightHandValue;
        break;

      case '&&=':
        initialValue &&= rightHandValue;
        break;

      case '||=':
        initialValue ||= rightHandValue;
        break;

      case '??=':
        initialValue ??= rightHandValue;
        break;

      default:
        throw new Error(`Unexpected assignment operator "${node.kind}"`);
    }

    this.currentScope.assignVariable(node.id.name, initialValue);
  }
}
