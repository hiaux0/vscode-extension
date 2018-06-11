import SAXParser, { EndTagToken, StartTagToken } from 'parse5-sax-parser';
import { Readable } from 'stream';
import { AttributeDefinition } from './../Model/Html/AttributeDefinition';
import { TagDefinition } from './../Model/Html/TagDefinition';

export class HTMLDocumentParser {

  public parse(text: string): Promise<TagDefinition[]> {

    text = this.fixUpText(text);

    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      const stack: TagDefinition[] = [];

      const rSAXParser = require('parse5-sax-parser');
      const parser = new rSAXParser({ sourceCodeLocationInfo: true }) as SAXParser;

      parser.on('startTag', (startTag: StartTagToken) => {
        stack.push(new TagDefinition(
          true,
          startTag.tagName,
          startTag.sourceCodeLocation.startOffset,
          startTag.sourceCodeLocation.endOffset,
          startTag.selfClosing,
          startTag.attrs.map((i) => new AttributeDefinition(i.name, i.value, startTag.sourceCodeLocation.attrs[i.name]))));
      });
      parser.on('endTag', (endTag: EndTagToken) => {
        stack.push(new TagDefinition(
          false,
          endTag.tagName,
          endTag.sourceCodeLocation.startOffset,
          endTag.sourceCodeLocation.endOffset));
      });

      stream.on('end', () => resolve(stack));
      stream.on('error', (err) => reject(err));
      stream.pipe(parser);
    });
  }

  public getElementAtPosition(text: string, start: number, end: number): Promise<TagDefinition> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(text);
      stream.push(null);

      let tagDefinition: TagDefinition;

      const parser = new SAXParser({ sourceCodeLocationInfo: true });
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

  private fixUpText(text: string) {
    let single = 0;
    let double = 0;
    for (const char of text) {
      if (char === '"') { double += 1; }
      if (char === '\'') { single += 1; }
    }
    if (single % 2 > 0) {
      text += `'`;
    }
    if (double % 2 > 0) {
      text += `"`;
    }
    return text + '>';
  }
}

export { TagDefinition, AttributeDefinition };
