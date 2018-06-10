import { ParsedFile } from './ParsedFile';

export class HtmlFile extends ParsedFile {
    public type = 'html file';

    public code: string;
    public className: string;
  }
