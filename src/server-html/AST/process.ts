import { Node, SyntaxKind, SourceFile, createSourceFile, ScriptTarget, ScriptKind, forEachChild } from "typescript";

export default function processSourceFile(fileName: string, content: string, type: string) {
  let sourceFile = createSourceFile(
        fileName, 
        content, 
        ScriptTarget.Latest,
        true,
        type === "typescript" ? ScriptKind.TS : ScriptKind.JS);
  return {
    properties: processFile(sourceFile),
    uri: fileName
  }
}

function processFile(sourceFile: SourceFile) {
 
  let getCodeInformation = (node : Node) => {  
    let properties = [];
    if (node.kind === SyntaxKind.ClassDeclaration) {
        properties.push(processClassDeclaration(node));
    } else {
        properties.push(...forEachChild(node, getCodeInformation));
    }
    return properties; 
  }
  return getCodeInformation(sourceFile);
}

function processClassDeclaration(node: Node) {
    let properties = [];
    forEachChild(node, x => {
      if (x.kind === SyntaxKind.PropertyDeclaration && x.getFirstToken().kind !== SyntaxKind.PrivateKeyword) {
        forEachChild(x, y => {
          if (y.kind === SyntaxKind.Identifier) {
            properties.push(y.getText());
          }
        });
      }
    });
    return properties;
}
