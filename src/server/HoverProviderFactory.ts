import { Hover } from 'vscode-languageserver-types';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Completions/Library/_elementLibrary';
import { GlobalAttributes, BaseElement, MozDocElement, AureliaElement, BaseAttribute } from './Completions/Library/_elementStructure';
import { DocumentParser, TagDefinition, AttributeDefinition } from './DocumentParser';

@autoinject()
export default class HoverProviderFactory {

  constructor(
    private elementLibrary: ElementLibrary,
    private parser: DocumentParser) { }

  public async create(text: string, offset: number): Promise<Hover> {

    let nodes = await this.parser.parse(text);

    let displayValue = '<';
    let documentation = '';
    let source = undefined;
    let moreInfo = undefined;

    for(let node of nodes) {

      if(node.startOffset <= offset && node.endOffset >= offset) {
        
        let element = <BaseElement> this.elementLibrary.elements[node.name];
        let textUnderCursor = this.getTextUnderCursor(text, offset, node);
        if (!textUnderCursor) {
          break;
        }

        displayValue += node.name;
        
        // hover on element
        if (textUnderCursor === node.name) {
          displayValue += '>';

          if (element === undefined) {
            return undefined;
          }

          if (element instanceof MozDocElement) {
            documentation = element.documentation.replace(/\s\s+/g, ' ');
            source = element.licenceText;
            moreInfo = 'more info: ' + element.url;
          }

          if (element instanceof AureliaElement) {
            documentation = element.documentation.replace(/\s\s+/g, ' ');
            moreInfo = 'more info: ' + element.url;
            source = undefined;
          }

          break;
        }

        displayValue += ' ' + textUnderCursor + '="">';
        let attribute = element.attributes.get(textUnderCursor);
        if (!attribute) {
          attribute = GlobalAttributes.attributes.get(textUnderCursor);
        }
        if (attribute) {
          documentation = attribute.documentation.replace(/\s\s+/g, ' ');
          if (attribute instanceof BaseAttribute) {
            source = attribute.url;
            if (attribute.url) {
              moreInfo = 'more info: ' +  attribute.url;
            }
          }
        }

        break;
      }
    }

    return {
      contents: [ 
        { language: 'aurelia-html', value: displayValue }, 
        { language: 'markdown', value: documentation }, 
        moreInfo,
        source
      ]
    }
  }

  private getTextUnderCursor(text, offset, node) {
    let textUnderCursor = '';

    let startString = text.substring(node.startOffset, offset);
    let startMatches = /\b[\w|\.|-]*$/gm.exec(startString);
    if (startMatches) {
      textUnderCursor += startMatches[0];
    }

    let endString = text.substring(offset, node.endOffset);
    let endMatches = /^\b[\w|\.|-]*/gm.exec(endString);
    if (endMatches) {
      textUnderCursor += endMatches[0];
    }

    return textUnderCursor;
  }
}


 // let leadingCharacter = '', appixCharacter = '';
    
    // let backPos = offset;
    // while(true) {
    //   let char = text[backPos];
    //   if (char === ' ' || char === '/' || char === '<' || char === undefined) {
    //     leadingCharacter = char;
    //     backPos = backPos + 1;
    //     break;
    //   }
    //   backPos = backPos - 1;
    // }

    // let nextPos = offset;
    // while(true) {
    //   let char = text[nextPos];
    //   if (char === ' ' || char === '/' || char === '>' || char === '=' || char === undefined) {
    //     appixCharacter = char;
    //     break;
    //   }
    //   nextPos = nextPos + 1;
    // }

    // let tag = text.substring(backPos, nextPos);
    // let displayValue = '';
    // let documentation = '';
    // let source = '';
    // let moreInfo = '';
    // let element;
    // switch(leadingCharacter) {
    //   case '<':
    //     element = this.elementLibrary.elements[tag] || this.elementLibrary.unknownElement;
    //     if (element) {
    //       documentation = element.documentation;
    //       moreInfo = `more information: ${element.url}`;
    //       displayValue = `<${tag}>`;
    //     }
    //   break;
    //   case '/':
    //     element = this.elementLibrary.elements[tag];
    //     if (element) {
    //       documentation = element.documentation;
    //       moreInfo = `more information: ${element.url}`;    
    //       displayValue = `</${tag}>`;
    //     }
    //   break;
    //   case ' ':
    //     let matches = /<(\w*)\b.*$/g.exec(text.substring(0, offset));
    //     if (!matches || matches.length === 0) {
    //       return;
    //     }
    //     let elementName = matches[1];
    //     displayValue = `<${elementName} ${tag}="">`;
        
    //     // fixes
    //     if (tag.startsWith('data-')) {
    //       tag = 'data-*';
    //     }
    //     if (tag.indexOf('.')) {
    //       tag = tag.split('.')[0];
    //     }
       
    //     element = this.elementLibrary.elements[elementName] || this.elementLibrary.unknownElement;
    //     let attribute = element.attributes.get(tag);
    //     let event = element.events.get(tag);
    //     if (attribute) {
    //       documentation = attribute.documentation;
    //       moreInfo = attribute.url || element.url;
    //     }
    //     if (event) {
    //       documentation = event.documentation;
    //       moreInfo = event.url;
    //       source =  `MDN by Mozilla Contributors (${event.url}$history) is licensed under CC-BY-SA 2.5.`;
    //     }      
    // }

    // documentation = documentation.replace(/\s\s+/g, ' ');

    // if (documentation == '') {
    //   return undefined;
    // }

    // if (element instanceof MozDocElement) {
    //   source = element.licenceText;
    // } 

    // return {
    //   contents: [ 
    //     { language: 'aurelia-html', value: displayValue }, 
    //     { language: 'markdown', value: documentation }, 
    //     moreInfo,
    //     source
    //   ]
    // }
