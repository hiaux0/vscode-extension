import * as Path from 'path';
import { ParsedFile } from './Model/Files/ParsedFile';
import { UnknownFile } from './Model/Files/UnknownFile';
import { AureliaFileParser } from './Parsers/AureliaFileParser';
import { AureliaHtmlFileParser } from './Parsers/AureliaHtmlFileParser';

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
