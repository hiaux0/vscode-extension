import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { AuFile } from '../../server/FileParser/Model/Files/AuFile';
import { FileAccess } from '../../server/FileParser/FileAccess';

export class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {

  private onDidChangeInteral = new vscode.EventEmitter<vscode.Uri>();

  constructor(private client: LanguageClient) {

  }

  public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {

    if (!vscode.window.activeTextEditor.document) {
      return Promise.resolve('<p>no data</p>');
    }

    const file = await this.client.sendRequest(
      'aurelia-view-information',
      vscode.window.activeTextEditor.document.uri.toString());

    switch ((file as File).type) {
      case 'aurelia file':
        return this.displayAuFile(file as AuFile);
    }

    return '<html>file: </html>';
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this.onDidChangeInteral.event;
  }

  public update(uri: vscode.Uri) {
    this.onDidChangeInteral.fire(uri);
  }

  private displayAuFile(auFile: AuFile): string {
    const extensionPath = vscode.extensions.getExtension('AureliaEffect.aurelia').extensionPath;
    const fileAccess = new FileAccess();
    let content = fileAccess.readFileContent(extensionPath + '/src/client/Preview/App/index.html');
    content = content.replace('</head>', '<script>window.data = ' + JSON.stringify(auFile) + ';</script></head>');
    return content.replace('src="/', 'src="' + extensionPath + '/src/client/Preview/App/');
  }
}
