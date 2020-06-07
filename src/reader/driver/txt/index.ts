import { workspace } from 'vscode';
import * as Fs from 'fs';
import * as iconv from 'iconv-lite';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

class ReaderDriver implements ReaderDriverImplements {
  private getEncoding() {
    const vConfig = workspace.getConfiguration('z-reader');
    return vConfig.get('encoding', 'utf8');
  }

  public getContent(path: string): Promise<string> {
    let result = '读取失败';
    try {
      if (this.getEncoding() === 'gbk') {
        result = iconv.decode(Fs.readFileSync(path), 'GB2312');
      } else {
        result = Fs.readFileSync(path, 'utf8');
      }
    } catch (error) {
      console.warn(error);
    }
    return Promise.resolve(result);
  }

  public getChapter() {
    return [];
  }
  public hasChapter() {
    return false;
  }
}
export const readerDriver = new ReaderDriver();
