import 'reflect-metadata';
import { createConnection, 
  IConnection, 
  TextDocuments, 
  InitializeParams, 
  InitializeResult, 
  CompletionList, Hover } from 'vscode-languageserver';
import { MarkedString } from 'vscode-languageserver-types';
import { HTMLDocument, getLanguageService } from './aurelia-languageservice/aureliaLanguageService';
import { getLanguageModelCache } from './languageModelCache';
import { Container } from 'aurelia-dependency-injection';
import CompletionItemFactory from './CompletionItemFactory';
import ElementLibrary from './Completions/Library/_elementLibrary';
import AureliaSettings from './AureliaSettings';
import ProcessFiles from './FileParser/ProcessFiles';
import {fileUriToPath} from './Util/FileUriToPath';
import {AureliaApplication} from './FileParser/Model/AureliaApplication';

// Bind console.log & error to the Aurelia output
let connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

// Cache documents
const documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// Setup Aurelia dependency injection
let globalContainer = new Container();
let completionItemFactory = <CompletionItemFactory> globalContainer.get(CompletionItemFactory);
let aureliaApplication = <AureliaApplication> globalContainer.get(AureliaApplication);

let rootPath;
let webcomponents = [];

// Register characters to lisen for
connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
  
   // TODO: find better way to init this
  let dummy = globalContainer.get(ElementLibrary);
  rootPath = params.rootPath;

  let fileProcessor = new ProcessFiles();
  await fileProcessor.processPath(rootPath);
  webcomponents = fileProcessor.components;
  aureliaApplication.components = fileProcessor.components;

  return {
    capabilities: {
      completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
      textDocumentSync: documents.syncKind,
    },
  };
});

// Register and get changes to Aurelia settings
connection.onDidChangeConfiguration(change => { 
  let settings = <AureliaSettings> globalContainer.get(AureliaSettings);
  settings.quote = change.settings.aurelia.autocomplete.quotes === 'single' ? '\'' : '"';
});

documents.onDidClose(event => {
  if (event.document.languageId === 'html') {
    console.log('remove document');
  }
});

documents.onDidChangeContent(event => {
  if (event.document.languageId === 'html') {
    console.log('html document changed' + fileUriToPath(event.document.uri));
  }
});


// Lisen for completion requests
connection.onCompletion(textDocumentPosition => {
  let document = documents.get(textDocumentPosition.textDocument.uri);
  let text = document.getText();
  let offset = document.offsetAt(textDocumentPosition.position);
  let triggerCharacter = text.substring(offset - 1, offset);
  let position = textDocumentPosition.position;
  return completionItemFactory.create(triggerCharacter, position, text, offset, textDocumentPosition.textDocument.uri);
});

//
connection.onRequest('aurelia-view-information', (filePath: string) => {
  const component = webcomponents.find(doc => doc.paths.indexOf(filePath) > -1);
  return component;
});


connection.listen();
