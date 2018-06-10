import * as Path from 'path';
import { ParsedFile } from './ParsedFile';
import { AureliaFileParser } from './Parsers/AureliaFileParser';
import { AureliaHtmlFileParser } from './Parsers/AureliaHtmlFileParser';
import { UnknownFile } from './UnknownFile';

// tslint:disable-next-line:interface-name
export interface IFileParser {
  parse(path: string, content?: string): Promise<ParsedFile>;
}

export default class FileParser {

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
