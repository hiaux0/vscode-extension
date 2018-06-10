import {singleton} from 'aurelia-dependency-injection';
import {WebComponent} from './WebComponent';

@singleton()
export class AureliaApplication {
  public components: WebComponent[] = [];
}
