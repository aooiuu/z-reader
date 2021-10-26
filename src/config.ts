import * as path from 'path';

export enum Commands {
  openReaderWebView = 'z-reader.local.openReaderWebView',
  localRefresh = 'z-reader.command.refresh',
  openLocalDirectory = 'z-reader.command.openLocalDirectory',
  searchOnline = 'z-reader.command.searchOnline',
  editTemplateHtml = 'z-reader.editTemplateHtml',
  editTemplateCss = 'z-reader.editTemplateCss',
  goProgress = 'z-reader.goProgress',
  progressUpdate = 'z-reader.progress:update',
  setOnlineSite = 'z-reader.command.setOnlineSite',
  setEncoding = 'z-reader.command.setEncoding',
  setChapterOrder = 'z-reader.command.setChapterOrder',
  collectRefresh = 'z-reader.command.collectList',
  editCollectList = 'z-reader.command.editCollectList',
  collectBook = 'z-reader.command.collectBook',
  clearCollect = 'z-reader.command.clearCollect',
  cancelCollect = 'z-reader.command.cancelCollect',
  lastChapter = 'z-reader.command.lastChapter',
  nextChapter = 'z-reader.command.nextChapter'
}

export enum WebViewMessage {
  editStyle = 'editStyle',
  editHtml = 'editHtml',
  goProgress = 'goProgress',
  progressUpdate = 'progress:update',
  lastChapter = 'lastChapter',
  nextChapter = 'nextChapter'
}

export const TemplatePath = {
  templateCss: path.join('static', 'template', 'default', 'style.css'),
  templateHtml: path.join('static', 'template', 'default', 'index.html')
};

export const TREEVIEW_ID = 'z-reader-menu';
