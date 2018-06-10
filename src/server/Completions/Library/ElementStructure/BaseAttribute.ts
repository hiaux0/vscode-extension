import { Value } from './Value';

export class BaseAttribute {
    constructor(
      public documentation: string,
      public url: string,
      public customLabel: string = null,
      public values: Map<string, Value> = new Map()) { }
  }
