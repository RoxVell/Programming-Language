import { Lexer, LexerToken } from '../lexer/lexer';
import { TOKENS } from '../lexer/tokens';
import {
  AssignmentNode,
  AstNode,
  AstNodeType,
  AstTree,
  BinaryExpression,
  BlockStatementNode,
  BooleanLiteralNode,
  CallExpressionNode,
  DoWhileStatementNode,
  FunctionDeclarationNode,
  FunctionParamDefaultValue,
  FunctionParamNode,
  IdentifierNode,
  IfStatementNode,
  ReturnStatementNode,
  VariableDeclarationNode,
  WhileStatementNode
} from './ast-node';
import { TokenType } from '../lexer/token-type';

export class Ast {
  private currentToken: LexerToken | null = null;
  private lexer!: Lexer;

  constructor(private readonly code: string) {}

  parse(): AstTree {
    this.lexer = new Lexer(this.code, TOKENS);
    this.currentToken = this.lexer.getNextToken();

    return {
      statements: this.StatementsList()
    };
  }

  StatementsList(stopToken?: TokenType): AstNode[] {
    const statements = [];

    while (this.currentToken && this.currentToken.type !== stopToken) {
      statements.push(this.Statement());
    }

    return statements;
  }

  Statement() {
    switch (this.currentToken?.type) {
      case TokenType.OpenBracket:
        return this.BlockStatement();
      case TokenType.IfKeyword:
        return this.IfStatement();
      case TokenType.WhileKeyword:
        return this.WhileStatement();
      case TokenType.DoKeyword:
        return this.DoWhileStatement();
      case TokenType.LetKeyword:
      case TokenType.ConstKeyword:
        return this.VariableDeclaration();
      case TokenType.Fn:
        return this.FunctionDeclaration();
      case TokenType.Return:
        return this.ReturnStatement();
    }

    return this.ExpressionStatement();
  }

  VariableDeclaration(): VariableDeclarationNode {
    const variableKind = this.eatSome([TokenType.LetKeyword, TokenType.ConstKeyword]);
    const id = this.Identifier();
    const assignmentOp = this.eatOptional(TokenType.Assignment);
    const init = assignmentOp ? this.Expression() : null;
    this.eat(TokenType.Semicolon);

    return {
      type: AstNodeType.VariableDeclaration,
      id: id,
      kind: variableKind.value as VariableDeclarationNode['kind'],
      init: init
    };
  }

  Identifier(): IdentifierNode {
    const id = this.eat(TokenType.Identifier);

    return {
      type: AstNodeType.Identifier,
      name: id.value
    };
  }

  DoWhileStatement(): DoWhileStatementNode {
    this.eat(TokenType.DoKeyword);
    const body = this.Statement();
    this.eat(TokenType.WhileKeyword);
    const condition = this.InsideParentheses(this.Expression.bind(this));
    return {
      type: AstNodeType.DoWhileStatement,
      condition,
      body
    };
  }

  WhileStatement(): WhileStatementNode {
    this.eat(TokenType.WhileKeyword);
    const condition = this.InsideParentheses(this.Expression.bind(this));
    const body = this.Statement();
    return {
      type: AstNodeType.WhileStatement,
      condition,
      body
    };
  }

  BlockStatement(): BlockStatementNode {
    this.eat(TokenType.OpenBracket);
    const statements = this.StatementsList(TokenType.CloseBracket);
    this.eat(TokenType.CloseBracket);

    return {
      type: AstNodeType.BlockStatement,
      statements
    };
  }

  ExpressionStatement() {
    const expression = this.Expression();

    this.eatOptional(TokenType.Semicolon);

    return expression;
  }

  Expression() {
    return this.Assignment();
  }

  Assignment(): AstNode {
    const left = this.LogicalOrExpression();

    if (this.currentToken?.type === TokenType.Assignment) {
      if (left.type !== AstNodeType.Identifier) {
        throw new Error('Invalid left-hand side in assignment');
      }

      const assignmentKind = this.eat(TokenType.Assignment);

      const init = this.Expression();

      this.eat(TokenType.Semicolon);

      return {
        type: AstNodeType.Assignment,
        id: left,
        init: init,
        kind: assignmentKind.value,
      } as AssignmentNode;
    }

    return left;
  }

  LogicalOrExpression() {
    return this.BinaryExpression('LogicalAndExpression', [TokenType.OpLogicalOr]);
  }

  LogicalAndExpression() {
    return this.BinaryExpression('ComparisonExpression', [TokenType.OpLogicalAnd]);
  }

  ComparisonExpression() {
    return this.BinaryExpression('AdditiveExpression', [TokenType.OpComparison]);
  }

  AdditiveExpression() {
    return this.BinaryExpression('MultiplicativeExpression', [TokenType.OpAdditive]);
  }

  MultiplicativeExpression(): AstNode {
    return this.BinaryExpression('ExponentialExpression', [TokenType.OpFactor, TokenType.OpRemainder]);
  }

  ExponentialExpression() {
    return this.BinaryExpression('CallExpression', [TokenType.OpExponentiation]);
  }

  CallExpression() {
    let left = this.PrimaryExpression();

    // FIXME: complete lhs possible expressions
    while (this.currentToken?.type === TokenType.OpenParenthesis) {
      if (left.type === AstNodeType.Identifier || left.type === AstNodeType.CallExpression) {
        this.eat(TokenType.OpenParenthesis);

        const args: AstNode[] = [];

        let isFirst = true;

        // @ts-ignore
        while (this.currentToken?.type !== TokenType.CloseParenthesis) {
          if (!isFirst) {
            this.eat(TokenType.Comma);
          }
          args.push(this.Expression());
          isFirst = false;
        }

        this.eat(TokenType.CloseParenthesis);

        left = {
          type: AstNodeType.CallExpression,
          callee: left,
          arguments: args,
        } as CallExpressionNode;
      }
    }

    return left;
  }

