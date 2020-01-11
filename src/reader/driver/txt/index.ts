import * as Fs from 'fs';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

class ReaderDriver implements ReaderDriverImplements {
  public getContent(path: string) {
    return new Promise(function(resolve, reject) {
      Fs.readFile(path, 'utf8', function(err: Error | null, data: string) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  public getChapter() {
    return [];
  }
  public hasChapter() {
    return false;
  }
}
export const readerDriver = new ReaderDriver();

// export const getContent = function(path: string) {
//   return new Promise(function(resolve, reject) {
//     Fs.readFile(path, 'utf8', function(err: Error | null, data: string) {
//       if (err) {
//         return reject(err);
//       }
//       resolve(data);
//     });
//   });
// };
// export const hasChapter = function() {
//   return false;
// };
// TODO 解决按行读取和编码问题
// const readLine = function(path: string, options: createReadStreamOptions) {
//   return Promise.resolve(Fs.readFileSync(path, { encoding: 'utf-8' }));
//   // 编码问题
//   // return new Promise(function(resolve, reject) {
//   //   const fileFtream = Fs.createReadStream(path, options);
//   //   let result = '';
//   //   readline
//   //     .createInterface(fileFtream)
//   //     .addListener('line', function(line) {
//   //       console.log('line: ', line);
//   //       const lineStr = iconvlite.decode(line, 'utf8');
//   //       console.log('line: ', lineStr);
//   //       result += lineStr;
//   //     })
//   //     .addListener('close', function() {
//   //       console.log('close');
//   //       resolve(result);
//   //     });
//   // });

//   // UTF8 截断会出现问题
//   // return new Promise(function(resolve, reject) {
//   //   let result = '';
//   //   Fs.createReadStream(path, options)
//   //     .addListener('data', function(chunk) {
//   //       result += chunk;
//   //     })
//   //     .addListener('close', function() {
//   //       resolve(result);
//   //     });
//   // });
// };
