import { AST, MarkupData, SAXParser } from 'parse5';
import { Readable } from 'stream';
import { Location } from 'vscode-languageserver/lib/main';
import { AttributeDefinition } from './AttributeDefinition';
import { TagDefinition } from './TagDefinition';

export class HTMLDocumentParser {

  public parse(text: string): Promise<TagDefinition[]> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      const stack: TagDefinition[] = [];

      const parser = new SAXParser({ locationInfo: true });
      parser.on('startTag', (name, attrs, selfClosing, location) => {
        stack.push(new TagDefinition(
          true,
          name,
          location.startOffset,
          location.endOffset,
          selfClosing,
          attrs.map((i) => new AttributeDefinition(i.name, i.value, location.attrs[i.name]))));
      });
      parser.on('endTag', (name, location) => {
        stack.push(new TagDefinition(
          false,
          name,
          location.startOffset,
          location.endOffset));
      });

      stream.on('end', (x) => {
        resolve(stack);
      });
      stream.pipe(parser);

    });
  }

  public getElementAtPosition(text: string, start: number, end: number): Promise<TagDefinition> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      let tagDefinition: TagDefinition;

      const parser = new SAXParser({ locationInfo: true });
      parser.on('startTag', (name, attrs, selfClosing, location) => {

         if (location.startOffset <= start && location.endOffset >= end) {
          tagDefinition = new TagDefinition(
            true,
            name,
            location.startOffset,
            location.endOffset,
            selfClosing,
            attrs.map((i) => new AttributeDefinition(i.name, i.value, location.attrs[i.name])));
         }
      });

      stream.on('end', (x) => {
        resolve(tagDefinition);
      });
      stream.pipe(parser);
    });
  }
}

export { TagDefinition, AttributeDefinition };
