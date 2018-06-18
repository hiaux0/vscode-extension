import { BaseAttribute } from './BaseAttribute';

export class EmptyAureliaAttribute extends BaseAttribute {
    constructor(
    documentation: string,
    url: string = null,
    customLabel: string = null) {
        super(documentation, url, customLabel);
    }
}
