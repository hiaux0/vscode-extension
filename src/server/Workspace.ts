import { ParsedFile } from './FileParser/Model/Files/ParsedFile';

export class Workspace {
    public path: string;
    public files: Map<string, ParsedFile> = new Map<string, ParsedFile>();
}
