import { TagDefinition } from '../FileParser/Parsers/HTMLDocumentParser';

export class CompletionTypeDetection {

  constructor(private text: string, private nodes: TagDefinition[]) { }

  public getCompletionType(
    triggerCharacter: string,
    positionNumber: number): CompletionType {

      let insideTag: TagDefinition = null;
      for (const node of this.nodes) {
        if (!insideTag && positionNumber >= node.startOffset && positionNumber <= node.endOffset) {
          insideTag = node;
          break;
        }
      }

      if (!insideTag) {

        switch (triggerCharacter) {
          case '[':
            return CompletionType.Emmet;
          case '<':
            return CompletionType.Element;
        }

        // Unable to detect completion type
        return CompletionType.None;
      }

      const elementString = this.text.substring(insideTag.startOffset, positionNumber);
      if (this.notInAttributeValue(elementString)) {

        if (triggerCharacter === ' ') {
          return CompletionType.Attribute;
        } else if (triggerCharacter === '.' && this.canExpandDot(elementString)) {
          return CompletionType.AttributeBinding;
        } else {
          return CompletionType.None;
        }

      // inside attribute, perform attribute completion
      } else if (triggerCharacter === '"' || triggerCharacter === '\'' || triggerCharacter === '.') {
        return CompletionType.AttributeValue;
      } else {
        return CompletionType.None;
      }
  }

  private notInAttributeValue(tagText: string) {
    let single = 0;
    let double = 0;
    for (const char of tagText) {
      if (char === '"') { double += 1; }
      if (char === '\'') { single += 1; }
    }
    return single % 2 === 0 && double % 2 === 0;
  }

  private canExpandDot(elementString) {
    return /( [a-zA-Z-]*)\.$/g.test(elementString);
  }
}

export enum CompletionType {
  None = 0,
  Element = 1,
  Attribute = 2,
  AttributeValue = 3,
  AttributeBinding = 4,
  Emmet = 5,
}
