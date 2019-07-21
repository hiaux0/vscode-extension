'use strict';
import { commands, Disposable, TextEditor, TextEditorEdit, Uri, workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AureliaConfigProperties } from './Model/AureliaConfigProperties';

export class RelatedFiles implements Disposable {
  private disposable: Disposable;

  constructor() {
    this.disposable = commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this);
  }

  public dispose() {
    if (this.disposable) {
      this.disposable.dispose();
    }
  }

  private getFileExtensionsFromConfig() {
    return workspace.getConfiguration().get<AureliaConfigProperties['relatedFiles']>('aurelia.relatedFiles');
  }

  private async onOpenRelated(editor: TextEditor, edit: TextEditorEdit) {
    if (!editor || !editor.document || editor.document.isUntitled) {
      return;
    }

    let relatedFile: string;
    const fileName = editor.document.fileName;
    const extension = path.extname(fileName).toLowerCase();
    const fileExtensionsConfig = this.getFileExtensionsFromConfig();
    const {
      view: viewExtension,
      script: scriptExtension,
    } = fileExtensionsConfig

    if (extension === viewExtension) {
      relatedFile = await this.relatedFileExists(fileName, scriptExtension);
    }
    else if (extension === scriptExtension) {
      relatedFile = await this.relatedFileExists(fileName, viewExtension);
    }

    if (relatedFile) {
      commands.executeCommand('vscode.open', Uri.file(relatedFile), editor.viewColumn);
    }
  }

  private async relatedFileExists(fullPath: string, relatedExt: string): Promise<string | undefined> {
    const fileName = `${path.basename(fullPath, path.extname(fullPath))}${relatedExt}`;
    fullPath = path.join(path.dirname(fullPath), fileName);

    return new Promise<string | undefined>((resolve, reject) =>
        fs.access(fullPath, fs.constants.R_OK, err => resolve(err ? undefined : fullPath)));
  }
}
