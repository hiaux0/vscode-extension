import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem } from 'vscode-languageserver';
import AureliaSettings from './../../AureliaSettings';
import ElementLibrary from './../Library/_elementLibrary';
import { GlobalAttributes } from './../Library/ElementStructure/GlobalAttributes';
import BaseAttributeCompletionFactory from './BaseAttributeCompletion';

@autoinject()
export default class EmmetCompletion extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(elementName: string): CompletionItem[] {
    const result: CompletionItem[] = [];
    const element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, [], this.settings.quote, element);
    }
    if (element.attributes) {
      this.addAttributes(element.attributes, result, [], this.settings.quote, element);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, [], this.settings.quote, element);
    }
    if (element.events) {
      this.addEvents(element.events, result, [], this.settings.quote, element);
    }

    return result;
  }
}
