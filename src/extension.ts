import { ExtensionContext, window, commands, workspace } from 'vscode';
import { statusbar } from './Statusbar';
import { Commands, TREEVIEW_ID } from './config';
import { store } from './utils/store';
import { treeDataProvider } from './explorer/treeDataProvider';
import * as Path from 'path';
import {
  openReaderWebView,
  openLocalDirectory,
  searchOnline,
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

  context.subscriptions.push(
    statusbar,
    treeDataProvider,
    // 点击事件
    commands.registerCommand(Commands.openReaderWebView, (data) => openReaderWebView(data)),
    // 刷新
    commands.registerCommand(Commands.localRefresh, () => localRefresh()),
    // 打开本地目录
    commands.registerCommand(Commands.openLocalDirectory, () => openLocalDirectory()),
    // 搜索 - 起点
    commands.registerCommand(Commands.searchOnline, () => searchOnline()),
    commands.registerCommand(Commands.editTemplateHtml, () => editTemplateHtml()),
    commands.registerCommand(Commands.editTemplateCss, () => editTemplateCss()),
    commands.registerCommand(Commands.goProgress, () => goProgress()),
    commands.registerCommand(Commands.progressUpdate, (data) => progressUpdate(data)),
    // 设置
    commands.registerCommand(Commands.setOnlineSite, async () => {
      const vConfig = workspace.getConfiguration('z-reader');
      const onlineSite = vConfig.get('onlineSite');
      const result = await window.showQuickPick(
        [
          {
            label: '起点'
          },
          {
            label: '笔趣阁'
          }
        ],
        {
          placeHolder: '在线搜索来源网站, 当前设置: ' + onlineSite,
          canPickMany: false
        }
      );
      if (result && result.label) {
        vConfig.update('onlineSite', result.label, true);
      }
    }),
    commands.registerCommand(Commands.setEncoding, async () => {
      const vConfig = workspace.getConfiguration('z-reader');
      const encoding = vConfig.get('encoding', 'utf8');
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
        vConfig.update('encoding', result.label, true);
      }
    }),
    // 注册 TreeView
    window.createTreeView(TREEVIEW_ID, {
      treeDataProvider: treeDataProvider,
      showCollapseAll: true
    })
  );
  // localRefresh();
}

export function deactivate() {
  console.log('eactivate.');
}
