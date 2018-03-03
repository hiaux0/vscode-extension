import { Diagnostic, TextEdit, Command, TextDocument } from "vscode-languageserver-types";

export class IfBindingConflictingCodeAction {
  public name = 'aurelia-repeat-with-if-binding';

  public async commands(diagnostic: Diagnostic, document: TextDocument): Promise<Command> {

    return Command.create(
      `Change 'if' binding to 'show' binding`, 
      'aurelia-repeat-with-if-binding', 
      document.uri, 
      document.version, 
      [
        TextEdit.replace(diagnostic.range, 'show')
      ]);
  }
}
