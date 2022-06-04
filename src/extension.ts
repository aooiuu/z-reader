import { ExtensionContext, window, commands, workspace } from 'vscode';
import { statusbar } from './Statusbar';
import { Commands, TREEVIEW_ID } from './config';
import { store } from './utils/store';
import workspaceConfiguration from './utils/workspaceConfiguration';
import { treeDataProvider } from './explorer/treeDataProvider';
import * as Path from 'path';
import {
  openReaderWebView,
  openLocalDirectory,
  searchOnline,
  collectRefresh,
  editCollectList,
  collectBook,
  cancelCollect,
  clearCollect,
  localRefresh,
  editTemplateHtml,
  editTemplateCss,
  goProgress,
  progressUpdate,
  nextChapter,
  lastChapter,
  reLoadCookie
} from './commands';

export async function activate(context: ExtensionContext): Promise<void> {
  console.log('activate');
  // store
  store.extensionPath = context.extensionPath;
  store.booksPath = Path.join(context.extensionPath, 'book');
  store.globalStorageUri = context.globalStorageUri;

  context.subscriptions.push(
    statusbar,
    treeDataProvider,
    // 点击事件
    commands.registerCommand(Commands.openReaderWebView, openReaderWebView),
    // 刷新
    commands.registerCommand(Commands.localRefresh, () => {
      commands.executeCommand('setContext', 'zreader.panel', 'local');
      localRefresh();
    }),
    // 打开本地目录
    commands.registerCommand(Commands.openLocalDirectory, openLocalDirectory),
    // 搜索 - 起点
    commands.registerCommand(Commands.searchOnline, () => {
      commands.executeCommand('setContext', 'zreader.panel', 'online');
      searchOnline();
    }),
    commands.registerCommand(Commands.editTemplateHtml, editTemplateHtml),
    commands.registerCommand(Commands.editTemplateCss, editTemplateCss),
    commands.registerCommand(Commands.goProgress, goProgress),
    commands.registerCommand(Commands.progressUpdate, progressUpdate),
    commands.registerCommand(Commands.lastChapter, lastChapter),
    commands.registerCommand(Commands.nextChapter, nextChapter),
    // 加载收藏列表
    commands.registerCommand(Commands.collectRefresh, () => {
      commands.executeCommand('setContext', 'zreader.panel', 'collect');
      collectRefresh();
    }),
    // 编辑收藏列表
    commands.registerCommand(Commands.editCollectList, () => editCollectList),
    // 收藏书籍
    commands.registerCommand(Commands.collectBook, collectBook),
    // 取消收藏书籍
    commands.registerCommand(Commands.cancelCollect, cancelCollect),
    // 清空收藏
    commands.registerCommand(Commands.clearCollect, clearCollect),
    // 设置
    commands.registerCommand(Commands.setOnlineSite, async () => {
      const onlineSite = workspaceConfiguration().get('onlineSite');
      // 没有找到 showQuickPick 接口设置选中项的配置, 所以这里排序将当前设置置顶
      const items = [{ label: '起点' }, { label: '笔趣阁' }]
        .map((e) => ({ ...e, description: e.label === onlineSite ? '当前设置' : '' }))
        .sort((e) => (e.label === onlineSite ? -1 : 0));
      const result = await window.showQuickPick(items, {
        placeHolder: '在线搜索来源网站, 当前设置: ' + onlineSite,
        canPickMany: false
      });
      if (result && result.label) {
        workspaceConfiguration().update('onlineSite', result.label, true);
      }
    }),
    commands.registerCommand(Commands.setEncoding, async () => {
      const encoding = workspaceConfiguration().get('encoding', 'utf8');
      const result = await window.showQuickPick(
        [
          {
            label: 'utf8'
          },
          {
            label: 'gbk'
          }
        ],
        {
          placeHolder: 'txt文件打开编码, 当前设置: ' + encoding,
          canPickMany: false
        }
      );
      if (result && result.label) {
        workspaceConfiguration().update('encoding', result.label, true);
      }
    }),
    // 设置章节顺序
    commands.registerCommand(Commands.setChapterOrder, async () => {
      const chapterOrder = workspaceConfiguration().get('chapterOrder', '顺序');
      const result = await window.showQuickPick(
        [
          {
            label: '顺序'
          },
          {
            label: '倒序'
          }
        ],
        {
          placeHolder: '章节显示顺序, 当前设置: ' + chapterOrder,
          canPickMany: false
        }
      );
      if (result && result.label) {
        workspaceConfiguration().update('chapterOrder', result.label, true);
      }
    }),
    // 注册 TreeView
    window.createTreeView(TREEVIEW_ID, {
      treeDataProvider: treeDataProvider,
      showCollapseAll: true
    })
  );
  // localRefresh();

  workspace.onDidChangeConfiguration(function (event) {
    console.log(event);
    if (event.affectsConfiguration('z-reader')) {
      reLoadCookie();
    }
  });
}

export function deactivate() {
  console.log('eactivate.');
}
