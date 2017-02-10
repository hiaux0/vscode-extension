import * as path from 'path';
import { ExtensionContext, OutputChannel, window, languages, SnippetString } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import htmlInvalidCasingActionProvider from './htmlInvalidCasingCodeActionProvider';
import CommandFowarder from './commandFowarder';

import * as vscode from 'vscode';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

  console.log('ACTIVATE');

  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);

  // Register code fix
  const invalidCasingAction = new htmlInvalidCasingActionProvider();
  invalidCasingAction.activate(context.subscriptions);
  languages.registerCodeActionsProvider('aurelia-html', invalidCasingAction);

  // Register Aurelia language server
  const serverModule = context.asAbsolutePath(path.join('dist', 'src', 'server', 'main.js'));
  const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
  const serverOptions: ServerOptions = {
    debug: { module: serverModule, options: debugOptions, transport: TransportKind.ipc },
    run: { module: serverModule, transport: TransportKind.ipc },
  };

  const clientOptions: LanguageClientOptions = {
    diagnosticCollectionName: 'Aurelia',
    documentSelector: ['aurelia-html'],
    initializationOptions: {},
    synchronize: {
      configurationSection: ['aurelia'],
    },
  };
  const client = new LanguageClient('aurelia-html', 'Aurelia', serverOptions, clientOptions);
  const disposable = client.start(); 
  
  setTimeout(() => {
    
    client.onRequest('aurelia-cli.ui.ensureAnswer', (answer, question, suggestion) => {
      
      return vscode.window.showInputBox({
        placeHolder: suggestion,
        prompt: question
      });
      
    });

    client.onRequest('aurelia-cli.ui.question', (text, optionsOrSuggestion) => {
      let options = optionsOrSuggestion.map(i => new QuickPickOption(i.value, i.displayName, i.description));
      return vscode.window.showQuickPick(options, { placeHolder : text });    
    });

    client.onRequest('aurelia-cli.ui.multiselect', (text, optionsOrSuggestion) => {
      // this.sendRequest('aurelia-cli.ui.multiselect', question, options);
      // return vscode.window.showInputBox({
        
      // });
      vscode.window.showWarningMessage('multi select not implemented');
      
    });

  }, 1000);


  let commandFowarder = new CommandFowarder();
  context.subscriptions.push(...commandFowarder.register(client));



  context.subscriptions.push(disposable);
}


class QuickPickOption implements vscode.QuickPickItem {
  constructor(public label: string, public description: string, detail?: string) { }
}
