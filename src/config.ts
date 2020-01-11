export enum Commands {
  openReaderWebView = 'z-reader.local.openReaderWebView',
  localRefresh = 'z-reader.local.refresh',
  openLocalDirectory = 'z-reader.local.openLocalDirectory',
  searchQidian = 'z-reader.local.searchQidian',
  editTemplateHtml = 'z-reader.editTemplateHtml',
  editTemplateCss = 'ez-reader.ditTemplateCss',
  goProgress = 'z-reader.goProgress',
  progressUpdate = 'z-reader.progress:update'
}

export enum WebViewMessage {
  editStyle = 'editStyle',
  editHtml = 'editHtml',
  goProgress = 'goProgress',
  progressUpdate = 'progress:update'
}

export enum TemplatePath {
  templateCss = '\\static\\template\\default\\style.css',
  templateHtml = '\\static\\template\\default\\index.html'
}

export const TREEVIEW_ID = 'local';
