import { IFileParser, ScriptFile } from "../FileParser";
import { HTMLDocumentParser, TagDefinition } from "../HTMLDocumentParser";
import { Parser, sourceContext } from "aurelia-binding";
import { sys, createSourceFile, ScriptTarget, ScriptKind, forEachChild, SyntaxKind, Node, ClassDeclaration, PropertyDeclaration, MethodDeclaration, ParameterDeclaration } from 'typescript';

import * as ts from 'typescript';
import { fileUriToPath } from "../../Util/FileUriToPath";

export class ScriptFileParser implements IFileParser {
  
  public async parse(uri: string): Promise<ScriptFile> {

    const scriptFile = new ScriptFile();
    const path = fileUriToPath(uri.replace('.html', '.ts'));
    const tsContent = sys.readFile(path);
    
    let sourceFile = createSourceFile(
        path,
        tsContent,
        ScriptTarget.Latest,
        true,
        ScriptKind.TS);

    let classes = [];
    forEachChild(sourceFile, n => {
      if (n.kind === SyntaxKind.ClassDeclaration) {
        classes.push(processClassDeclaration(n));
      }
    });

    scriptFile.classes = classes;

    return scriptFile;
  }

  private async getHtmlDocument(content) {
    const docParser = new HTMLDocumentParser();
    return await docParser.parse(content);
  } 
}


function processClassDeclaration(node: Node) {
  let properties = [];
  let methods = [];
  if (!node) {
    return { properties, methods };
  }

  let declaration = (node as ClassDeclaration);
  if (declaration.members) {
    for (let member of declaration.members) {
      switch (member.kind) {
        case SyntaxKind.PropertyDeclaration:
          let property = member as PropertyDeclaration;
          let propertyModifiers;
          if (property.modifiers) {
            propertyModifiers = property.modifiers.map(i => i.getText());
            if (propertyModifiers.indexOf("private") > -1) {
              continue;
            }
          }
          const propertyName = property.name.getText();
          let propertyType = undefined;
          if (property.type) {
            propertyType = property.type.getText();
          }
          properties.push({
            name: propertyName,
            modifiers: propertyModifiers,
            type: propertyType
          });
          break;
        case SyntaxKind.GetAccessor:
          break;
        case SyntaxKind.MethodDeclaration:
          let memberDeclaration = member as MethodDeclaration;
          let memberModifiers;
          if (memberDeclaration.modifiers){
            memberModifiers = memberDeclaration.modifiers.map(i => i.getText());
            if (memberModifiers.indexOf("private") > -1) {
              continue;
            }
          }
          let memberName = memberDeclaration.name.getText();
          let memberReturnType = undefined;
          if (memberDeclaration.type) {
            memberReturnType = memberDeclaration.type.getText();
          }

          let params = [];
          if (memberDeclaration.parameters) {
            for (let param of memberDeclaration.parameters) {
              const p = param as ParameterDeclaration;
              params.push(p.name.getText());
            }
          }

          methods.push({
            name: memberName,
            returnType: memberReturnType,
            modifiers: memberModifiers,
            parameters: params

          });
          break;
      }
    }
  }

  let classModifiers = [];
  if (declaration.modifiers) {
    classModifiers = declaration.modifiers.map(m => m.getText());
  }

  return {
    name: declaration.name.getText(),
    properties,
    methods,
    modifiers: classModifiers
  };
}