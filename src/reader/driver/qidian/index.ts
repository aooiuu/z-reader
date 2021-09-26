import * as got from 'got';
import * as cheerio from 'cheerio';
import { TreeNode, defaultProblem } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

const DOMAIN = 'https://m.qidian.com';

class ReaderDriver implements ReaderDriverImplements {
  public hasChapter() {
    return true;
  }

  public search(keyword: string): Promise<TreeNode[]> {
    return new Promise(function (resolve, reject) {
      got(DOMAIN + '/search?kw=' + encodeURI(keyword))
        .then((res: any) => {
          const result: TreeNode[] = [];
          const $ = cheerio.load(res.body);
          $('.book-li').each(function (i: number, elem: any) {
            const title = $(elem).find('.book-title').text();
            const author = $(elem).find('.book-author').text().trim();
            const bookIdMatch = $(elem).find('.book-layout').attr().href.match('book/(\\d+).');
            if (bookIdMatch) {
              result.push(
                new TreeNode(
                  Object.assign({}, defaultProblem, {
                    type: '.qidian',
                    name: `${title} - ${author}`,
                    isDirectory: true,
                    path: JSON.stringify({ bookId: bookIdMatch[1] })
                  })
                )
              );
            }
          });
          resolve(result);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public getChapter(pathStr: string): Promise<TreeNode[]> {
    const { bookId } = JSON.parse(pathStr);
    return new Promise(function (resolve, reject) {
      got(DOMAIN + '/book/' + bookId + '/catalog')
        .then((res: any) => {
          const result: TreeNode[] = [];
          const regEx = new RegExp('g_data.volumes = (.*?);').exec(res.body);
          if (regEx) {
            const data: any | null = eval(regEx[1]);
            data.forEach((e: any) => {
              e.cs.forEach((cs: any) => {
                result.push(
                  new TreeNode(
                    Object.assign({}, defaultProblem, {
                      type: '.qidian',
                      name: cs.cN,
                      isDirectory: false,
                      path: JSON.stringify({ bookUrl: DOMAIN + `/book/${bookId}/${cs.id}` })
                    })
                  )
                );
              });
            });
          }
          resolve(result);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public getContent(pathStr: string): Promise<string> {
    const { bookUrl } = JSON.parse(pathStr);
    return new Promise(function (resolve, reject) {
      got(bookUrl)
        .then((res: any) => {
          const $ = cheerio.load(res.body);
          const txt = $('#chapterContent .read-section p')
            .map(function (i, el) {
              return $(el).text();
            })
            .get()
            .join('\r\n\r\n');
          resolve(txt);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
}

export const readerDriver = new ReaderDriver();
