import * as path from 'path';
import { ExtensionContext, OutputChannel, window, languages, SnippetString } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import htmlInvalidCasingActionProvider from './htmlInvalidCasingCodeActionProvider';
import CommandFowarder from './commandFowarder';

import * as vscode from 'vscode';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

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
  
  let commandFowarder = new CommandFowarder();
  context.subscriptions.push(...commandFowarder.register(client));


  context.subscriptions.push(disposable);
}
