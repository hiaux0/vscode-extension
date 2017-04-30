import 'reflect-metadata';
import { assert } from 'chai';
import HoverProviderFactory from './../../src/server/HoverProviderFactory';
import ElementLibrary from './../../src/server/Completions/Library/_elementLibrary';
import HtmlElement from './../../src/server/Completions/Library/htmlElement';
import { DocumentParser, TagDefinition, AttributeDefinition } from './../../src/server/DocumentParser';

describe.only(`The HoverProviderFactory`, () => {

  it(`must return hover information for element when hovering`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };

    // act
    let result = await sut.create('<html>', 3);

    // assert
    assert.equal(result.contents[0].value, '<html>');
  });

  it(`must return hover information for element when hovering start sign(<)`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };

    // act
    let result = await sut.create('<html>', 1);

    // assert
    assert.equal(result.contents[0].value, '<html>');
  });

  it(`must return hover information for element when hovering end sign(>)`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };

    // act
    let result = await sut.create('<html>', 5);

    // assert
    assert.equal(result.contents[0].value, '<html>');
  });

  it(`must return trimmed hover information for found element when hovering`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };

    // act
    let result = await sut.create('<html>', 3);

    // assert
    const expected = elementLibrary.elements['html'].documentation.replace(/\s\s+/g, ' ');
    assert.equal(result.contents[1].value, expected);
  }); 

  it(`must return more info url if element is of type MozDocElement`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };
    elementLibrary.elements['html'].url = 'http://url.com/test';

    // act
    let result = await sut.create('<html>', 3);

    // assert
    assert.equal(result.contents[2], 'more info: http://url.com/test');
  });

  it(`must return licenceText if element is of type MozDocElement`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };
    elementLibrary.elements['html'].url = 'http://url.com/test';

    // act
    let result = await sut.create('<html>', 3);

    // assert
    assert.equal(result.contents[3], 'MDN by Mozilla Contributors (http://url.com/test$history) is licensed under CC-BY-SA 2.5.');
  }); 

  it(`must not return hover information for unknown element when hovering`, async () => {
    // arrange
    let elementLibrary = ElementLibrary.prototype;
    let parser = DocumentParser.prototype;
    let sut = new HoverProviderFactory(elementLibrary, parser);
    elementLibrary.elements = { html : new HtmlElement() };

    // act
    let result = await sut.create('<unknown>', 3);

    // assert
    assert.equal(result, undefined);
  }); 

});
