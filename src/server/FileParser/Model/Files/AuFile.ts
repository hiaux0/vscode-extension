import { ParsedFile } from './ParsedFile';

export class AuFile extends ParsedFile {

    public type = 'aurelia file';
    public singleFileComponent = false;

    public javascriptBlocks = [];
    public typescriptBlocks = [];

    public templateBindings = [];
    public stringInterpolation = [];
    public commands = [];

    public imports = [];
}
