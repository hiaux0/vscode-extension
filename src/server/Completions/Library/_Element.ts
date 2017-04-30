import { BindableAttribute, BaseElement } from './_elementStructure';

export default class _Element extends BaseElement {

  public documentation = ``;
  public url = undefined;

  constructor() {
    super();
    this.url ='';
    this.attributes.set('',
      new BindableAttribute(``));
  }
}
