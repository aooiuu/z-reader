import * as Open from 'open';
import * as Fs from 'fs';
import * as Path from 'path';
import { Uri } from 'vscode';

export const open = (path: string) => {
  return Open(path, { wait: true });
};

export const mkdir = (path: string) =>{
  return Fs.mkdirSync(path, { recursive: true });
}

export const template = (rootPath: string, htmlPath: string, data: any = false): any => {
  const AbsHtmlPath = Path.join(rootPath, htmlPath);
  const dirPath = Path.dirname(AbsHtmlPath);
  let result = Fs.readFileSync(AbsHtmlPath, 'utf-8').replace(/(@)(.+?)"/g, (m, $1, $2) => {
    return Uri.file(Path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
  });
  if (data) {
    result = result.replace(/(\{\{)(.+?)(\}\})/g, (m, $1, $2) => {
      return data[$2.trim()];
    });
  }
  return result;
};
