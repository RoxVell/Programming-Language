import { TokenType } from './token-type';

export type TokenDictionary = [RegExp, TokenType, boolean?][];

export const TOKENS: TokenDictionary = [
  [/^\d+/, TokenType.Number],

  [/^(\/\/.+)/, TokenType.Comment, true],
  [/^\/\*[\S\s]*\*\//, TokenType.Comment, true],

  [/^\*\*/, TokenType.OpExponentiation],

  [/^(\+|-)/, TokenType.OpAdditive],
  [/^(\*|\/)/, TokenType.OpFactor],

  [/^'[^']*'/, TokenType.String],
  [/^"[^"]*"/, TokenType.String],

  [/^\s+/, TokenType.Whitespaces, true],
];
