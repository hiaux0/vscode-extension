import { Parser, sourceContext } from 'aurelia-binding';
import { ClassDeclaration, createSourceFile, forEachChild, MethodDeclaration, Node, ParameterDeclaration, PropertyDeclaration, ScriptKind, ScriptTarget, SyntaxKind, sys } from 'typescript';
import { IFileParser } from '../FileParser';
import { HTMLDocumentParser } from '../HTMLDocumentParser';
import { ScriptFile } from '../ScriptFile';

import * as ts from 'typescript';
import { fileUriToPath } from '../../Util/FileUriToPath';

export class ScriptFileParser implements IFileParser {

  public async parse(uri: string): Promise<ScriptFile> {

    const scriptFile = new ScriptFile();
    const path = fileUriToPath(uri.replace('.html', '.ts'));
    const tsContent = sys.readFile(path);

    const sourceFile = createSourceFile(
        path,
        tsContent,
        ScriptTarget.Latest,
        true,
        ScriptKind.TS);

    const classes = [];
    forEachChild(sourceFile, (n) => {
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
  const properties = [];
  const methods = [];
  if (!node) {
    return { properties, methods };
  }

  const declaration = (node as ClassDeclaration);
  if (declaration.members) {
    for (const member of declaration.members) {
      switch (member.kind) {
        case SyntaxKind.PropertyDeclaration:
          const property = member as PropertyDeclaration;
          let propertyModifiers;
          if (property.modifiers) {
            propertyModifiers = property.modifiers.map((i) => i.getText());
            if (propertyModifiers.indexOf('private') > -1) {
              continue;
            }
          }
          const propertyName = property.name.getText();
          let propertyType;
          if (property.type) {
            propertyType = property.type.getText();
          }
          properties.push({
            modifiers: propertyModifiers,
            name: propertyName,
            type: propertyType,
          });
          break;
        case SyntaxKind.GetAccessor:
          break;
        case SyntaxKind.MethodDeclaration:
          const memberDeclaration = member as MethodDeclaration;
          let memberModifiers;
          if (memberDeclaration.modifiers) {
            memberModifiers = memberDeclaration.modifiers.map((i) => i.getText());
            if (memberModifiers.indexOf('private') > -1) {
              continue;
            }
          }
          const memberName = memberDeclaration.name.getText();
          let memberReturnType;
          if (memberDeclaration.type) {
            memberReturnType = memberDeclaration.type.getText();
          }

          const params = [];
          if (memberDeclaration.parameters) {
            for (const param of memberDeclaration.parameters) {
              const p = param as ParameterDeclaration;
              params.push(p.name.getText());
            }
          }

          methods.push({
            modifiers: memberModifiers,
            name: memberName,
            parameters: params,
            returnType: memberReturnType,
          });
          break;
      }
    }
  }

  let classModifiers = [];
  if (declaration.modifiers) {
    classModifiers = declaration.modifiers.map((m) => m.getText());
  }

  return {
    methods,
    modifiers: classModifiers,
    name: declaration.name.getText(),
    properties,
  };
}
