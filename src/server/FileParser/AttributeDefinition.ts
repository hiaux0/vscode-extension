import { MarkupData } from 'parse5';

export class AttributeDefinition {

    public name: string;
    public binding: string;
    public endOffset: number;
    public startOffset: number;

    constructor(name: string, public value: string, location?: MarkupData.Location) {
        if (name) {
        const parts = name.split('.');
        if (parts.length === 2) {
            this.name = parts[0];
            this.binding = parts[1];
        } else {
            this.name = name;
        }
        }

        if (location) {
        this.startOffset = location.startOffset;
        this.endOffset = location.endOffset;
        }
    }
}
