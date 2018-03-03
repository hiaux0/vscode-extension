import { Diagnostic, DiagnosticSeverity, Range, TextDocument } from 'vscode-languageserver-types';
import {AttributeDefinition, TagDefinition } from './../../FileParser/HTMLDocumentParser';

export class IfBindingConflictingAttributesValidation {
  
  public match(attribute: AttributeDefinition, element: TagDefinition) {
    return attribute.binding && attribute.name === "if" && 
    element.attributes.find(i => 
      i.name === 'repeat' && i.binding === 'for' ||
      i.name === 'with' && i.binding !== undefined
    ) !== undefined;
  }

  public diagnostic(attribute: AttributeDefinition, element: TagDefinition, document: TextDocument) {   
    const attributeStartOffset = attribute.startOffset;
    const attributeEndOffset = attributeStartOffset + attribute.name.length;

    const causedAttribute = element.attributes.find(i => 
      i.name === 'repeat' && i.binding === 'for' ||
      i.name === 'with' && i.binding !== undefined
    );
    
    return <Diagnostic> {
      message: `if attribute cannot be used together with ${causedAttribute.name}.${causedAttribute.binding} on the same element, use show`,
      range: Range.create(document.positionAt(attributeStartOffset), document.positionAt(attributeEndOffset)),
      severity: DiagnosticSeverity.Error,
      source: 'Aurelia',
      code: 'aurelia-repeat-with-if-binding'
    };
  }
}
