import 'reflect-metadata';
import { CompletionList,
  createConnection,
  IConnection,
  InitializeParams,
  InitializeResult,
  TextDocuments } from 'vscode-languageserver';

import { Container } from 'aurelia-dependency-injection';
import AureliaSettings from './AureliaSettings';
import ElementLibrary from './Completions/Library/_elementLibrary';

import { HtmlInvalidCaseCodeAction } from './CodeActions/HtmlInvalidCaseCodeAction';
import { OneWayBindingDeprecatedCodeAction } from './CodeActions/OneWayBindingDeprecatedCodeAction';
import { HtmlValidator } from './Validations/HtmlValidator';

import { HtmlComplete } from './Completions/HtmlComplete';
import { FileAccess } from './FileParser/FileAccess';
import FileParser from './FileParser/FileParser';
import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { normalizePath } from './Util/NormalizePath';
import { Workspace } from './Workspace';

// Bind console.log & error to the Aurelia output
const connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// Setup Aurelia dependency injection
const globalContainer = new Container();
// const completionItemFactory = globalContainer.get(CompletionItemFactory) as CompletionItemFactory;
const aureliaApplication = globalContainer.get(AureliaApplication) as AureliaApplication;
const settings = globalContainer.get(AureliaSettings) as AureliaSettings;
const workspace = globalContainer.get(Workspace) as Workspace;

// Register characters to lisen for
connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

  workspace.path = params.rootPath;

  // TODO: find better way/place to init this
  const dummy = globalContainer.get(ElementLibrary);

  return {
    capabilities: {
      codeActionProvider: true,
      completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
      textDocumentSync: documents.syncKind,
    },
  };
});

const fileParser = new FileParser();

documents.onDidChangeContent(async (change) => {
  workspace.files.set(change.document.uri, await fileParser.parse(change.document.uri, change.document.getText()));
});

connection.onRequest('aurelia-view-information', async (uri: string) => {

  if (!workspace.files.has(uri)) {
    const fileAccess = new FileAccess();
    workspace.files.set(uri, await fileParser.parse(uri, fileAccess.readFileContent(uri)));
  }
  return workspace.files.get(uri);
});

const codeActions = [
  new HtmlInvalidCaseCodeAction(),
  new OneWayBindingDeprecatedCodeAction(),
];
connection.onCodeAction(async (codeActionParams) => {
  const diagnostics = codeActionParams.context.diagnostics;
  const document = documents.get(codeActionParams.textDocument.uri);
  const commands = [];
  for (const diagnostic of diagnostics) {
    const action = codeActions.find((i) => i.name === diagnostic.code);
    if (action) {
      commands.push(await action.commands(diagnostic, document));
    }
  }
  return commands;
});

// Register and get changes to Aurelia settings
connection.onDidChangeConfiguration((change) => {
  settings.quote = change.settings.aurelia.autocomplete.quotes === 'single' ? '\'' : '"';
  settings.validation = change.settings.aurelia.validation;
  settings.bindings.data = change.settings.aurelia.autocomplete.bindings.data;
  settings.featureToggles = change.settings.aurelia.featureToggles;

  // await featureToggles(settings.featureToggles);
});

// Setup Validation
const validator = globalContainer.get(HtmlValidator) as HtmlValidator;
documents.onDidChangeContent(async (change) => {
  const diagnostics = await validator.doValidation(change.document);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

// Lisen for completion requests
const complete = globalContainer.get(HtmlComplete) as HtmlComplete;

connection.onCompletion(async (textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const text = document.getText();
    const offset = document.offsetAt(textDocumentPosition.position);
    const triggerCharacter = text.substring(offset - 1, offset);

    const completionItems = await complete.getCompletionItems(triggerCharacter, text, offset);
    return CompletionList.create(completionItems, false);
});

connection.onRequest('aurelia-view-information', (filePath: string) => {
  return aureliaApplication.components.find((doc) => doc.paths.indexOf(normalizePath(filePath)) > -1);
});

connection.listen();
