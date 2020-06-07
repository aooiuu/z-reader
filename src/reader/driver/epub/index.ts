import * as epub from 'epub';
import { TreeNode, defaultProblem } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

class ReaderDriver implements ReaderDriverImplements {
  public getChapter(path: string): Promise<TreeNode[]> {
    return new Promise(resolve => {
      const book = new epub(path);
      book.on('end', function() {
        resolve(
          book.flow.map(function(e) {
            return new TreeNode(
              Object.assign({}, defaultProblem, {
                type: '.epub',
                name: e.title || e.id,
                isDirectory: false,
                path: JSON.stringify({ path, chapterId: e.id })
              })
            );
          })
        );
      });
      book.parse();
    });
  }

  public getContent(pathStr: string): Promise<string> {
    const { path, chapterId } = JSON.parse(pathStr);
    return new Promise((resolve, reject) => {
      const book = new epub(path);
      book.on('end', () => {
        book.getChapter(chapterId, (error, text) => {
          if (error) {
            reject(error);
          }
          resolve(text);
        });
      });
      book.parse();
    });
  }

  public hasChapter(): boolean {
    return true;
  }
}
export const readerDriver = new ReaderDriver();
