"use strict";
const typescript_1 = require("typescript");
function processSourceFile(fileName, content, type) {
    let sourceFile = typescript_1.createSourceFile(fileName, content, typescript_1.ScriptTarget.Latest, true, type === "typescript" ? typescript_1.ScriptKind.TS : typescript_1.ScriptKind.JS);
    return {
        properties: processFile(sourceFile),
        uri: fileName
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = processSourceFile;
function processFile(sourceFile) {
    let getCodeInformation = (node) => {
        let properties = [];
        if (node.kind === typescript_1.SyntaxKind.ClassDeclaration) {
            properties.push(processClassDeclaration(node));
        }
        else {
            properties.push(...typescript_1.forEachChild(node, getCodeInformation));
        }
        return properties;
    };
    return getCodeInformation(sourceFile);
}
function processClassDeclaration(node) {
    let properties = [];
    typescript_1.forEachChild(node, x => {
        if (x.kind === typescript_1.SyntaxKind.PropertyDeclaration && x.getFirstToken().kind !== typescript_1.SyntaxKind.PrivateKeyword) {
            typescript_1.forEachChild(x, y => {
                if (y.kind === typescript_1.SyntaxKind.Identifier) {
                    properties.push(y.getText());
                }
            });
        }
    });
    return properties;
}
//# sourceMappingURL=process.js.map