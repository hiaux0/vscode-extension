import { AttributeDefinition } from './AttributeDefinition';

export class TagDefinition {
    constructor(
        public startTag: boolean,
        public name: string,
        public startOffset: number,
        public endOffset: number,
        public selfClosing: boolean = null,
        public attributes: AttributeDefinition[] = []) {
    }
}
