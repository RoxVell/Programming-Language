export enum TokenType {
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolean',

  OpAdditive = 'OpAdditive',
  OpFactor = 'OpFactor',
  OpExponentiation = 'OpExponentiation',
  OpComparison = 'OpComparison',
  OpLogicalAnd = 'OpLogicalAnd',
  OpLogicalOr = 'OpLogicalOr',
  OpRemainder = 'OpRemainder',

  OpenParenthesis = 'OpenParenthesis',
  CloseParenthesis = 'CloseParenthesis',

  OpenBracket = 'OpenBracket',
  CloseBracket = 'CloseBracket',

  Semicolon = 'Semicolon',
  Comma = 'Comma',
  Equal = 'Equal',
  EqualEqual = 'EqualEqual',

  Assignment = 'Assignment',

  Identifier = 'Identifier',

  Whitespaces = 'Whitespaces',
  Comment = 'Comment',
  // Keywords
  IfKeyword = 'IfKeyword',
  ElseKeyword = 'ElseKeyword',
  WhileKeyword = 'WhileKeyword',
  DoKeyword = 'DoKeyword',
  LetKeyword = 'LetKeyword',
  ConstKeyword = 'ConstKeyword',
  Fn = 'Fn',
  Return = 'Return',
}
