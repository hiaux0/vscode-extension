import { autoinject } from 'aurelia-dependency-injection';
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkedString } from 'vscode-languageserver';
import AureliaSettings from './../AureliaSettings';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/ElementStructure/GlobalAttributes';

@autoinject()
export default class EmmetCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(elementName: string): CompletionItem[] {
    const result: CompletionItem[] = [];
    const element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, [], this.settings.quote);
    }
    if (element.attributes) {
      this.addAttributes(element.attributes, result, [], this.settings.quote);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, [], this.settings.quote);
    }
    if (element.events) {
      this.addEvents(element.events, result, [], this.settings.quote);
    }

    return result;
  }
}
