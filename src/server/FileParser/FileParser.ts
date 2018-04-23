import * as Path from 'path';
import { AureliaFileParser } from './Parsers/AureliaFileParser';
import { AureliaHtmlFileParser } from './Parsers/AureliaHtmlFileParser';

export interface IFileParser {
  parse(path: string, content?: string): Promise<ParsedFile>;
}

export default class FileParser implements IFileParser {

  public async parse(path: string, content: string): Promise<ParsedFile> {

    switch (Path.extname(path)) {
      case '.ts':
        break;
      case '.html':
        return await new AureliaHtmlFileParser().parse(path, content);
      case '.au':
        return await new AureliaFileParser().parse(path, content);
    }

    return new UnknownFile();

  }

}

export abstract class ParsedFile {
  public fileName: string;

  public abstract type;
}

export class AuFile extends ParsedFile {

  public type = 'aurelia file';
  public singleFileComponent = false;

  public javascriptBlocks = [];
  public typescriptBlocks = [];
  
  public templateBindings = [];
  public stringInterpolation = [];
  public commands = [];

  public imports = [];
}

export class HtmlFile extends ParsedFile {
  public type = 'html file';
  
  public code: string;
  public className: string;
}

export class ScriptFile extends ParsedFile {
  public type = 'script file';
  public classes = [];
}

export class UnknownFile extends ParsedFile {
  public type = 'unknown file';
}