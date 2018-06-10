import { ParsedFile } from './FileParser/ParsedFile';

export class Workspace {
    public path: string;
    public files: Map<string, ParsedFile> = new Map<string, ParsedFile>();
}
