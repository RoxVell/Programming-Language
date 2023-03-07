import { AdditiveOperator, BinaryOperator, MultiplicativeOperator } from './ast-operators';

export enum AstNodeType {
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  BooleanLiteral = 'BooleanLiteral',
  BinaryExpression = 'BinaryExpression',
  BlockStatement = 'BlockStatement',
  IfStatement = 'IfStatement',
  WhileStatement = 'WhileStatement',
  DoWhileStatement = 'DoWhileStatement',
  VariableDeclaration = 'VariableDeclaration',
  Identifier = 'Identifier',
  Assignment = 'Assignment',
}

export interface AstNodeBuilder<T extends AstNodeType> {
  type: T;
}

export type AstNode = AstNodeBuilder<AstNodeType>;

export interface IfStatementNode {
  type: AstNodeType.IfStatement,
  condition: AstNode;
  then: AstNode;
  else: AstNode | null;
}

const VARIABLE_DECLARATION_KIND = ['let', 'const'] as const;

export interface VariableDeclarationNode {
  type: AstNodeType.VariableDeclaration,
  kind: typeof VARIABLE_DECLARATION_KIND[number],
  id: IdentifierNode;
  init: AstNode | null;
}

export const ASSIGNMENT_KINDS = ['=', '+=', '-=', '*=', '/=', '**=', '%=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '&&=', '||=', '??='] as const;

type AssignmentKind = typeof ASSIGNMENT_KINDS[number];

export interface AssignmentNode {
  type: AstNodeType.Assignment,
  kind: AssignmentKind,
  init: AstNode,
  id: IdentifierNode,
}

export interface IdentifierNode {
  type: AstNodeType.Identifier,
  name: string;
}

export interface WhileStatementNode {
  type: AstNodeType.WhileStatement,
  condition: AstNode;
  body: AstNode;
}

export interface DoWhileStatementNode {
  type: AstNodeType.DoWhileStatement,
  condition: AstNode;
  body: AstNode;
}

export type BlockStatementNode = AstNodeBuilder<AstNodeType.BlockStatement> & {
  statements: AstNode[];
};

export type NumberLiteralNode = AstNodeBuilder<AstNodeType.NumberLiteral> & {
  value: number;
};

export type StringLiteralNode = AstNodeBuilder<AstNodeType.StringLiteral> & {
  value: string;
};

export type BooleanLiteralNode = AstNodeBuilder<AstNodeType.BooleanLiteral> & {
  value: boolean;
};

export type BinaryExpression<O extends BinaryOperator> = AstNodeBuilder<AstNodeType.BinaryExpression> & {
  left: AstNode;
  right: AstNode;
  operator: O;
}

export type AdditiveExpression = BinaryExpression<AdditiveOperator>;
export type MultiplicativeExpression = BinaryExpression<MultiplicativeOperator>;

export interface AstTree {
  statements: AstNode[];
}
