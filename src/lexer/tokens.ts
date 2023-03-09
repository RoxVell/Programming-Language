import { TokenType } from './token-type';
import { ASSIGNMENT_KINDS } from '../ast/ast-node';

export type TokenDictionary = [RegExp, TokenType, boolean?][];

function escapeRegexpString(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function getOptionsRegexp(options: readonly string[]): RegExp {
  const strOptions = options.map(option => escapeRegexpString(option));
  return new RegExp(`^(${strOptions.join('|')})`);
}

export const TOKENS: TokenDictionary = [
  [/^\d+/, TokenType.Number],

  [/^(\/\/.+)/, TokenType.Comment, true],
  [/^\/\*[\S\s]*\*\//, TokenType.Comment, true],

  [getOptionsRegexp(ASSIGNMENT_KINDS), TokenType.Assignment],

  [/^\*\*/, TokenType.OpExponentiation],
  [/^([<>])=?/, TokenType.OpComparison],
  [/^([+\-])/, TokenType.OpAdditive],
  [/^([*\/])/, TokenType.OpFactor],
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
  [/^,/, TokenType.Comma],

  [/^\s+/, TokenType.Whitespaces, true],

  [/^==/, TokenType.EqualEqual],
  [/^=/, TokenType.Equal],

  [/^if/, TokenType.IfKeyword],
  [/^else/, TokenType.ElseKeyword],
  [/^while/, TokenType.WhileKeyword],
  [/^do/, TokenType.DoKeyword],
  [/^let/, TokenType.LetKeyword],
  [/^const/, TokenType.ConstKeyword],
  [/^fn/, TokenType.Fn],
  [/^return\b/, TokenType.Return],

  [/^[_A-z][A-z\d]*/, TokenType.Identifier],
];
