import { Registry } from 'vscode-textmate';

const registry = new Registry();
registry.loadGrammarFromPathSync('./syntaxes/html.json');
const grammar = registry.grammarForScopeName('au.html');

export function tokenizeLine(line: string) {
  return grammar.tokenizeLine(line, undefined);
}

export function getTokenOnCharRange(
  lineToken,
  startIndex: number,
  endIndex: number) {

  const tokens = lineToken.tokens.filter((token) => token.startIndex === startIndex && token.endIndex === endIndex);
  return tokens.length === 1 ? tokens[0] : null;
}

export function hasScope(scopes: string[], scope: string) {
  const foundScopes = scopes.filter((s) => s === scope);
  return foundScopes.length === 1;
}

export function writeOut(lineToken, text) {
  for (const lt of lineToken.tokens) {
    // tslint:disable-next-line:no-console
    console.log(`${lt.startIndex} - ${lt.endIndex} => ${text.substring(lt.startIndex, lt.endIndex)}`);
    for (const s of lt.scopes) {
      // tslint:disable-next-line:no-console
      console.log(`- ${s}`);
    }
  }
}
