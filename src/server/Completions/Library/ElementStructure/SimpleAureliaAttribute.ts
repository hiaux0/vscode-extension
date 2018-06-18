import { BaseAttribute } from './BaseAttribute';
import { Value } from './Value';

export class SimpleAureliaAttribute extends BaseAttribute {
    constructor(
        documentation: string,
        url: string = null,
        customLabel: string = null,
        values: Map<string, Value> = new Map()) {
      super(documentation, url, customLabel, values);
    }
  }
