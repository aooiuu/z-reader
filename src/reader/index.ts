import { workspace, window } from 'vscode';
import * as Path from 'path';
import * as Fs from 'fs';
import { TreeNode, defaultProblem } from '../explorer/TreeNode';
import { template } from '../utils/index';
import { store } from '../utils/store';
import * as config from '../utils/config';
import { TemplatePath } from '../config';

class ReaderDriver {
  public getLocalBooks(path: string): Promise<string[]> {
    const drivers = this.getDrivers();
    return new Promise(function (resolve, reject) {
      if (!Fs.lstatSync(path).isDirectory()) {
        reject('读取目录失败');
        return;
      }

      Fs.readdir(path, (err: any, files: string[]) => {
        if (err || !files) {
          reject(err);
        }
        const result = files
          .filter((file: string) => {
            return drivers.includes(Path.extname(file).substr(1));
          })
          .sort((a, b) => {
            const am = a.match(/[\u4e00-\u9fa5]/g);
            const bm = b.match(/[\u4e00-\u9fa5]/g);
            const as = am ? am.join('') : a;
            const bs = bm ? bm.join('') : b;
            const _an = a.match(/\d+/g);
            const _bn = b.match(/\d+/g);
            const an = _an ? Number(_an.join('')) : 0;
            const bn = _bn ? Number(_bn.join('')) : 0;
            if (as === bs) {
              return an > bn ? 1 : -1;
            }
            return as > bs ? -1 : 1;
          });
        resolve(result);
      });
    });
  }

  public getContent(treeNode: TreeNode): Promise<string> {
    console.log(treeNode);
    return new Promise(function (resolve) {
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
  }

  public getChapter(treeNode: TreeNode): Promise<TreeNode[]> {
    return new Promise(function (resolve) {
      import('./driver/' + treeNode.type.substr(1))
        .then(({ readerDriver }) => {
          resolve(readerDriver.getChapter(treeNode.path));
        })
        .catch(() => {
          resolve([]);
        });
    });
  }

  public getDrivers(): string[] {
    const driversPath = Path.resolve(__filename, '.././driver');
    const drivers = Fs.readdirSync(driversPath);
    return drivers;
  }

  public hasChapter(): Promise<any> {
    const drivers = this.getDrivers();
    const promiseFn: any[] = [];
    for (let i = 0; i < drivers.length; i++) {
      const _promise = new Promise(function (resolve) {
        import('./driver/' + drivers[i]).then(({ readerDriver }) => {
          resolve({
            [drivers[i]]: readerDriver.hasChapter()
          });
        });
      });
      promiseFn.push(_promise);
    }
    return new Promise(function (resolve) {
      Promise.all(promiseFn).then((data) => {
        resolve(Object.assign({}, ...data));
      });
    });
  }

  public getFileDir(): string {
    const fileDir = workspace.getConfiguration('z-reader').get('fileDir', store.booksPath);
    return fileDir ? fileDir : store.booksPath;
  }

  // 获取列表
  public async getAllBooks(): Promise<TreeNode[]> {
    const fileDir = this.getFileDir();
    const result: TreeNode[] = [];
    try {
      const chapters = await this.hasChapter();
      const filePaths = await this.getLocalBooks(fileDir);
      filePaths.forEach((filePath: string) => {
        const extname = Path.extname(filePath);
        result.push(
          new TreeNode(
            Object.assign({}, defaultProblem, {
              type: extname,
              name: filePath,
              isDirectory: chapters[extname.substr(1)],
              path: Path.join(fileDir, filePath)
            })
          )
        );
      });
    } catch (error) {
      console.log(error)
      window.showWarningMessage('读取目录失败, 请检测您的目录设置');
    }
    return result;
  }

  private getSearchDriver = function (onlineSite: string): string {
    switch (onlineSite) {
      case '起点':
        return './driver/qidian';
      case '笔趣阁':
        return './driver/biquge';
      default:
        return './driver/qidian';
    }
  };

  public search(keyword: string, onlineSite: string): Promise<TreeNode[]> {
    return new Promise((resolve, reject) => {
      import(this.getSearchDriver(onlineSite))
        .then(({ readerDriver }) => {
          resolve(readerDriver.search(keyword));
        })
        .catch((error) => reject(error));
    });
  }
}

export const readerDriver: ReaderDriver = new ReaderDriver();
