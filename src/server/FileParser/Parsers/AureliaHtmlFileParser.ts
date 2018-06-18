import { sys } from 'typescript';
import * as Uri from 'vscode-uri';
import { HtmlFile } from '../Model/Files/HtmlFile';
import { ScriptFileParser } from './ScriptFileParser';

export class AureliaHtmlFileParser {

  public async parse(uri: string, content: string): Promise<HtmlFile> {

    const htmlFile = new HtmlFile();
    htmlFile.fileName = uri;

    const tsUri = uri.replace('.html', '.ts');
    const tsFilePath = Uri.default.parse(tsUri).fsPath;
    if (sys.fileExists(tsFilePath)) {
        htmlFile.code = sys.readFile(tsFilePath);
    } else {
      const jsUri = uri.replace('.html', '.js');
      const jsFilePath = Uri.default.parse(jsUri).fsPath;
      htmlFile.code = sys.readFile(jsFilePath);
    }

    const scriptParser = new ScriptFileParser();
    const scriptFile = await scriptParser.parse(uri);

    htmlFile.className = scriptFile.classes[0].name;
    htmlFile.length = scriptFile.length;

    return htmlFile;
  }
}
