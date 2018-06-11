import * as parseGitIgnore from 'parse-gitignore';
import * as Path from 'path';
import {
    CompilerOptions,
    createLanguageService,
    getDefaultLibFilePath,
    IScriptSnapshot,
    LanguageServiceHost,
    ScriptKind,
    sys,
} from 'typescript';
import Uri from 'vscode-uri';
import { AuFile } from './Model/Files/AuFile';
import {HtmlFile} from './Model/Files/HtmlFile';
import {ParsedFile} from './Model/Files/ParsedFile';

import * as ts from 'typescript';

export function getLanguageService(workspacePath: string, files: Map<string, ParsedFile>, extra: string = '') {
    return createLanguageService(new AureliaLanguageServiceHost(workspacePath, files, extra));
}

export class AureliaLanguageServiceHost implements LanguageServiceHost {

    constructor(private workspacePath: string, private files: Map<string, ParsedFile>, private extra) {

    }

    public getCompilationSettings(): CompilerOptions {
        return {
            ...{
                allowJs: true,
                allowNonTsExtensions: true,
                allowSyntheticDefaultImports: true,
                jsx: ts.JsxEmit.Preserve,
                lib: ['lib.dom.d.ts', 'lib.es2017.d.ts'],
                module: ts.ModuleKind.CommonJS,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                target: ts.ScriptTarget.Latest,
            },
            ...getParsedConfig(this.workspacePath).options,
        };
    }

    public getScriptFileNames(): string[] {
        return[ ...this.files.keys() ];
    }
    public getScriptKind?(fileName: string): ScriptKind {
        if (isAureliaFile(fileName)) {
            const uri = Uri.file(fileName);
            fileName = uri.fsPath;
            return ScriptKind.TS;
          } else {
            // NOTE: Typescript 2.3 should export getScriptKindFromFileName. Then this cast should be removed.
            return (ts as any).getScriptKindFromFileName(fileName);
          }
    }
    public getScriptVersion(fileName: string): string {
        return '0';
    }
    public getScriptSnapshot(fileName: string): IScriptSnapshot {

        const file = this.files.get(fileName);
        if (file instanceof AuFile) {
            const auCode = file.typescriptBlocks[0];

            const extraText = `
            class Factory{create<T>(type: (new () => T)): T {return new type();}}
            const vm = new Factory().create(${auCode.className});
            vm.` + this.extra;

            const text = auCode.code + extraText;
            return {
                getChangeRange: () => void 0,
                getLength: () => {
                    return text.length;
                },
                getText: (start, end) => {
                    return text.substring(start, end);
                },
            };
        } else if (file instanceof HtmlFile) {
            const auCode = file;

            const extraText = `
            class Factory{create<T>(type: (new () => T)): T {return new type();}}
            const vm = new Factory().create(${auCode.className});
            vm.` + this.extra;

            const text = auCode.code + extraText;
            return {
                getChangeRange: () => void 0,
                getLength: () => {
                    return text.length;
                },
                getText: (start, end) => {
                    return text.substring(start, end);
                },
            };
        } else {
            const fileText = sys.readFile(fileName) || '';
            return {
                getChangeRange: () => void 0,
                getLength: () => fileText.length,
                getText: (start, end) => fileText.substring(start, end),
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
    exclude: defaultIgnorePatterns(workspacePath),
  };
    return ts.parseJsonConfigFileContent(
    configJson,
    ts.sys,
    workspacePath,
    {},
    configFilename,
    undefined,
    [{ extension: 'au', isMixedContent: true }],
  );
}

function defaultIgnorePatterns(workspacePath: string) {
    const nodeModules = ['node_modules', '**/node_modules/*'];
    const gitignore = ts.findConfigFile(workspacePath, sys.fileExists, '.gitignore');
    if (!gitignore) {
      return nodeModules;
    }
    const parsed: string[] = parseGitIgnore(gitignore);
    const filtered = parsed.filter((s) => !s.startsWith('!'));
    return nodeModules.concat(filtered);
  }

function isAureliaFile(filename: string): boolean {
    return Path.extname(filename) === '.au';
  }
