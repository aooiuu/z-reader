import { ViewColumn } from 'vscode';

export interface IReader {
  type: string;
  name: string;
  isDirectory: boolean;
  path: string;
}

export interface IWebviewOption {
  title: string;
  viewColumn: ViewColumn;
  preserveFocus?: boolean;
}

interface IWebViewMessage {
  command: string;
  data: object;
}

interface ReaderDriver {
  hasChapter: Function;
  search?: Function;
  getChapter: Function;
  getContent: Function;
}

// 你可以通过 declare 关键字，来告诉 TypeScript，你正在试图表述一个其他地方已经存在的代码（如：写在 JavaScript、CoffeeScript 或者是像浏览器和 Node.js 运行环境里的代码）：
