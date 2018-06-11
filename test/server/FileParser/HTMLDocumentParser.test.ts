import { assert } from 'chai';
import { HTMLDocumentParser } from '../../../src/server/FileParser/Parsers/HTMLDocumentParser';

describe('parse', () => {

  it(`must detect start tag`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<div>');

    // Assert
    assert.isTrue(result[0].startTag);
  });

  it(`must detect not closed start tag`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<div');

    // Assert
    assert.isTrue(result[0].startTag);
  });

  it(`must detect end tag`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<div></div>');

    // Assert
    assert.isTrue(result[0].startTag);
    assert.isFalse(result[1].startTag);
  });

  it(`must detect not closed end tag`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<div></di');

    // Assert
    assert.isTrue(result[0].startTag);
    assert.isFalse(result[1].startTag);
  });

  it(`must detect open tag`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<da');

    // Assert
    assert.equal(result[0].name, 'da');
  });

  it(`must detect open tag with attribute`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<da ba');

    // Assert
    assert.equal(result[0].name, 'da');
  });

  it(`must detect open tag with attribute with equal sign`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<da ba=');

    // Assert
    assert.equal(result[0].name, 'da');
  });

  it(`must detect open tag with attribute with equal sign and single quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da ba='xx`);

    // Assert
    assert.equal(result[0].name, 'da');
  });

  it(`must detect open tag with attribute with equal sign and double quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da ba="xx`);

    // Assert
    assert.equal(result[0].name, 'da');
  });

  it(`must detect attribute in open tag with attribute with equal sign`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse('<da ba=');

    // Assert
    assert.equal(result[0].attributes[0].name, 'ba');
  });

  it(`must detect attribute in open tag with attribute with equal sign and single quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da ba='xx`);

    // Assert
    assert.equal(result[0].attributes[0].name, 'ba');
  });

  it(`must detect attribute in open tag with attribute with equal sign and double quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da ba="xx`);

    // Assert
    assert.equal(result[0].attributes[0].name, 'ba');
  });

  it(`must detect attribute in open tag with attribute with aurelia command`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da value.`);

    // Assert
    assert.equal(result[0].attributes[0].name, 'value');
  });

  it(`must detect attribute in open tag with attribute with aurelia command and equal sign and single quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da value.bind='`);

    // Assert
    assert.equal(result[0].attributes[0].name, 'value');
  });

  it(`must detect attribute in open tag with attribute with aurelia command and equal sign and double quote`, async () => {

    // Arrange
    const sut = new HTMLDocumentParser();

    // Act
    const result = await sut.parse(`<da value.bind="`);

    // Assert
    assert.equal(result[0].attributes[0].name, 'value');
  });

});
