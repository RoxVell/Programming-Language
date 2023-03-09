import { Ast } from '../ast/ast';
import {
  AssignmentNode,
  AstNode,
  AstNodeType,
  BinaryExpression,
  BlockStatementNode,
  BooleanLiteralNode,
  CallExpressionNode,
  DoWhileStatementNode,
  FunctionDeclarationNode,
  IdentifierNode,
  IfStatementNode,
  NumberLiteralNode,
  ReturnStatementNode,
  StringLiteralNode,
  VariableDeclarationNode,
  WhileStatementNode
} from '../ast/ast-node';
import { BinaryOperator } from '../ast/ast-operators';
import { Scope } from './scope';
import { Func } from './function';

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

      case AstNodeType.FunctionDeclaration:
        return this.declareFunction(node as FunctionDeclarationNode);

      case AstNodeType.CallExpression:
        return this.callFunction(node as CallExpressionNode);

      case AstNodeType.ReturnStatement:
        return this.doReturn(node as ReturnStatementNode);
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
    this.currentScope.defineVariable(node.id.name, variableValue, node.kind === 'const');
  }

  private getIdentifierValue(node: IdentifierNode) {
    return this.currentScope.getVariable(node.name).value;
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

  private declareFunction(node: FunctionDeclarationNode) {
    const func = new Func(node, this.currentScope);
    this.currentScope.defineVariable(node.name.name, func, false);
  }

  private callFunction(node: CallExpressionNode) {
    const callee = this.evalNode(node.callee);

    if (callee instanceof Func) {
      const executionScope = new Scope(callee.parentScope);

      callee.node.params.forEach((fnParam, index) => {
        const paramValue: AstNode | undefined = index > node.arguments.length - 1
          ? fnParam.hasDefaultValue
            ? fnParam.defaultValue
            : undefined
          : node.arguments[index];

        executionScope.defineVariable(fnParam.name, paramValue === undefined ? undefined : this.evalNode(paramValue), false);
      });

      const previousScope = this.currentScope;
      this.currentScope = executionScope;
      const functionResultCall = this.evalFunctionBody(callee.node.body);
      this.currentScope = previousScope;

      return functionResultCall;
    } else {
      throw new Error(`Callee is not a function`);
    }
  }

  private evalFunctionBody(node: BlockStatementNode) {
    for (const statement of node.statements) {
      if (statement.type === AstNodeType.ReturnStatement) {
        return this.doReturn(statement as ReturnStatementNode);
      }
      this.evalNode(statement);
    }
  }


  private doReturn(node: ReturnStatementNode) {
    return this.evalNode(node.expression);
  }
}
