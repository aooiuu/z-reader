import { Command } from 'vscode';
import { Commands } from '../config';
import { IReader } from '../@types';

export const defaultProblem: IReader = {
  type: '.txt',
  name: '',
  isDirectory: false,
  path: ''
};

export class TreeNode {
  constructor(private data: IReader) {}

  public get name(): string {
    return this.data.name;
  }
  public get type(): string {
    return this.data.type;
  }
  public get path(): string {
    return this.data.path;
  }
  public get isDirectory(): boolean {
    return this.data.isDirectory;
  }
  public get previewCommand(): Command {
    return {
      title: this.data.name,
      command: Commands.openReaderWebView,
      arguments: [this]
    };
  }
}
