import { AdditiveOperator, BinaryOperator, MultiplicativeOperator } from './ast-operators';

export enum AstNodeType {
  NumberLiteral = 'NumberLiteral',

  BinaryExpression = 'BinaryExpression',
  // AdditiveExpression = 'AdditiveExpression',
  // MultiplicativeExpression = 'MultiplicativeExpression',
}

export interface AstNode<T extends AstNodeType> {
  type: T;
}

export type AnyAstNode = AstNode<AstNodeType>;

export type NumberLiteralNode = AstNode<AstNodeType.NumberLiteral> & {
  value: number;
};

export type BinaryExpression<O extends BinaryOperator> = AstNode<AstNodeType.BinaryExpression> & {
  left: AnyAstNode;
  right: AnyAstNode;
  operator: O;
}

export type AdditiveExpression = BinaryExpression<AdditiveOperator>;
export type MultiplicativeExpression = BinaryExpression<MultiplicativeOperator>;


export type QAnyAstNode = BinaryExpression<BinaryOperator> | NumberLiteralNode;

