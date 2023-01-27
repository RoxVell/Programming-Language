import { AdditiveOperator, BinaryOperator, MultiplicativeOperator } from './ast-operators';

export enum AstNodeType {
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  BooleanLiteral = 'BooleanLiteral',
  BinaryExpression = 'BinaryExpression',
}

export interface AstNode<T extends AstNodeType> {
  type: T;
}

export type AnyAstNode = AstNode<AstNodeType>;

export type NumberLiteralNode = AstNode<AstNodeType.NumberLiteral> & {
  value: number;
};

export type StringLiteralNode = AstNode<AstNodeType.StringLiteral> & {
  value: string;
};

export type BooleanLiteralNode = AstNode<AstNodeType.BooleanLiteral> & {
  value: boolean;
};

export type BinaryExpression<O extends BinaryOperator> = AstNode<AstNodeType.BinaryExpression> & {
  left: AnyAstNode;
  right: AnyAstNode;
  operator: O;
}

export type AdditiveExpression = BinaryExpression<AdditiveOperator>;
export type MultiplicativeExpression = BinaryExpression<MultiplicativeOperator>;

export interface AstTree {
  statements: AnyAstNode[];
}
