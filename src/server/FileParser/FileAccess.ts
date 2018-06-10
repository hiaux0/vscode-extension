import { sys } from 'typescript';

export class FileAccess {
    public readFileContent(path: string) {
        return sys.readFile(path);
    }
}
