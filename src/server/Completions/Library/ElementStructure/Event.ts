export class Event {
    constructor(
        public documentation: string,
        public url: string = null,
        public bubbles: boolean = false,
        public cancelable: boolean = false,
    ) { }
}
