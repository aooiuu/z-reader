import { ExtensionContext, window, StatusBarAlignment, commands } from 'vscode';
import * as statusBarItem from './statusbar';
import { Commands, TREEVIEW_ID } from './config';
import { store } from './utils/store';
import { treeDataProvider } from './explorer/treeDataProvider';
import * as Path from 'path';
import {
  openReaderWebView,
  openLocalDirectory,
  searchQidian,
  localRefresh,
  editTemplateHtml,
  editTemplateCss,
  goProgress,
  progressUpdate
} from './commands';

export async function activate(context: ExtensionContext): Promise<void> {
  console.log('activate');
  // store
  store.extensionPath = context.extensionPath;
  store.booksPath = Path.join(context.extensionPath, 'book');
  // statusBar
  statusBarItem.setStatusBarItem(window.createStatusBarItem(StatusBarAlignment.Right, 100));
  statusBarItem.setText(`z-reader`);
  statusBarItem.statusBarItem.show();
  // tree
  treeDataProvider.initialize(context);

  context.subscriptions.push(
    statusBarItem.statusBarItem,
    // 点击事件
    commands.registerCommand(Commands.openReaderWebView, data => openReaderWebView(data)),
    // 刷新
    commands.registerCommand(Commands.localRefresh, () => localRefresh()),
    // 打开本地目录
    commands.registerCommand(Commands.openLocalDirectory, () => openLocalDirectory()),
    // 搜索 - 起点
    commands.registerCommand(Commands.searchQidian, () => searchQidian()),
    commands.registerCommand(Commands.editTemplateHtml, () => editTemplateHtml()),
    commands.registerCommand(Commands.editTemplateCss, () => editTemplateCss()),
    commands.registerCommand(Commands.goProgress, () => goProgress()),
    commands.registerCommand(Commands.progressUpdate, data => progressUpdate(data)),
    // 注册 TreeView
    window.createTreeView(TREEVIEW_ID, {
      treeDataProvider: treeDataProvider,
      showCollapseAll: true
    })
  );
  localRefresh();
}

export function deactivate() {
  console.log('eactivate.');
}
