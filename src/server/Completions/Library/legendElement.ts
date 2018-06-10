import { MozDocElement } from './ElementStructure/MozDocElement';

export default class LegendElement extends MozDocElement {

  public documentation = `The HTML <legend> element represents a caption for the content of its parent <fieldset>.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend';
  }
}
