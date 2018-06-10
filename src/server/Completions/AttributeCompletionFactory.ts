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
export default class AureliaAttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(elementName: string, existingAttributes: string[]): CompletionItem[] {

    const result: CompletionItem[] = [];
    const element = this.getElement(elementName);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.attributes) {
      this.addAttributes(element.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, existingAttributes, this.settings.quote);
    }

    if (element.events) {
      this.addEvents(element.events, result, existingAttributes, this.settings.quote);
    }

    return result;
  }
}
