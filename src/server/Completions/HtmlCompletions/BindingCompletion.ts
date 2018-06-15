import { autoinject } from 'aurelia-dependency-injection';
import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupContent, MarkupKind } from 'vscode-languageserver';
import { AttributeDefinition, TagDefinition } from '../../FileParser/Parsers/HTMLDocumentParser';
import AureliaSettings from './../../AureliaSettings';
import ElementLibrary from './../Library/_elementLibrary';
import { GlobalAttributes } from './../Library/ElementStructure/GlobalAttributes';
import BaseAttributeCompletionFactory from './BaseAttributeCompletion';

@autoinject()
export default class BindingCompletion extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private settings: AureliaSettings) { super(library); }

  public create(tagDef: TagDefinition, attributeDef: AttributeDefinition, nextChar: string): CompletionItem[] {

    const snippetPrefix = nextChar === '=' ? '' : `=${this.settings.quote}$0${this.settings.quote}`;
    const result: CompletionItem[] = [];

    const element = this.getElement(tagDef.name);
    if (!element.events.get(attributeDef.name) && !GlobalAttributes.events.get(attributeDef.name)) {
      this.setAttributes(element.attributes, attributeDef.name, snippetPrefix, result);
    }

    this.setEvents(element.events, attributeDef.name, snippetPrefix, result);

    return result;
  }

  private setEvents(events, name, snippetPrefix, result) {
      let event = events.get(name);
      if (!event) {
        event = GlobalAttributes.events.get(name);
      }

      if (event) {
        if (event.bubbles) {
          for (const binding of ['delegate', 'capture']) {
            result.push({
              documentation: {
                kind: MarkupKind.Markdown,
                value: binding,
              } as MarkupContent,
              insertText: binding + snippetPrefix,
              insertTextFormat: InsertTextFormat.Snippet,
              kind: CompletionItemKind.Property,
              label: `.${binding}=${this.settings.quote}${this.settings.quote}`,
            });
          }
        }

        for (const binding of ['trigger', 'call']) {
          result.push({
            documentation: {
              kind: MarkupKind.Markdown,
              value: binding,
            } as MarkupContent,
            insertText: binding + snippetPrefix,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: `.${binding}=${this.settings.quote}${this.settings.quote}`,
          });
        }
      }
  }

  private setAttributes(attributes, name, snippetPrefix, result) {
      let attribute = attributes.get(name);
      if (!attribute) {
        attribute = GlobalAttributes.attributes.get(name);
      }

      for (const binding of this.settings.bindings.data) {
        result.push({
          documentation: {
            kind: MarkupKind.Markdown,
            value: binding,
          } as MarkupContent,
          insertText: `${binding.name}${snippetPrefix}`,
          insertTextFormat: InsertTextFormat.Snippet,
          kind: CompletionItemKind.Property,
          label: binding.label ? (binding.label as string).replace(/'/g, this.settings.quote) : `.${binding.name}=${this.settings.quote}${this.settings.quote}`,
        });
      }
  }
}
