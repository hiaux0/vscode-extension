import { Command, Diagnostic, TextDocument, TextEdit } from 'vscode-languageserver';
import { attributeInvalidCaseFix } from '../Common/AttributeInvalidCaseFix';
import { HTMLDocumentParser } from './../FileParser/HTMLDocumentParser';

export class HtmlInvalidCaseCodeAction {
  public name = 'aurelia-attribute-invalid-case';

  public async commands(diagnostic: Diagnostic, document: TextDocument): Promise<Command> {
    const text = document.getText();
    const start = document.offsetAt(diagnostic.range.start);
    const end = document.offsetAt(diagnostic.range.end);
    const parser = new HTMLDocumentParser();
    const element = await parser.getElementAtPosition(text, start, end);

    const original = text.substring(start, end);
    let fixed = original;
    if (element) {
      fixed = attributeInvalidCaseFix(fixed, element.name);
    }

    return Command.create(
      `Rename ${original} to ${fixed}`,
      'aurelia-attribute-invalid-case',
      document.uri,
      document.version,
      [
        TextEdit.replace(diagnostic.range, fixed),
      ]);
  }
}
