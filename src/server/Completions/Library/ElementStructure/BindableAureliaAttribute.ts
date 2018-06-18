import { BaseAttribute } from './BaseAttribute';
import { Value } from './Value';

export class BindableAureliaAttribute extends BaseAttribute {
    constructor(
      documentation: string,
      url: string = null,
      public customSnippet: string = null,
      public customBindingSnippet: string = null,
      customLabel: string = null,
      values: Map<string, Value> = new Map()) {
        super(documentation, url, customLabel, values);
    }
}
