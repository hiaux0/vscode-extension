import { autoinject } from 'aurelia-dependency-injection';
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
  MarkupKind} from 'vscode-languageserver';
import { BindableAureliaAttribute } from '../Library/ElementStructure/BindableAureliaAttribute';
import { EmptyAureliaAttribute } from '../Library/ElementStructure/EmptyAureliaAttribute';
import { MozDocElement } from '../Library/ElementStructure/MozDocElement';
import { SimpleAureliaAttribute } from '../Library/ElementStructure/SimpleAureliaAttribute';
import ElementLibrary from './../Library/_elementLibrary';
import { BaseElement } from './../Library/ElementStructure/BaseElement';
import { BindableAttribute } from './../Library/ElementStructure/BindableAttribute';
import { EmptyAttribute } from './../Library/ElementStructure/EmptyAttribute';

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

  protected addAttributes(attributes, result: CompletionItem[], existingAttributes, quote: string, element: BaseElement) {

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
        let doc = 'Data bind to the given attribute \n\n---\n\n' + value.documentation;
        if (element instanceof MozDocElement) {
          if (value.url) {
            doc += `\n\nmore information: ${value.url}`;
          }
          doc += '\n\n---\n\n' + element.licenceText;
        }

        result.push({
          detail: 'Bindable Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
          } as MarkupContent,
          insertText: value.customBindingSnippet === null ? `${key}.bind=${quote}$0${quote}` : value.customBindingSnippet.replace('"', quote),
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: value.customLabel === null ? (key + '.bind') : value.customLabel,
        });
      }

      if (value instanceof BindableAureliaAttribute) {
        let doc = 'Data bind to the given attribute \n\n---\n\n' + value.documentation;
        if (value) {
          if (value.url) {
            doc += `\n\nmore information: ${value.url}`;
          }
        }

        result.push({
          detail: 'Bindable Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
          } as MarkupContent,
          insertText: value.customBindingSnippet === null ? `${key}.bind=${quote}$0${quote}` : value.customBindingSnippet.replace('"', quote),
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Value,
          label: value.customLabel === null ? (key + '.bind') : value.customLabel,
        });
      }

      if (value instanceof EmptyAttribute) {
        let doc = value.documentation;
        if (element instanceof MozDocElement) {
          if (value.url) {
            doc += `\n\nmore information: ${value.url}`;
          }
          doc += '\n\n---\n\n' + element.licenceText;
        }

        result.push({
          detail: 'Empty Custom Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
          } as MarkupContent,
          insertText: `${key}`,
          insertTextFormat: InsertTextFormat.PlainText,
          kind: CompletionItemKind.Property,
          label: key,
        });
      }

      if (value instanceof EmptyAureliaAttribute) {
        let doc = value.documentation;
        if (value.url) {
          doc += `\n\nmore information: ${value.url}`;
        }

        result.push({
          detail: 'Empty Custom Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
          } as MarkupContent,
          insertText: `${key}`,
          insertTextFormat: InsertTextFormat.PlainText,
          kind: CompletionItemKind.Property,
          label: key,
        });
      }

      if (value instanceof SimpleAureliaAttribute) {

        let doc = value.documentation;
        if (value.url) {
          doc += `\n\nmore information: ${value.url}`;
        }

        result.push({
          detail: 'Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
          } as MarkupContent,
          insertText: `${key}=${quote}$0${quote}`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Property,
          label: key,
        });
      }

      if (value instanceof SimpleAureliaAttribute || value instanceof BindableAttribute) {

        let doc = value.documentation;
        if (element instanceof MozDocElement) {
          if (value.url) {
            doc += `\n\nmore information: ${value.url}`;
          }
          doc += '\n\n---\n\n' + element.licenceText;
        }

        result.push({
          detail: 'Attribute',
          documentation: {
            kind: MarkupKind.Markdown,
            value: doc,
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

  protected addEvents(events, result, existingAttributes, quote: string, element: BaseElement) {

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

      let doc = value.documentation;
      if (element instanceof MozDocElement) {
        if (value.url) {
          doc += `\n\nmore information: ${value.url}`;
        }
        doc += '\n\n---\n\n' + element.licenceText;
      }

      result.push({
        detail: 'Event',
        documentation: {
          kind: MarkupKind.Markdown,
          value: doc,
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
