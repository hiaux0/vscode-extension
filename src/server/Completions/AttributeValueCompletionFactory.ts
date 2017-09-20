import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import {AureliaApplication} from './../FileParser/Model/AureliaApplication';
import * as Path from 'path';
import {fileUriToPath} from './../Util/FileUriToPath';

@autoinject()
export default class AttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(library: ElementLibrary, private application: AureliaApplication) { super(library); }

  public create(elementName: string, attributeName: string, bindingName: string, uri: string): Array<CompletionItem> {

    let result:Array<CompletionItem> = [];
    if (bindingName === undefined || bindingName === null || bindingName === '') {
      let element = this.getElement(elementName);

      let attribute = element.attributes.get(attributeName);
      if (!attribute) {
        attribute = GlobalAttributes.attributes.get(attributeName);
      }

      if (attribute && attribute.values) {
        for (let [key, value] of attribute.values.entries()) {
          result.push({
              documentation: value.documentation,
              insertText: key,
              insertTextFormat: InsertTextFormat.Snippet,
              kind: CompletionItemKind.Property,
              label: key,
            });
        }
      }
    }

    let newUri = fileUriToPath(uri).toLowerCase();      
    const compoment = this.application.components.find(i => i.paths.map(x => {
      let v = x.toLowerCase();
      return v;
    }).indexOf(newUri) > -1);
    if (compoment) {
      if (compoment.viewModel) {
        compoment.viewModel.methods.forEach(x => {

          let inner = '';
          for(let i=0; i < x.parameters.length;i++) {
            inner += `\$${i+1},`;
          }
          if (x.parameters.length) {
            inner = inner.substring(0, inner.length-1);
          }

          result.push({
            documentation: x.name,
            insertText: `${x.name}(${inner})$0`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Method,
            label: x.name,
          });
      });
        // if (compoment.document) {
        //   compoment.document.bindables.map(i => i).forEach(x => result.push({
        //     documentation: x,
        //     insertText: x,
        //     insertTextFormat: InsertTextFormat.Snippet,
        //     kind: CompletionItemKind.Property,
        //     label: x,
        //   }));
        // }

        compoment.viewModel.properties.forEach(x => {
          let documentation = x.name;
          if (x.type) {
            documentation += ` (${x.type})`;
          }

          result.push({
            documentation: documentation,
            insertText: x.name,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: x.name,
          })
        });          
      }
    }

    return result;
  }
}
