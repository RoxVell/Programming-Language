import {Lexer, LexerToken} from '../lexer/lexer';
import {TOKENS} from '../lexer/tokens';
import {
  AstNode,
  AstNodeType,
  AstTree,
  BinaryExpression,
  BlockStatementNode,
  BooleanLiteralNode,
  DoWhileStatementNode,
  IfStatementNode,
  WhileStatementNode
} from './ast-node';
import {TokenType} from '../lexer/token-type';

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
    }

    return this.ExpressionStatement();
  }

  DoWhileStatement(): DoWhileStatementNode {
    this.eat(TokenType.DoKeyword);
    const body = this.Statement();
    this.eat(TokenType.WhileKeyword);
    const condition = this.InsideParentheses();
    return {
      type: AstNodeType.DoWhileStatement,
      condition,
      body
    };
  }

  WhileStatement(): WhileStatementNode {
    this.eat(TokenType.WhileKeyword);
    const condition = this.InsideParentheses();
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

    if (this.currentToken?.type === TokenType.Semicolon) {
      this.eat(TokenType.Semicolon);
    }

    return expression;
  }

  Expression() {
    return this.LogicalOrExpression();
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
    return this.BinaryExpression('PrimaryExpression', [TokenType.OpExponentiation]);
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
    if (this.currentToken?.type === tokenType) {
      const token = this.currentToken;
      this.currentToken = this.lexer.getNextToken();
      return token;
    }

    throw new Error(`Expected token "${tokenType}", but got "${this.currentToken!.type}"`);
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

  private InsideParentheses() {
    this.eat(TokenType.OpenParenthesis);
    const expression = this.Expression();
    this.eat(TokenType.CloseParenthesis);
    return expression;
  }

  private IfStatement(): IfStatementNode {
    this.eat(TokenType.IfKeyword);
    const condition = this.InsideParentheses();
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
}