  PrimaryExpression() {
    switch (this.currentToken?.type) {
      case TokenType.Boolean:
        return this.BooleanLiteral();
      case TokenType.Number:
        return this.NumberLiteral();
      case TokenType.String:
        return this.StringLiteral();
      case TokenType.OpenParenthesis:
        return this.ParenthesisExpression();
      case TokenType.Identifier:
        return this.Identifier();
    }

    throw new Error(`Unexpected token found "${this.currentToken!.type}"`);
  }

  ParenthesisExpression() {
    this.eat(TokenType.OpenParenthesis);
    const expression = this.Expression();
    this.eat(TokenType.CloseParenthesis);
    return expression;
  }

  private eat(tokenType: TokenType): LexerToken {
    const token = this.eatOptional(tokenType);

    if (!token) {
      throw new Error(`Expected token "${tokenType}", but got "${this.currentToken!.type}"`);
    } else {
      return token;
    }
  }

  private eatOptional(tokenType: TokenType): LexerToken | undefined {
    if (this.currentToken?.type === tokenType) {
      const token = this.currentToken;
      this.currentToken = this.lexer.getNextToken();
      return token;
    }
  }

  private eatSome(tokenTypes: TokenType[]): LexerToken {
    for (let tokenType of tokenTypes) {
      const token = this.eatOptional(tokenType);

      if (token) {
        return token;
      }
    }

    throw new Error(`Expected any of following tokens: "${tokenTypes.join(', ')}", but got "${this.currentToken!.type}"`);
  }

  StringLiteral() {
    const token = this.eat(TokenType.String);

    return {
      type: AstNodeType.StringLiteral,
      value: token.value.slice(1, -1),
    };
  }

  NumberLiteral() {
    const token = this.eat(TokenType.Number);

    return {
      type: AstNodeType.NumberLiteral,
      value: Number(token.value),
    };
  }

  BooleanLiteral(): BooleanLiteralNode {
    const token = this.eat(TokenType.Boolean);

    return {
      type: AstNodeType.BooleanLiteral,
      value: token.value === 'true'
    };
  }

  private BinaryExpression(node: string, tokenTypes: TokenType[]) {
    // @ts-ignore
    let left: AstNode = this[node]();

    let tokenType;

    while (this.currentToken && (tokenType = tokenTypes.find(tokenType => tokenType === this.currentToken!.type))) {
      const operatorToken = this.eat(tokenType);
      // @ts-ignore
      const right = this[node]();

      left = {
        type: AstNodeType.BinaryExpression,
        operator: operatorToken.value,
        left,
        right
      } as BinaryExpression<any>;
    }

    return left;
  }

  private InsideParentheses<T>(fn: (...args: unknown[]) => T): T {
    this.eat(TokenType.OpenParenthesis);
    const expression = fn();
    this.eat(TokenType.CloseParenthesis);
    return expression;
  }

  private IfStatement(): IfStatementNode {
    this.eat(TokenType.IfKeyword);
    const condition = this.InsideParentheses(this.Expression.bind(this));
    const thenStatement = this.Statement();

    let elseStatement = null;

    if (this.currentToken?.type === TokenType.ElseKeyword) {
      this.eat(TokenType.ElseKeyword);
      elseStatement = this.Statement();
    }

    return {
      type: AstNodeType.IfStatement,
      condition,
      then: thenStatement,
      else: elseStatement
    };
  }

  private FunctionParam(): FunctionParamNode {
    const id = this.Identifier();

    if (this.currentToken?.type === TokenType.Assignment) {
      this.eat(TokenType.Assignment);

      const rhs = this.Expression() as FunctionParamDefaultValue;

      const ALLOWED_FUNCTION_PARAM_TYPE: AstNodeType[] = [AstNodeType.StringLiteral, AstNodeType.NumberLiteral, AstNodeType.BooleanLiteral, AstNodeType.Identifier];

      if (!ALLOWED_FUNCTION_PARAM_TYPE.includes(rhs.type)) {
        throw new Error(`Unexpected default value for function parameter, but got: ${rhs.type}`);
      }

      return {
        type: AstNodeType.FunctionParam,
        name: id.name,
        hasDefaultValue: true,
        defaultValue: rhs
      };
    }

    return {
      type: AstNodeType.FunctionParam,
      name: id.name,
      hasDefaultValue: false,
    };
  }

  private FunctionParams(): FunctionParamNode[] {
    const params: FunctionParamNode[] = [];
    let isFirst = true;

    while (this.currentToken && this.currentToken.type !== TokenType.CloseParenthesis) {
      if (!isFirst) {
        this.eat(TokenType.Comma);
      }

      isFirst = false;

      params.push(this.FunctionParam());
    }

    return params;
  }

  // 'fn' function_name '(' ARGS ')' BlockStatement
  private FunctionDeclaration(): FunctionDeclarationNode {
    this.eat(TokenType.Fn);
    const id = this.Identifier();
    const params = this.InsideParentheses(this.FunctionParams.bind(this));
    const body = this.BlockStatement();
    return {
      type: AstNodeType.FunctionDeclaration,
      name: id,
      params,
      body
    };
  }

  private ReturnStatement(): ReturnStatementNode {
    this.eat(TokenType.Return);
    const expression = this.Expression();
    this.eat(TokenType.Semicolon);

    return {
      type: AstNodeType.ReturnStatement,
      expression,
    };
  }
}
