import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupContent, MarkupKind } from 'vscode-languageserver';
import { AttributeDefinition, HTMLDocumentParser, TagDefinition } from '../FileParser/Parsers/HTMLDocumentParser';
import { CompletionType, CompletionTypeDetection } from './CompletionTypeDetection';
import AttributeCompletion from './HtmlCompletions/AttributeCompletion';
import AttributeValueCompletion from './HtmlCompletions/AttributeValueCompletion';
import BindingCompletion from './HtmlCompletions/BindingCompletion';
import ElementCompletion from './HtmlCompletions/ElementCompletion';
import EmmetCompletion from './HtmlCompletions/EmmetCompletion';

import { displayPartsToString } from 'typescript';
import { Workspace } from '../Workspace';
import { getLanguageService } from './../FileParser/AureliaLanguageServiceHost';

import { Parser } from 'aurelia-binding';

@autoinject()
export class HtmlComplete {

  constructor(
    private htmlDocumentParser: HTMLDocumentParser,
    private attributeCompletion: AttributeCompletion,
    private attributeValueCompletion: AttributeValueCompletion,
    private bindingCompletion: BindingCompletion,
    private emmetCompletion: EmmetCompletion,
    private elementCompletion: ElementCompletion,
    private workspace: Workspace) { }

  public async getCompletionItems(
    triggerCharacter: string,
    text: string,
    positionNumber: number,
    uri: string): Promise<CompletionItem[]> {

      const nodes = await this.htmlDocumentParser.parse(text);
      let lastNode: TagDefinition;
      for (const node of nodes) {
        if (node.startOffset <= positionNumber && positionNumber <= node.endOffset) {
          lastNode = node;
          break;
        }
      }

      let elementName;
      let attributeDef: AttributeDefinition;
      if (lastNode) {
        elementName = this.getElementName(lastNode);
        attributeDef = lastNode.attributes[0];
      }

      const completionTypeDetection = new CompletionTypeDetection(text, lastNode);
      const completionType = completionTypeDetection.getCompletionType(triggerCharacter, positionNumber);

      switch (completionType) {
        case CompletionType.Attribute:
          let existingAttributes;
          if (lastNode) {
            existingAttributes = lastNode.attributes.map((attr) => attr.name);
          }
          return this.attributeCompletion.create(elementName, existingAttributes);
        case CompletionType.AttributeBinding:
          const nextChar = text.substring(positionNumber, positionNumber + 1);
          return this.bindingCompletion.create(lastNode, attributeDef, nextChar);
        case CompletionType.AttributeValue:
          return this.createDefaultAttributeValueCompletion(lastNode, positionNumber, uri);
        case CompletionType.Element:
      return this.elementCompletion.create(this.getLastOpenNode(nodes));
        case CompletionType.Emmet:
          return this.emmetCompletion.create(elementName);
        default:
        case CompletionType.None:
          return Promise.resolve([]);
      }
    }

    private getLastOpenNode(nodes: TagDefinition[]): string {
      for (let i = 0; i > 0; i--) {
        if (nodes[i].startTag) {
          return nodes[i].name;
        }
      }

      return null;
    }

    private getElementName(node: TagDefinition) {
      return node !== undefined ? node.name : null;
    }

    private createDefaultAttributeValueCompletion(lastNode: TagDefinition, positionNumber: number, uri: string) {

      let attribute: AttributeDefinition;
      for (const node of lastNode.attributes) {
        if (node.startOffset <= positionNumber && positionNumber <= node.endOffset) {
          attribute = node;
          break;
        }
      }

      const result: CompletionItem[] = [];

      // TypeScript attribute value completion
      try {
        if (attribute.binding) {

          const languageService = getLanguageService(this.workspace.path, this.workspace.files, attribute.value);
          const position = this.workspace.files.get(uri).length + 156 + attribute.value.length;
          const completions = languageService.getCompletionsAtPosition(
            uri,
            position,
            {
              includeExternalModuleExports: false,
              includeInsertTextCompletions: false,
            },
          );

          if (completions && completions.entries) {

            for (const completion of completions.entries) {
              if (completion.kind === 'warning') {
                continue;
              }

              const details = languageService.getCompletionEntryDetails(uri, position, completion.name, {}, completion.source, undefined);
              const doc = displayPartsToString(details.documentation);

              result.push({
                documentation: doc.length > 0 ? {
                  kind: MarkupKind.Markdown,
                  value: displayPartsToString(details.documentation),
                } as MarkupContent : undefined,
                insertText: completion.name,
                insertTextFormat: InsertTextFormat.Snippet,
                kind: getKind(completion.kind),
                label: completion.name,
                sortText: completion.sortText,
              });
            }
            return result;
          }
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
      }

      // Default attribute value completion
      result.push(...this.attributeValueCompletion.create(lastNode.name, attribute.name));

      return result;
    }
}

function getKind(kind: string): CompletionItemKind {
  switch (kind) {
    case 'primitive type':
    case 'keyword':
      return CompletionItemKind.Keyword;
    case 'var':
    case 'local var':
      return CompletionItemKind.Variable;
    case 'property':
    case 'getter':
    case 'setter':
      return CompletionItemKind.Field;
    case 'function':
    case 'method':
    case 'construct':
    case 'call':
    case 'index':
      return CompletionItemKind.Function;
    case 'enum':
      return CompletionItemKind.Enum;
    case 'module':
      return CompletionItemKind.Module;
    case 'class':
      return CompletionItemKind.Class;
    case 'interface':
      return CompletionItemKind.Interface;
    default:
    return CompletionItemKind.Snippet;
  }
}
