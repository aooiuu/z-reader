import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

const DOMAIN = 'https://m.qidian.com';

class ReaderDriver implements ReaderDriverImplements {
  public hasChapter() {
    return true;
  }

  public search(keyword: string): Promise<TreeNode[]> {
    return new Promise(function (resolve, reject) {
      request
        .send(DOMAIN + '/search?kw=' + encodeURI(keyword))
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
                  Object.assign({}, defaultTreeNode, {
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

  public async getChapter(pathStr: string): Promise<TreeNode[]> {
    const { bookId } = JSON.parse(pathStr);
    const res = await request.send(DOMAIN + '/book/' + bookId + '/catalog').catch((err) => console.warn(err));
    if (!res) {
      return [];
    }
    const result: TreeNode[] = [];
    const regEx = /g_data.volumes = (.*?)\n/.exec(res.body);
    try {
      if (regEx) {
        const data: any | null = eval(regEx[1]);
        data.forEach((e: any) => {
          e.cs.forEach((cs: any) => {
            result.push(
              new TreeNode(
                Object.assign({}, defaultTreeNode, {
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
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public async getContent(pathStr: string): Promise<string> {
    const { bookUrl } = JSON.parse(pathStr);
    const res = await request.send(bookUrl).catch((err) => console.warn(err));
    if (!res) {
      return '读取章节失败';
    }
    const $ = cheerio.load(res.body);
    let txt = $('#chapterContent .read-section p')
      .map(function (i, el) {
        return $(el).text();
      })
      .get()
      .join('\r\n');

    // 收费章节提示
    txt += $('.read-rss-auto-left').text();

    return txt;
  }
}

export const readerDriver = new ReaderDriver();
