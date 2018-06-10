import { Parser, sourceContext } from 'aurelia-binding';
import { sys } from 'typescript';
import * as Uri from 'vscode-uri';
import { IFileParser } from '../FileParser';
import { HTMLDocumentParser } from '../HTMLDocumentParser';
import { HtmlFile } from './../HtmlFile';

import * as ts from 'typescript';
import { ScriptFileParser } from './ScriptFileParser';

export class AureliaHtmlFileParser implements IFileParser {

  public async parse(uri: string, content: string): Promise<HtmlFile> {

    const document = await this.getHtmlDocument(content);

    const htmlFile = new HtmlFile();
    htmlFile.fileName = uri;

    const tsUri = uri.replace('.html', '.ts');
    const tsFilePath = Uri.default.parse(tsUri).fsPath;
    if (sys.fileExists(tsFilePath)) {
        htmlFile.code = sys.readFile(tsFilePath);
    }

    const scriptParser = new ScriptFileParser();
    const scriptFile = await scriptParser.parse(uri);

    htmlFile.className = scriptFile.classes[0].name;

    return htmlFile;
  }

  private async getHtmlDocument(content) {
    const docParser = new HTMLDocumentParser();
    return await docParser.parse(content);
  }
}
