"use strict";
const vscode_languageserver_types_1 = require('vscode-languageserver-types');
class AureliaAttributeCompletionFactory {
    static create(elementName) {
        switch (elementName) {
            case 'input':
                return this.createInputAttributes();
        }
    }
    static createInputAttributes() {
        let result = [];
        result.push({
            documentation: `The type of control to display. The default type is text, if this attribute is not specified.`,
            kind: 10 /* Property */,
            label: 'type',
            insertText: vscode_languageserver_types_1.SnippetString.create(`type="$0"`)
        });
        result.push({
            documentation: `The initial value of the control. This attribute is optional except when the value of the type attribute is radio or checkbox.`,
            kind: 15 /* Snippet */,
            label: 'value.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`value.bind="$0"`)
        });
        return result;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AureliaAttributeCompletionFactory;
//# sourceMappingURL=AureliaAttributeCompletionFactory.js.map