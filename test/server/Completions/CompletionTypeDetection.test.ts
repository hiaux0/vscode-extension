import { assert } from 'chai';
import { CompletionType, CompletionTypeDetection } from '../../../src/server/Completions/CompletionTypeDetection';
import { TagDefinition } from '../../../src/server/FileParser/Parsers/HTMLDocumentParser';

describe('getCompletionType', () => {

  it(`must return CompletionType.Element when document only contains '<'`, () => {

    // Arrange
    const documentText = '<';
    const sut = new CompletionTypeDetection(documentText, []);

    // Act
    const result = sut.getCompletionType('<', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Element);
  });

  it(`must return CompletionType.Element when document contains '<bar><'`, () => {

    // Arrange
    const documentText = '<bar><';
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'bar', 0, 5)]);

    // Act
    const result = sut.getCompletionType('<', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Element);
  });

  it(`must return CompletionType.Emmet when document contains '['`, () => {

    // Arrange
    const documentText = '[';
    const sut = new CompletionTypeDetection(documentText, []);

    // Act
    const result = sut.getCompletionType('[', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Emmet);
  });

  it(`must return CompletionType.Emmet when document contains '   ['`, () => {

    // Arrange
    const documentText = '   [';
    const sut = new CompletionTypeDetection(documentText, []);

    // Act
    const result = sut.getCompletionType('[', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Emmet);
  });

  it(`must return CompletionType.None when document contains 'x'`, () => {

    // Arrange
    const documentText = 'x';
    const sut = new CompletionTypeDetection(documentText, []);

    // Act
    const result = sut.getCompletionType('x', documentText.length);

    // Assert
    assert.equal(result, CompletionType.None);
  });

  it(`must return CompletionType.Attribute when document contains '<bar '`, () => {

    // Arrange
    const documentText = '<bar ';
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'bar', 0, 5)]);

    // Act
    const result = sut.getCompletionType(' ', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Attribute);
  });

  it(`must return CompletionType.Attribute when document contains '<bar  '`, () => {

    // Arrange
    const documentText = '<bar  ';
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'bar', 0, 6)]);

    // Act
    const result = sut.getCompletionType(' ', documentText.length);

    // Assert
    assert.equal(result, CompletionType.Attribute);
  });

  it(`must return CompletionType.AttributeBinding when document contains '<bar foo.'`, () => {

    // Arrange
    const documentText = '<bar foo.';
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'bar', 0, 9)]);

    // Act
    const result = sut.getCompletionType('.', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeBinding);
  });

  it(`must return CompletionType.None when document contains '.'`, () => {

    // Arrange
    const documentText = '.';
    const sut = new CompletionTypeDetection(documentText, []);

    // Act
    const result = sut.getCompletionType('.', documentText.length);

    // Assert
    assert.equal(result, CompletionType.None);
  });

  it(`must return CompletionType.None when document contains '<foo.'`, () => {

    // Arrange
    const documentText = '<foo.';
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 5)]);

    // Act
    const result = sut.getCompletionType('.', documentText.length);

    // Assert
    assert.equal(result, CompletionType.None);
  });

  it(`must return CompletionType.AttributeValue when document contains '<foo attr=''`, () => {

    // Arrange
    const documentText = `<foo attr='`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 11)]);

    // Act
    const result = sut.getCompletionType('\'', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeValue);
  });

  it(`must return CompletionType.AttributeValue when document contains '<foo attr="`, () => {

    // Arrange
    const documentText = `<foo attr="`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 11)]);

    // Act
    const result = sut.getCompletionType('"', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeValue);
  });

  it(`must return CompletionType.AttributeValue when document contains '<foo attr="bla.`, () => {

    // Arrange
    const documentText = `<foo attr="bla.`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 15)]);

    // Act
    const result = sut.getCompletionType('.', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeValue);
  });

  it(`must return CompletionType.None when document contains '<foo attr="b`, () => {

    // Arrange
    const documentText = `<foo attr="b`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 12)]);

    // Act
    const result = sut.getCompletionType('b', documentText.length);

    // Assert
    assert.equal(result, CompletionType.None);
  });

  it(`must return CompletionType.AttributeValue when document contains '<foo attr.bind='`, () => {

    // Arrange
    const documentText = `<foo attr.bind='`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 16)]);

    // Act
    const result = sut.getCompletionType('\'', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeValue);
  });

  it(`must return CompletionType.AttributeValue when document contains '<foo attr.bind="`, () => {

    // Arrange
    const documentText = `<foo attr.bind="`;
    const sut = new CompletionTypeDetection(documentText, [new TagDefinition(true, 'foo', 0, 16)]);

    // Act
    const result = sut.getCompletionType('"', documentText.length);

    // Assert
    assert.equal(result, CompletionType.AttributeValue);
  });

});
