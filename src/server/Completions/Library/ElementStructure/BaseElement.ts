import { BaseAttribute } from './BaseAttribute';
import { Event } from './Event';

export class BaseElement {
    public attributes: Map<string, BaseAttribute> = new Map<string, BaseAttribute>();
    public events: Map<string, Event> = new Map<string, Event>();
    public hasGlobalAttributes = true;
    public hasGlobalEvents = true;
    protected url: string;
}
