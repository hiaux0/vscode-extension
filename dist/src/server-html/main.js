"use strict";
const vscode_languageserver_1 = require('vscode-languageserver');
const CompletionItemFactory_1 = require('./CompletionItemFactory');
const process_1 = require('./AST/process');
let connection = vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
const regex = /(bind|one-(way|time)|two-way)=['"]([a-zA-Z]*)['"]/g;
documents.onDidChangeContent(change => {
    let document = change.document;
    let result = process_1.default(document.uri, document.getText(), document.languageId);
    let found = false;
    for (let comp of completionsFromSource) {
        if (comp.uri === result.uri) {
            completionsFromSource.splice(completionsFromSource.indexOf(comp), 1, result);
            found = true;
            break;
        }
    }
    if (!found) {
        completionsFromSource.push(result);
    }
    let diagnostics = [];
    document = documents.get(change.document.uri.replace('.ts', '.html'));
    let lines = document.getText().split(/\r?\n/g);
    lines.forEach((line, i) => {
        let match;
        while (match = regex.exec(line)) {
            let lengthBinding = match[1].length;
            let lengthVariable = match[3].length;
            let idx = match.index;
            if (result.properties[0].indexOf(match[3]) <= -1) {
                diagnostics.push({
                    severity: 1 /* Error */,
                    range: {
                        start: { line: i, character: idx + lengthBinding + 2 },
                        end: { line: i, character: idx + lengthBinding + 2 + lengthVariable }
                    },
                    message: `${line.substr(idx + lengthBinding + 2, lengthVariable)} is private or does not exist anymore`,
                    source: 'ex'
                });
            }
        }
    });
    connection.sendDiagnostics({ uri: change.document.uri.replace('.ts', '.html'), diagnostics });
});
let workspacePath;
connection.onInitialize((params) => {
    workspacePath = params.rootPath;
    return {
        capabilities: {
            completionProvider: { resolveProvider: false, triggerCharacters: ['<', ' ', '.', '[', '"', '\''] },
            textDocumentSync: documents.syncKind
        },
    };
});
let completionsFromSource = [];
connection.onCompletion(textDocumentPosition => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let text = document.getText();
    let offset = document.offsetAt(textDocumentPosition.position);
    let triggerCharacter = text.substring(offset - 1, offset);
    let result = { isIncomplete: false, items: [] };
    let completionItem = CompletionItemFactory_1.default.create(triggerCharacter, text, offset, completionsFromSource, textDocumentPosition.textDocument.uri);
    if (completionItem) {
        result.items.push(...completionItem);
    }
    return result;
});
connection.listen();
//# sourceMappingURL=main.js.map