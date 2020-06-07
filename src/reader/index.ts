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
  // 获取列表
  public getAllBooks(): Promise<TreeNode[]> {
    return new Promise((resolve, reject) => {
      let chapters: any;
      this.hasChapter()
        .then((_chapters: any) => {
          chapters = _chapters;
          return this.getLocalBooks(store.booksPath);
        })
        .then((filePaths: string[]) => {
          console.log('getLocalBooks', filePaths);
          const result = filePaths.map((filePath) => {
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
