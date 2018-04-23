import { 
    LanguageServiceHost,
    CompilerOptions,
    ScriptKind,
    IScriptSnapshot,
    getDefaultLibFilePath,
    createLanguageService,
    sys
} from "typescript";
import * as parseGitIgnore from 'parse-gitignore';
import { ParsedFile, AuFile, HtmlFile } from "./FileParser";
import * as Path from 'path';
import Uri from 'vscode-uri';

import * as ts from "typescript";

export function getLanguageService(workspacePath: string, files: Map<string, ParsedFile>, extra: string = '') {
    return createLanguageService(new AureliaLanguageServiceHost(workspacePath, files, extra));
}

export class AureliaLanguageServiceHost implements LanguageServiceHost {
    
    constructor(private workspacePath: string, private files: Map<string, ParsedFile>, private extra) {
       
    }

    public getCompilationSettings(): CompilerOptions {
        return {
            ...{
                allowNonTsExtensions: true,
                allowJs: true,
                lib: ['lib.dom.d.ts', 'lib.es2017.d.ts'],
                target: ts.ScriptTarget.Latest,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                module: ts.ModuleKind.CommonJS,
                jsx: ts.JsxEmit.Preserve,
                allowSyntheticDefaultImports: true
            },
            ...getParsedConfig(this.workspacePath).options
        }
    }

    public getScriptFileNames(): string[] {
        return[ ...this.files.keys() ];
    }
    getScriptKind?(fileName: string): ScriptKind {
        if (isAureliaFile(fileName)) {
            const uri = Uri.file(fileName);
            fileName = uri.fsPath;
            return ScriptKind.TS;
          } else {
            // NOTE: Typescript 2.3 should export getScriptKindFromFileName. Then this cast should be removed.
            return (ts as any).getScriptKindFromFileName(fileName);
          }        
    }
    getScriptVersion(fileName: string): string {
        return '0';
    }
    getScriptSnapshot(fileName: string): IScriptSnapshot {

        const file = this.files.get(fileName);
        if (file instanceof AuFile) {
            const auCode = file.typescriptBlocks[0];
    
            const extraText = `
            class Factory{create<T>(type: (new () => T)): T {return new type();}}
            const vm = new Factory().create(${auCode.className});
            vm.` + this.extra;

            const text = auCode.code + extraText;          
            return {
                getText: (start, end) => {
                    return text.substring(start, end)
                },
                getLength: () => {
                    return text.length;
                },
                getChangeRange: () => void 0
            };   
        } else if (file instanceof HtmlFile) {
            const auCode = file;
    
            const extraText = `
            class Factory{create<T>(type: (new () => T)): T {return new type();}}
            const vm = new Factory().create(${auCode.className});
            vm.` + this.extra;

            const text = auCode.code + extraText;          
            return {
                getText: (start, end) => {
                    return text.substring(start, end)
                },
                getLength: () => {
                    return text.length;
                },
                getChangeRange: () => void 0
            };   
        } else {
            let fileText = sys.readFile(fileName) || '';
            return {
              getText: (start, end) => fileText.substring(start, end),
              getLength: () => fileText.length,
              getChangeRange: () => void 0
            };                        
        }
    }
    public getCurrentDirectory(): string {
        return this.workspacePath;
    }
    public getDefaultLibFileName(options: ts.CompilerOptions): string {
        return getDefaultLibFilePath(options);
    }
}

function getParsedConfig(workspacePath: string) { 
    const configFilename =
        ts.findConfigFile(workspacePath, ts.sys.fileExists, 'tsconfig.json') ||
        ts.findConfigFile(workspacePath, ts.sys.fileExists, 'jsconfig.json');
  const configJson = (configFilename && ts.readConfigFile(configFilename, ts.sys.readFile).config) || {
    exclude: defaultIgnorePatterns(workspacePath)
  };
  return ts.parseJsonConfigFileContent(
    configJson,
    ts.sys,
    workspacePath,
    {},
    configFilename,
    undefined,
    [{ extension: 'au', isMixedContent: true }]
  );        
}

function defaultIgnorePatterns(workspacePath: string) {
    const nodeModules = ['node_modules', '**/node_modules/*'];
    const gitignore = ts.findConfigFile(workspacePath, sys.fileExists, '.gitignore');
    if (!gitignore) {
      return nodeModules;
    }
    const parsed: string[] = parseGitIgnore(gitignore);
    const filtered = parsed.filter(s => !s.startsWith('!'));
    return nodeModules.concat(filtered);
  }

  function isAureliaFile(filename: string): boolean {
    return Path.extname(filename) === '.au';
  }