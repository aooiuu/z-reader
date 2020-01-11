import * as Path from 'path';
import * as Fs from 'fs';
// import * as readline from 'readline';
// import * as iconvlite from 'iconv-lite';
import { TreeNode, defaultProblem } from '../explorer/TreeNode';
import { template } from '../utils/index';
import { store } from '../utils/store';
import * as config from '../utils/config';
import { ReaderDriver } from '../@types';
import { TemplatePath } from '../config';

export const getLocalBooks = function(path: string): Promise<string[]> {
  const drivers = getDrivers();
  return new Promise(function(resolve, reject) {
    Fs.readdir(path, (err: any, files: string[]) => {
      if (err || !files) {
        reject(err);
      }
      const result = files.filter((file: string) => {
        return drivers.includes(Path.extname(file).substr(1));
      });
      resolve(result);
    });
  });
};
export const getContent = function(treeNode: TreeNode): Promise<string> {
  console.log(treeNode);
  return new Promise(function(resolve) {
    import('./driver/' + treeNode.type.substr(1))
      .then(({ readerDriver }) => readerDriver.getContent(treeNode.path))
      .then((text: string) => {
        const html = template(store.extensionPath, TemplatePath.templateHtml, {
          progress: config.get(treeNode.path, 'progress'),
          contentType: 'html',
          content: text
        });
        resolve(html);
      });
  });
};
export const getChapter = function(treeNode: TreeNode): Promise<TreeNode[]> {
  return new Promise(function(resolve) {
    import('./driver/' + treeNode.type.substr(1))
      .then(({ readerDriver }) => {
        resolve(readerDriver.getChapter(treeNode.path));
      })
      .catch(() => {
        resolve([]);
      });
  });
};
const getDrivers = function(): string[] {
  const driversPath = Path.resolve(__filename, '.././driver');
  const drivers = Fs.readdirSync(driversPath);
  return drivers;
};

export const hasChapter = function(): Promise<object> {
  const drivers = getDrivers();
  const promiseFn: any[] = [];
  for (let i = 0; i < drivers.length; i++) {
    const _promise = new Promise(function(resolve) {
      import('./driver/' + drivers[i]).then(({ readerDriver }) => {
        resolve({
          [drivers[i]]: readerDriver.hasChapter()
        });
      });
    });
    promiseFn.push(_promise);
  }
  return new Promise(function(resolve) {
    Promise.all(promiseFn).then(data => {
      resolve(Object.assign({}, ...data));
    });
  });
};
// 获取列表
export const getAllBooks = function(): Promise<TreeNode[]> {
  return new Promise(function(resolve, reject) {
    let chapters: any;
    hasChapter()
      .then((_chapters: any) => {
        chapters = _chapters;
        return getLocalBooks(store.booksPath);
      })
      .then((filePaths: string[]) => {
        console.log('getLocalBooks', filePaths);
        const result = filePaths.map(filePath => {
          const extname = Path.extname(filePath);
          return new TreeNode(
            Object.assign({}, defaultProblem, {
              type: extname,
              name: filePath,
              isDirectory: chapters[extname.substr(1)],
              path: Path.join(store.booksPath, filePath)
            })
          );
        });
        resolve(result);
      })
      .catch((e: Error) => {
        reject(e);
      });
  });
};
export const searchQidian = function(keyword: string): Promise<TreeNode[]> {
  return new Promise(function(resolve) {
    import('./driver/qidian').then(({ readerDriver }) => {
      resolve(readerDriver.search(keyword));
    });
  });
};
