import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem } from 'vscode-languageserver';
import { HTMLDocumentParser, TagDefinition } from '../FileParser/Parsers/HTMLDocumentParser';
import { CompletionType, CompletionTypeDetection } from './CompletionTypeDetection';
import ElementCompletion from './HtmlCompletions/ElementCompletion';

@autoinject()
export class HtmlComplete {

  constructor(
    private htmlDocumentParser: HTMLDocumentParser,
    private elementCompletion: ElementCompletion) { }

  public async getCompletionItems(
    triggerCharacter: string,
    text: string,
    positionNumber: number): Promise<CompletionItem[]> {
      const nodes = await this.htmlDocumentParser.parse(text);
      const completionTypeDetection = new CompletionTypeDetection(text, nodes);

      switch (completionTypeDetection.getCompletionType(triggerCharacter, positionNumber)) {
        case CompletionType.Attribute:
          return Promise.resolve([]);
        case CompletionType.AttributeBinding:
          return Promise.resolve([]);
        case CompletionType.AttributeValue:
          return Promise.resolve([]);
        case CompletionType.Element:
          return this.elementCompletion.create(this.getLastOpenNode(nodes));
        case CompletionType.Emmet:
          return Promise.resolve([]);
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
}
