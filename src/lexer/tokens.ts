import {TokenType} from './token-type';

export type TokenDictionary = [RegExp, TokenType, boolean?][];

export const TOKENS: TokenDictionary = [
  [/^\d+/, TokenType.Number],

  [/^(\/\/.+)/, TokenType.Comment, true],
  [/^\/\*[\S\s]*\*\//, TokenType.Comment, true],

  [/^\*\*/, TokenType.OpExponentiation],

  [/^([<>])=?/, TokenType.OpComparison],
  [/^(\+|-)/, TokenType.OpAdditive],
  [/^(\*|\/)/, TokenType.OpFactor],
  [/^&&/, TokenType.OpLogicalAnd],
  [/^\|\|/, TokenType.OpLogicalOr],
  [/^%/, TokenType.OpRemainder],

  [/^'[^']*'/, TokenType.String],
  [/^"[^"]*"/, TokenType.String],

  [/^(true|false)/, TokenType.Boolean],

  [/^\(/, TokenType.OpenParenthesis],
  [/^\)/, TokenType.CloseParenthesis],

  [/^{/, TokenType.OpenBracket],
  [/^}/, TokenType.CloseBracket],

  [/^;/, TokenType.Semicolon],

  [/^\s+/, TokenType.Whitespaces, true],

  [/^if/, TokenType.IfKeyword],
  [/^else/, TokenType.ElseKeyword],
  [/^while/, TokenType.WhileKeyword],
];
