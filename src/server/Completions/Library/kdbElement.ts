import { MozDocElement } from './ElementStructure/MozDocElement';

export default class KdbElement extends MozDocElement {

  public documentation = `The HTML <kbd> element represents user input and produces an inline element displayed in
  the browser's default monospace font.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kdb';
  }
}
