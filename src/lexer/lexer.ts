import { TokenType } from './token-type';
import { TokenDictionary } from './tokens';

export interface LexerToken {
  type: TokenType;
  // location: [number, number];
  value: string;
}

type Location = {
  start: [number, number];
  end: [number, number];
}

export class Lexer {
  private lastPosition = 0;

  constructor(
    private readonly code: string,
    private readonly tokenDictionary: TokenDictionary,
  ) {
    // const lineLocations = this.code.split('\n').reduce((acc, line) => {
    //   const lastIndex = acc[acc.length - 1] ? acc[acc.length - 1][1] : 0;
    //   acc.push({
    //     start: [line, ]
    //   });
    //   return acc;
    // }, [] as Location[]);

    // console.log(lineLocations);
  }

  getNextToken(): LexerToken | null {
    const stringToSearch = this.code.slice(this.lastPosition);

    if (!stringToSearch) {
      return null;
    }

    for (let [regexp, tokenType, isIgnore] of this.tokenDictionary) {
      const result = stringToSearch.match(regexp);

      if (result) {
        this.lastPosition += result[0].length;

        if (isIgnore) {
          return this.getNextToken();
        }

        return {
          type: tokenType,
          value: result[0],
          // location: [0, 0] // TODO
        };
      }
    }

    throw new Error(`Unexpected token found "${stringToSearch.slice(0, 15)}"`);
  }
}
