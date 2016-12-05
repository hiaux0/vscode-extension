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
            documentation: `The type of control to display. The default type is text, if this attribute is not specified.`,
            kind: 15 /* Snippet */,
            label: 'type.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`type.bind="$0"`)
        });
        result.push({
            documentation: `If the value of the type attribute is file, then this attribute will indicate the types of files ` +
                `that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content ` +
                `type specifiers:
- A file extension starting with the STOP character (U+002E). (E.g.: ".jpg,.png,.doc")
- A valid MIME type with no extensions
- audio/* representing sound files (HTML5)
- video/* representing video files (HTML5)
- image/* representing image files (HTML5).
`,
            kind: 10 /* Property */,
            label: 'accept',
            insertText: vscode_languageserver_types_1.SnippetString.create(`accept="$0"`)
        });
        result.push({
            documentation: `If the value of the type attribute is file, then this attribute will indicate the types of files ` +
                `that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content ` +
                `type specifiers:
- A file extension starting with the STOP character (U+002E). (E.g.: ".jpg,.png,.doc")
- A valid MIME type with no extensions
- audio/* representing sound files (HTML5)
- video/* representing video files (HTML5)
- image/* representing image files (HTML5).
`,
            kind: 15 /* Snippet */,
            label: 'accept.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`accept.bind="$0"`)
        });
        result.push({
            documentation: `(HTML5) This attribute indicates whether the value of the control can be automatically completed by the browser.`,
            kind: 10 /* Property */,
            label: 'autocomplete',
            insertText: vscode_languageserver_types_1.SnippetString.create(`autocomplete="$0"`)
        });
        result.push({
            documentation: `(HTML5) This attribute indicates whether the value of the control can be automatically completed by the browser.`,
            kind: 15 /* Snippet */,
            label: 'autocomplete.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`autocomplete.bind="$0"`)
        });
        result.push({
            documentation: `(HTML5) This Boolean attribute lets you specify that a form control should have input focus when the page loads, ` +
                `unless the user overrides it, for example by typing in a different control. Only one form element in a document can have the ` +
                `autofocus attribute, which is a Boolean. It cannot be applied if the type attribute is set to hidden (that is, you cannot ` +
                `automatically set focus to a hidden control). Note that the focusing of the control may occur before the firing of the DOMContentLoaded event.`,
            kind: 10 /* Property */,
            label: 'autofocus',
            insertText: vscode_languageserver_types_1.SnippetString.create(`autofocus="$0"`)
        });
        result.push({
            documentation: `(HTML5) This Boolean attribute lets you specify that a form control should have input focus when the page loads, ` +
                `unless the user overrides it, for example by typing in a different control. Only one form element in a document can have the ` +
                `autofocus attribute, which is a Boolean. It cannot be applied if the type attribute is set to hidden (that is, you cannot ` +
                `automatically set focus to a hidden control). Note that the focusing of the control may occur before the firing of the DOMContentLoaded event.`,
            kind: 15 /* Snippet */,
            label: 'autofocus.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`autofocus.bind="$0"`)
        });
        result.push({
            documentation: `When the value of the type attribute is file, the presence of this Boolean attribute indicates that capture of ` +
                `media directly from the device's environment using a media capture mechanism is preferred.`,
            kind: 10 /* Property */,
            label: 'capture',
            insertText: vscode_languageserver_types_1.SnippetString.create(`capture="$0"`)
        });
        result.push({
            documentation: `When the value of the type attribute is file, the presence of this Boolean attribute indicates that capture of ` +
                `media directly from the device's environment using a media capture mechanism is preferred.`,
            kind: 15 /* Snippet */,
            label: 'capture.bind',
            insertText: vscode_languageserver_types_1.SnippetString.create(`capture.bind="$0"`)
        });
        return result;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AureliaAttributeCompletionFactory;
//# sourceMappingURL=AttributeCompletionFactory.js.map