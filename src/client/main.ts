import * as path from 'path';
import { ExtensionContext, OutputChannel, window, languages } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';
import htmlInvalidCasingActionProvider from './htmlInvalidCasingCodeActionProvider';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

  // Create default output channel
  outputChannel = window.createOutputChannel('aurelia');
  context.subscriptions.push(outputChannel);

  // Register CLI commands
  context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));

  // Register code fix
  const invalidCasingAction = new htmlInvalidCasingActionProvider();
  invalidCasingAction.activate(context.subscriptions);
  languages.registerCodeActionsProvider('html', invalidCasingAction);

}
