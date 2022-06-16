import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

const DOMAIN = 'https://www.xbiquwx.la/';
const DOMAIN2 = 'https://www.xbiquwx.la/';

class ReaderDriver implements ReaderDriverImplements {
  public hasChapter() {
    return true;
  }

  public async search(keyword: string): Promise<TreeNode[]> {
    const result: TreeNode[] = [];
    try {
      const res = await request.send(DOMAIN2 + '/modules/article/search.php?searchkey=' + encodeURI(keyword));
      const $ = cheerio.load(res.body);
      $('.grid tbody > tr').each(function (i: number, elem: any) {
        const title = $(elem).find('td:eq(0)').text();
        const author = $(elem).find('.odd:eq(1)').text();
        const path = $(elem).find('td:eq(0)').find('a').attr('href')
        // console.log('path', $(elem).find('td:eq(0)').find('a').attr('href'));
        if (title && author) {
          result.push(
            new TreeNode(
              Object.assign({}, defaultTreeNode, {
                type: '.biquge',
                name: `${title} - ${author}`,
                isDirectory: true,
                path
              })
            )
          );
        }
      });
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public async getChapter(pathStr: string): Promise<TreeNode[]> {
    const result: TreeNode[] = [];
    try {
      const res = await request.send(DOMAIN + pathStr);
      const $ = cheerio.load(res.body);
      $('#list dd').each(function (i: number, elem: any) {
        const name = $(elem).find('a').text();
        const path = $(elem).find('a').attr().href;
        result.push(
          new TreeNode(
            Object.assign({}, defaultTreeNode, {
              type: '.biquge',
              name,
              isDirectory: false,
              path: pathStr + path,
            })
          )
        );
      });
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public async getContent(pathStr: string): Promise<string> {
    let result = '';
    try {
      console.log('pathStr', pathStr)
      const res = await request.send(DOMAIN + pathStr);
      const $ = cheerio.load(res.body);
      const html = $('#content').html();
      result = html ? html : '';
    } catch (error) {
      console.warn(error);
    }
    return result;
  }
}

export const readerDriver = new ReaderDriver();
