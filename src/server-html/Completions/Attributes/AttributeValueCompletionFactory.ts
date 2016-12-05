import { CompletionItem  } from 'vscode-languageserver-types';
import typeValues from './Input/TypeValues';

export default class AureliaAttributeCompletionFactory {

  public static create(elementName: string, attributeName: string, bindingName: string): Array<CompletionItem> {
    
    if (bindingName) {
      console.log('binding');
    }
    
    switch(elementName) {
      case 'input':
      return this.createInputAttributes(attributeName);
    }
  }
  
  private static createInputAttributes(attributeName: string) {
    switch(attributeName) {
      case 'type':
      return typeValues();
    }
  }
}
