import { Lexer, LexerToken } from '../lexer/lexer';
import { TOKENS } from '../lexer/tokens';
import { AnyAstNode, AstNodeType, BinaryExpression } from './ast-node';
import { TokenType } from '../lexer/token-type';

interface AstTree {
  statements: AnyAstNode[];
}

export class Ast {
  private currentToken: LexerToken | null = null;
  private lexer!: Lexer;

  constructor(
    private readonly code: string,
  ) {
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
    return this.BinaryExpression('NumberLiteral', TokenType.OpExponentiation);
  }

  eat(tokenType: TokenType): LexerToken {
    if (this.currentToken?.type === tokenType) {
      const token = this.currentToken;
      this.currentToken = this.lexer.getNextToken();
      return token;
    }

    throw new Error(`Expected token "${tokenType}", but got "${this.currentToken!.type}"`);
  }

  NumberLiteral() {
    const token = this.eat(TokenType.Number);

    return {
      type: AstNodeType.NumberLiteral,
      value: Number(token.value),
    }
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
