// Multiplicative

export const MULTIPLICATIVE_OPERATORS_LIST = ['*', '/'] as const;
export type MultiplicativeOperator = typeof MULTIPLICATIVE_OPERATORS_LIST[number]

export function isMultiplicativeOperator(operator: string): boolean {
  return MULTIPLICATIVE_OPERATORS_LIST.some(multiplicativeOperator => multiplicativeOperator === operator);
}

// Additive
export const ADDITIVE_OPERATORS_LIST = ['+', '-'] as const;
export type AdditiveOperator = typeof ADDITIVE_OPERATORS_LIST[number]

export type BinaryOperator = AdditiveOperator | MultiplicativeOperator | '**';

// export function isAdditiveOperator(tokenType: TokenType): boolean {
//   // return [TokenType.]
// }
