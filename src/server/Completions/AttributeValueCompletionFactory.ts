import { 
  CompletionItem, 
  CompletionItemKind, 
  InsertTextFormat } from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import {AureliaApplication} from './../FileParser/Model/AureliaApplication';
import AureliaSettings from '../AureliaSettings';
import { settings } from 'cluster';
import { fileUriToPath } from './../Util/FileUriToPath';
import { normalizePath } from './../Util/NormalizePath';
import { getLanguageService } from '../FileParser/AureliaLanguageServiceHost';
import { Workspace } from '../Workspace';
import { defaultCipherList } from 'constants';
import { AuFile, HtmlFile } from '../FileParser/FileParser';
import { StringLiteralType, SyntaxKind } from 'typescript';

@autoinject()
export default class AttributeCompletionFactory extends BaseAttributeCompletionFactory {

  constructor(
    library: ElementLibrary, 
    private application: AureliaApplication,
    private settings: AureliaSettings,
    private workSpace: Workspace) { super(library); }

  public create(elementName: string, attributeName: string, bindingName: string, uri: string, position: number, value: string): Array<CompletionItem> {

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

    if (this.settings.featureToggles.smartAutocomplete) {
      
      const file = this.workSpace.files.get(uri);
      let position = 0;
      if (file instanceof AuFile) {
        console.log('au file');
        const auFile = file as AuFile;
        const fileLength = auFile.typescriptBlocks[0].length;
        position += fileLength + auFile.typescriptBlocks[0].className.length + value.length;        
      } else if (file instanceof HtmlFile) {
        console.log('html file');
        const htmlFile = file as HtmlFile;
        const fileLength = htmlFile.code.length;
        position += fileLength + htmlFile.className.length + value.length;
      }

      const service = getLanguageService(this.workSpace.path, this.workSpace.files, value);

      const completions = service.getCompletionsAtPosition(
        uri,
        position,
        {
          includeExternalModuleExports: false,
          includeInsertTextCompletions: false
        }
      );

      if (completions.isMemberCompletion) {
        result.push(...completions.entries.map(item => {

          const eventBindingCommands = ['delegate', 'trigger', 'call'];
          const itemKind = toKind(item.kind);

          if (eventBindingCommands.some(i => i === bindingName)) {
            if (itemKind === CompletionItemKind.Method) {
              return {
                documentation: undefined,
                insertText: item.name + '()',
                insertTextFormat: InsertTextFormat.Snippet,
                kind: itemKind,
                label: item.name,
              }
            } else {
              return undefined;
            }
          } else {
            return {
              documentation: undefined,
              insertText: item.name + (itemKind === CompletionItemKind.Method ? '()': ''),
              insertTextFormat: InsertTextFormat.Snippet,
              kind: itemKind,
              label: item.name,
            }            
          }
        }));
      }
    }

    return result.filter(i => i !== undefined);
  }
}

function toKind(kind: string) {
  switch(kind) {
    case "method":
      return CompletionItemKind.Method;
    case "property":
      return CompletionItemKind.Property;
    default:
      return CompletionItemKind.Text;
  }
}

function includeCodeAutoComplete(application, result, path) {
  path = path.toLowerCase();
  const compoment = application.components.find(i => i.paths.map(x => x.toLowerCase()).indexOf(path) > -1);

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
}
