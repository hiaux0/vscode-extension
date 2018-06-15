import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem } from 'vscode-languageserver';
import { AttributeDefinition, HTMLDocumentParser, TagDefinition } from '../FileParser/Parsers/HTMLDocumentParser';
import { CompletionType, CompletionTypeDetection } from './CompletionTypeDetection';
import AttributeCompletion from './HtmlCompletions/AttributeCompletion';
import AttributeValueCompletion from './HtmlCompletions/AttributeValueCompletion';
import BindingCompletion from './HtmlCompletions/BindingCompletion';
import ElementCompletion from './HtmlCompletions/ElementCompletion';
import EmmetCompletion from './HtmlCompletions/EmmetCompletion';

@autoinject()
export class HtmlComplete {

  constructor(
    private htmlDocumentParser: HTMLDocumentParser,
    private attributeCompletion: AttributeCompletion,
    private attributeValueCompletion: AttributeValueCompletion,
    private bindingCompletion: BindingCompletion,
    private emmetCompletion: EmmetCompletion,
    private elementCompletion: ElementCompletion) { }

  public async getCompletionItems(
    triggerCharacter: string,
    text: string,
    positionNumber: number): Promise<CompletionItem[]> {

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
          return this.createDefaultAttributeValueCompletion(lastNode, positionNumber);
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

    private createDefaultAttributeValueCompletion(lastNode: TagDefinition, positionNumber: number) {

      let attribute: AttributeDefinition;
      for (const node of lastNode.attributes) {
        if (node.startOffset <= positionNumber && positionNumber <= node.endOffset) {
          attribute = node;
          break;
        }
      }

      // TypeScript attribute value completion
      if (attribute.binding) {
        return Promise.resolve([]);
      }

      // Default attribute value completion
      return this.attributeValueCompletion.create(lastNode.name, attribute.name);
    }
}
