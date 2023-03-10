import { Lexer, LexerToken } from './lexer';
import { TOKENS } from './tokens';
import { TokenType } from './token-type';
import { ASSIGNMENT_KINDS } from '../ast/ast-node';

function testLexer(code: string, tokens: LexerToken[]) {
  const lexer = new Lexer(code, TOKENS);
  const resultTokens = [];

  while (true) {
    const token = lexer.getNextToken();

    if (!token) {
      break;
    }

    resultTokens.push(token);
  }

  expect(resultTokens).toEqual(tokens);
}

describe('Lexer', function () {
  describe('Number Tokens', function () {
    it('should parse single number token', () => {
      const numberToParse = 55;
      testLexer(
        `${numberToParse}`,
        [{ type: TokenType.Number, value: `${numberToParse}` }]
      );
    });
  });

  describe('String Tokens', function () {
    it('should parse a string with a single quotes', () => {
      testLexer(
        `'some string'`,
        [
          { type: TokenType.String, value: `'some string'` }
        ]
      )
    });

    it('should parse a string with a double quotes', () => {
      testLexer(
        `"some string"`,
        [
          { type: TokenType.String, value: `"some string"` }
        ]
      )
    })
  });

  describe('Boolean Tokens', function () {
    it('should parse true boolean token', () => {
      testLexer(
        'true',
        [{ type: TokenType.Boolean, value: 'true' }]
      );
    });

    it('should parse false boolean token', () => {
      testLexer(
        'false', [{ type: TokenType.Boolean, value: 'false' }]
      );
    });
  });

  describe('Binary Operators', function () {
    it('should parse binary plus operator with numbers on the sides', () => {
      const leftNumber = 5;
      const rightNumber = 69;

      testLexer(
        `${leftNumber} + ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpAdditive, value: `+` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary minus operator with numbers on the sides', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber}   - ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpAdditive, value: `-` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary multiplication operator with numbers on the sides', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} * ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpFactor, value: `*` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary division operator with numbers on the sides', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} / ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpFactor, value: `/` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary division operator with numbers on the sides', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} % ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpRemainder, value: `%` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary plus operator with string on the sides', () => {
      const leftString = 'a';
      const rightString = 'b';

      testLexer(
        `'${leftString}' + '${rightString}'`,
        [
          { type: TokenType.String, value: `'${leftString}'` },
          { type: TokenType.OpAdditive, value: `+` },
          { type: TokenType.String, value: `'${rightString}'` },
        ]
      );
    });

    it('should parse binary exponentiation operator with numbers on the sides', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} ** ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpExponentiation, value: `**` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary greater than (>) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} > ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpComparison, value: `>` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary less than (<) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} < ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpComparison, value: `<` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary greater than or equal (>=) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} >= ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpComparison, value: `>=` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary greater than or equal (<=) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} <= ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpComparison, value: `<=` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary logical or (||) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} || ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpLogicalOr, value: `||` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });

    it('should parse binary logical and (&&) operator', () => {
      const leftNumber = 1337;
      const rightNumber = 228;

      testLexer(
        `${leftNumber} && ${rightNumber}`,
        [
          { type: TokenType.Number, value: `${leftNumber}` },
          { type: TokenType.OpLogicalAnd, value: `&&` },
          { type: TokenType.Number, value: `${rightNumber}` },
        ]
      );
    });
  });

  describe('Comments', function () {
    it('should skip single line comment', () => {
      testLexer(
        `// something`,
        []
      );
    });

    it('should skip multi line comment', () => {
      testLexer(
        `/*
          some
          multiline
          comment
        */`,
        []
      );
    });
  });

  describe('Parenthesis', function () {
    it('should parse parenthesis correctly', () => {
      testLexer(
        '()',
        [
          { type: TokenType.OpenParenthesis, value: '(' },
          { type: TokenType.CloseParenthesis, value: ')' },
        ]
      );
    });
  });

  describe('Brackets', () => {
    it('should parse brackets correctly', () => {
      testLexer(
        '{}',
        [
          {type: TokenType.OpenBracket, value: '{'},
          {type: TokenType.CloseBracket, value: '}'},
        ]
      );
    });
  });

  describe('Identifiers', () => {
    it('should parse identifiers correctly', () => {
      testLexer(`a b _abc __qwe`, [
        {type: TokenType.Identifier, value: 'a'},
        {type: TokenType.Identifier, value: 'b'},
        {type: TokenType.Identifier, value: '_abc'},
        {type: TokenType.Identifier, value: '__qwe'},
      ]);
    });
  });

  describe('Variable Declaration', () => {
    it('should parse variable declaration sequence correctly', () => {
      testLexer('let a = 5;', [
        { type: TokenType.LetKeyword, value: 'let' },
        { type: TokenType.Identifier, value: 'a' },
        { type: TokenType.Assignment, value: '=' },
        { type: TokenType.Number, value: '5' },
        { type: TokenType.Semicolon, value: ';' },
      ])
    });

    it('should parse variable declaration sequence correctly', () => {
      testLexer('const _privateVariable = 5;', [
        { type: TokenType.ConstKeyword, value: 'const' },
        { type: TokenType.Identifier, value: '_privateVariable' },
        { type: TokenType.Assignment, value: '=' },
        { type: TokenType.Number, value: '5' },
        { type: TokenType.Semicolon, value: ';' },
      ]);
    });
  });

  describe('Assignment', () => {
    it('should parse all assignments correctly', () => {
      testLexer(ASSIGNMENT_KINDS.join(' '), ASSIGNMENT_KINDS.map(assignmentKind => ({
        type: TokenType.Assignment,
        value: assignmentKind
      })));
    });
  });
});
