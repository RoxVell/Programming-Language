import { Lexer, LexerToken } from '../lexer/lexer';
import { TOKENS } from '../lexer/tokens';
import { AnyAstNode, AstNodeType, AstTree, BinaryExpression, BooleanLiteralNode } from './ast-node';
import { TokenType } from '../lexer/token-type';

export class Ast {
  private currentToken: LexerToken | null = null;
  private lexer!: Lexer;

  constructor(private readonly code: string) {
  }

  parse(): AstTree {
    this.lexer = new Lexer(this.code, TOKENS);
    this.currentToken = this.lexer.getNextToken();

    return {
      statements: this.StatementsList()
    };
  }

  StatementsList(): AnyAstNode[] {
    const statements = [];

    while (this.currentToken) {
      statements.push(this.AdditiveExpression())
    }

    return statements;
  }

  AdditiveExpression() {
    return this.BinaryExpression('MultiplicativeExpression', TokenType.OpAdditive);
  }

  MultiplicativeExpression(): AnyAstNode {
    return this.BinaryExpression('ExponentialExpression', TokenType.OpFactor);
  }

  ExponentialExpression() {
    return this.BinaryExpression('PrimaryExpression', TokenType.OpExponentiation);
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
    const expression = this.AdditiveExpression();
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

  private BinaryExpression(node: string, tokenType: TokenType) {
    // @ts-ignore
    let left: AnyAstNode = this[node]();

    while (this.currentToken?.type === tokenType) {
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
}
