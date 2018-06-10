import { BaseElement } from './ElementStructure/BaseElement';

export default class UnknownElement extends BaseElement {

  public documentation = ``;

  constructor() {
    super();
    this.url = '';
  }
}
