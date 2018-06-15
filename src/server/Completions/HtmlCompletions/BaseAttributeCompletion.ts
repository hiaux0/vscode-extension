import { autoinject } from 'aurelia-dependency-injection';
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
  MarkupKind} from 'vscode-languageserver';
import ElementLibrary from './../Library/_elementLibrary';
import { BaseElement } from './../Library/ElementStructure/BaseElement';
import { BindableAttribute } from './../Library/ElementStructure/BindableAttribute';
import { EmptyAttribute } from './../Library/ElementStructure/EmptyAttribute';
import { SimpleAttribute } from './../Library/ElementStructure/SimpleAttribute';

@autoinject()
export default class BaseAttributeCompletion {

  constructor(protected library: ElementLibrary) { }

  protected getElement(elementName: string): BaseElement {
    let element = this.library.elements[elementName];
    if (!element) {
      element = this.library.unknownElement;
    }
    return element;
  }

  protected addAttributes(attributes, result: CompletionItem[], existingAttributes, quote: string) {

    for (const [key, value] of attributes.entries()) {
      if (existingAttributes.filter((i) => i === key).length || value === null) {
        continue;
      }

      // remove duplicates (only leave latest addition)
      for (const item of result.filter((i) =>
        i.label === key ||
        i.label === (value.customLabel === null ? (key + '.bind') : value.customLabel))) {
        const index = result.indexOf(item, 0);
        if (index > -1) {
          result.splice(index, 1);
        }
      }

      if (value instanceof BindableAttribute) {
        result.push({
          detail: 'Bindable Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: value.documentation,
          } as MarkupContent,
          insertText: value.customBindingSnippet === null ? `${key}.bind=${quote}$0${quote}` : value.customBindingSnippet.replace('"', quote),
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: value.customLabel === null ? (key + '.bind') : value.customLabel,
        });
      }

      if (value instanceof EmptyAttribute) {
        result.push({
          detail: 'Empty Custom Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: value.documentation,
          } as MarkupContent,
          insertText: `${key}`,
          insertTextFormat: InsertTextFormat.PlainText,
          kind: CompletionItemKind.Property,
          label: key,
        });
      }

      if (value instanceof SimpleAttribute || value instanceof BindableAttribute) {
        result.push({
          detail: 'Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: value.documentation,
          } as MarkupContent,
          insertText: `${key}=${quote}$0${quote}`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Property,
          label: key,
        });
      }
    }
    return result;
  }

  protected addEvents(events, result, existingAttributes, quote: string) {

    for (const [key, value] of events.entries()) {

      if (existingAttributes.filter((i) => i === key).length || value === null) {
        continue;
      }

      // remove exiting items that are doubles
      for (const item of result.filter((i) =>
        i.label === key ||
        i.label === key + (value.bubbles ? `.delegate` : `.trigger`))) {
        const index = result.indexOf(item, 0);
        if (index > -1) {
          result.splice(index, 1);
        }
      }

      result.push({
        detail: 'Event',
        documentation: {
          kind: MarkupKind.Markdown,
          value: value.documentation,
        } as MarkupContent,
        insertText: value.bubbles ? `${key}.delegate=${quote}$0${quote}` : `${key}.trigger=${quote}$0${quote}`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Function,
        label: key + (value.bubbles ? `.delegate` : `.trigger`),
      });
    }

    return result;
  }
}
