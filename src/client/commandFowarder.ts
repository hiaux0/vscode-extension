import { commands, Disposable } from 'vscode';
import { LanguageClient, ExecuteCommandRequest } from 'vscode-languageclient';

export default class CommandFowarder {

  private disposables: Array<Disposable> = [];

  public register(client: LanguageClient): Array<Disposable> {
    for(let command of [ 
      //'aurelia-cli.new',
      'aurelia-cli.generate',
      'aurelia-cli.test',
      'aurelia-cli.build',
      'aurelia-cli.run',
      'aurelia-cli.run-watch'
    ]) {
      this.disposables.push(
        commands.registerCommand(command, (args: Array<any>) => {
          client.sendRequest(ExecuteCommandRequest.type, {
            command: command,
            arguments: args
          });
      }));
    }

    return this.disposables;
  }
}
