import {TagDefinition} from './../HTMLDocumentParser';
import {TemplateReference} from './TemplateReference';

export class HtmlTemplateDocument {
  public bindables: string[] = [];
  public dynamicBindables: any[] = [];
  public interpolationBindings: any[] = [];
  public tags: TagDefinition[] = [];
  public references: TemplateReference[] = [];

  public path: string;
  public name: string;

}
