"use strict";
const TypeValues_1 = require('./Input/TypeValues');
class AureliaAttributeCompletionFactory {
    static create(elementName, attributeName, bindingName) {
        if (bindingName) {
            console.log('binding');
        }
        switch (elementName) {
            case 'input':
                return this.createInputAttributes(attributeName);
        }
    }
    static createInputAttributes(attributeName) {
        switch (attributeName) {
            case 'type':
                return TypeValues_1.default();
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AureliaAttributeCompletionFactory;
//# sourceMappingURL=AttributeValueCompletionFactory.js.map