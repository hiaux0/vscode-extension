import * as Uri from 'vscode-uri';

export function fileUriToPath(uri: string) {
  return Uri.default.parse(uri).fsPath;
}
