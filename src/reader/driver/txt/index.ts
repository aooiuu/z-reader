/* eslint-disable @typescript-eslint/no-this-alias */
import { workspace } from 'vscode';
import * as Fs from 'fs';
import * as iconv from 'iconv-lite';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';
import { defaultTreeNode, TreeNode } from '../../../explorer/TreeNode';

class ReaderDriver implements ReaderDriverImplements {
  chapters: string[] = []
  previousPath = ""

  private getEncoding() {
    const vConfig = workspace.getConfiguration('z-reader');
    return vConfig.get('encoding', 'utf8');
  }

  public getContent(pathStr: string): Promise<string> {
    return new Promise((resolve) => {
      this.getBookContents(pathStr).then((chapters) => {
        if (chapters.length > 0) {
          const { chapterId } = JSON.parse(pathStr);
          if (chapterId < chapters.length) {
            resolve(chapters[chapterId])
          }
        }
        resolve("读取失败");
      });
    });
  }

  public getChapter(path: string): Promise<TreeNode[]> {
    return new Promise((resolve) => {
      this.getBookContents(path).then((chapters) => {
        resolve(
          chapters.map((e, i) => {
            const t = new TreeNode(
              Object.assign({}, defaultTreeNode, {
                type: '.txt',
                name: this.getChapterName(e),
                isDirectory: false,
                path: JSON.stringify({ path, chapterId: i })
              })
            )
            console.log(t);
            return t;
          })
        )
      })
    });
  }

  public hasChapter() {
    return true;
  }

  private getBookContents(path: string): Promise<string[]> {
    if (this.chapters.length > 0 && path === this.previousPath) {
      return Promise.resolve(this.chapters)
    }
    let result = '';
    this.previousPath = path;
    const stream = Fs.createReadStream(path);
    const encoding = this.getEncoding() === 'gbk' ? 'GB2312' : 'utf8'
    stream.on('data', (chunk) => {
      result += iconv.decode(chunk, encoding);
    })
    stream.on('error', (err) => {
      console.log(err.stack)
    })
    return new Promise((resolve) => {
      let chapters: string[] = [];
      stream.on('end', () => {
        chapters = result.split(/\r\n[\r\n]+/);
        if (chapters.length === 0) {
          chapters = result.split(/\n[\n+]/);
        }
        this.chapters = chapters;
        resolve(chapters)
      })
    })
  }

  private getChapterName(data: string): string {
    const lines = data.split(/\r\n/);
    if (lines.length === 1) {
      return lines[0].trim()
    } else {
      if (this.hasChapterSign(lines[0])) {
        return lines[0].trim()
      } else {
        return lines.join("")
      }
    }
  }

  private hasChapterSign(data: string): boolean {
    return (!data.startsWith(" ") || !data.startsWith('　　'));
  }
}
export const readerDriver = new ReaderDriver();
