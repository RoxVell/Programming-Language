export const MULTIPLICATIVE_OPERATORS_LIST = ['*', '/'] as const;
export type MultiplicativeOperator = typeof MULTIPLICATIVE_OPERATORS_LIST[number]

export function isMultiplicativeOperator(operator: string): boolean {
  return MULTIPLICATIVE_OPERATORS_LIST.some(multiplicativeOperator => multiplicativeOperator === operator);
}

export const ADDITIVE_OPERATORS_LIST = ['+', '-'] as const;
export type AdditiveOperator = typeof ADDITIVE_OPERATORS_LIST[number]

export const COMPARISON_OPERATOR_LIST = ['>', '<', '>=', '<='];
export type ComparisonOperator = typeof COMPARISON_OPERATOR_LIST;

export type BinaryOperator = AdditiveOperator | MultiplicativeOperator | ComparisonOperator | '**';
