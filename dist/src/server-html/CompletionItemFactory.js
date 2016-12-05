"use strict";
const vscode_languageserver_1 = require('vscode-languageserver');
const AttributeCompletionFactory_1 = require('./Completions/AttributeCompletionFactory');
const AttributeValueCompletionFactory_1 = require('./Completions/Attributes/AttributeValueCompletionFactory');
class CompletionItemFactory {
    static create(triggerCharacter, text, position, completionsFromSource, uri) {
        switch (triggerCharacter) {
            case ' ':
                return this.createAttributeCompletion(text, position);
            case '<':
                return this.createElementCompletion(text, position);
            case '[':
                return this.createEmmetCompletion(text, position);
            case '.':
                return this.createBindingCompletion(text, position);
            case '"':
            case '\'':
                return this.createValueCompletion(text, position, completionsFromSource, uri);
        }
    }
    static createAttributeCompletion(text, position) {
        let nextCharacter = text.substring(position, position + 1);
        if (nextCharacter === '>' || /\s/.test(nextCharacter)) {
            let elementMatch = CompletionItemFactory.elementMatch.exec(text.substring(0, position));
            if (elementMatch !== null && elementMatch.length) {
                let elementName = elementMatch[1];
                return AttributeCompletionFactory_1.default.create(elementName);
            }
        }
        return null;
    }
    static createValueCompletion(text, position, completionsFromSource, uri) {
        let nextCharacter = text.substring(position, position + 1);
        if (/['"]/.test(nextCharacter)) {
            let postText = text.substring(0, position);
            let elementMatch = CompletionItemFactory.elementMatch.exec(postText);
            let attributeMatch = CompletionItemFactory.attributeMatch.exec(postText);
            if (elementMatch !== null && elementMatch.length) {
                let elementName = elementMatch[1];
                let attributeName = attributeMatch[1];
                let bindingName = attributeMatch[2];
                if (bindingName) {
                    let sourceUri = uri.replace(".html", ".ts");
                    for (let completion of completionsFromSource) {
                        if (completion.uri === sourceUri) {
                            let result = [];
                            for (let propCollection of completion.properties) {
                                for (let prop of propCollection) {
                                    result.push({
                                        kind: 12 /* Value */,
                                        label: prop,
                                        insertText: vscode_languageserver_1.SnippetString.create(prop)
                                    });
                                }
                            }
                            return result;
                        }
                    }
                }
                return AttributeValueCompletionFactory_1.default.create(elementName, attributeName, bindingName);
            }
        }
        return null;
    }
    static createElementCompletion(text, position) {
        return null;
    }
    static createEmmetCompletion(text, position) {
        return null;
    }
    static createBindingCompletion(text, position) {
        return null;
    }
}
CompletionItemFactory.elementMatch = /<([a-zA-Z-]*)\s([^<]*)$/;
CompletionItemFactory.attributeMatch = /([a-zA-Z-]*)\.?([a-zA-Z-]*)?=['"]$/;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompletionItemFactory;
//# sourceMappingURL=CompletionItemFactory.js.map