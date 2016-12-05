import { TextDocumentPositionParams, CompletionItem, CompletionItemKind, SnippetString } from 'vscode-languageserver';

import AttributeCompletionFactory from './Completions/AttributeCompletionFactory';
import AttributeValueCompletionFactory from './Completions/Attributes/AttributeValueCompletionFactory';

export default class CompletionItemFactory {
  
  private static elementMatch = /<([a-zA-Z-]*)\s([^<]*)$/;
  private static attributeMatch = /([a-zA-Z-]*)\.?([a-zA-Z-]*)?=['"]$/;

  public static create(triggerCharacter: string, text: string, position: number, completionsFromSource: Array<any>, uri: string): Array<CompletionItem> {
    switch(triggerCharacter) {
      case ' ':
        return this.createAttributeCompletion(text, position);
      case '<':
        return this.createElementCompletion(text, position);
      case '[':
        return this.createEmmetCompletion(text, position);
      case '.':
        return this.createBindingCompletion(text, position);
      case '"':
      case '\'':
        return this.createValueCompletion(text, position, completionsFromSource, uri);
    }
  }

  private static createAttributeCompletion(text: string, position: number): Array<CompletionItem> {  
    let nextCharacter = text.substring(position, position + 1);
    if (nextCharacter === '>' || /\s/.test(nextCharacter)) {
      let elementMatch = CompletionItemFactory.elementMatch.exec(text.substring(0, position));
      if (elementMatch !== null && elementMatch.length) {
        let elementName = elementMatch[1];
        return AttributeCompletionFactory.create(elementName);
      }
    }

    return null;
  }

  private static createValueCompletion(text: string, position: number, completionsFromSource, uri): Array<CompletionItem> {
    let nextCharacter = text.substring(position, position + 1);
    if (/['"]/.test(nextCharacter)) {
      
      let postText = text.substring(0, position);
      let elementMatch = CompletionItemFactory.elementMatch.exec(postText);
      let attributeMatch = CompletionItemFactory.attributeMatch.exec(postText);
      if (elementMatch !== null && elementMatch.length) {
        let elementName = elementMatch[1];
        let attributeName = attributeMatch[1];
        let bindingName = attributeMatch[2];
        if (bindingName) {
          let sourceUri = uri.replace(".html",".ts");
          for (let completion of completionsFromSource) {
            if (completion.uri === sourceUri) {
              let result = [];
              for(let propCollection of completion.properties) {
                for (let prop of propCollection) {
                  result.push({
                      kind: CompletionItemKind.Value,
                      label: prop,
                      insertText: SnippetString.create(prop)
                  });
                }
              }
              return result;
            }
          }
        }

        return AttributeValueCompletionFactory.create(elementName, attributeName, bindingName);
      }
    }

    return null;    
  }

  private static createElementCompletion(text: string, position: number) {
    return null;
  }

  private static createEmmetCompletion(text: string, position: number) {
    return null;
  }

  private static createBindingCompletion(text: string, position: number) {
    return null;
  }
}
