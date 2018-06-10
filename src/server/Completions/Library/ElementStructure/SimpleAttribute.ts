import { BaseAttribute } from './BaseAttribute';
import { Value } from './Value';

export class SimpleAttribute extends BaseAttribute {
    constructor(
        documentation: string,
        url: string = null,
        customLabel: string = null,
        values: Map<string, Value> = new Map()) {
      super(documentation, url, customLabel, values);
    }
  }
