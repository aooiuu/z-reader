import { open } from '../utils/index';
import { store } from '../utils/store';
import { window, workspace } from 'vscode';
import { readerDriver } from '../reader';
import { TreeNode } from '../explorer/TreeNode';
import { explorerNodeManager } from '../explorer/explorerNodeManager';
import { treeDataProvider } from '../explorer/treeDataProvider';
import { previewProvider } from '../webview/PreviewProvider';
import { TemplatePath } from '../config';
import { readerManager } from '../ReaderManager';
import * as config from '../utils/config';
import { Notification } from '../utils/Notification';

export const openReaderWebView = function (treeNode: TreeNode) {
  readerDriver.getContent(treeNode).then(function (data: string) {
    previewProvider.show(data, treeNode);
  });
};

export const localRefresh = async function () {
  const notification = new Notification('加载本地小说');
  try {
    const treeNode: TreeNode[] = await explorerNodeManager.getAllBooks();
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};

export const openLocalDirectory = function () {
  open(readerDriver.getFileDir());
};

const _searchOnline = async function (msg: string) {
  const notification = new Notification(`搜索: ${msg}`);
  try {
    const vConfig = workspace.getConfiguration('z-reader');
    const onlineSite: string = vConfig.get('onlineSite', '起点');
    const treeNode = await readerDriver.search(msg, onlineSite);
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};

export const searchOnline = async function () {
  try {
    const msg = await window.showInputBox({
      password: false,
      ignoreFocusOut: false,
      placeHolder: '请输入小说的名字',
      prompt: ''
    });
    if (msg) {
      _searchOnline(msg);
    }
  } catch (error) {
    console.warn(error);
  }
};

export const editTemplateHtml = function () {
  openTextDocument(store.extensionPath + TemplatePath.templateHtml);
};

export const editTemplateCss = function () {
  openTextDocument(store.extensionPath + TemplatePath.templateCss);
};

const openTextDocument = function (path: string) {
  workspace.openTextDocument(path).then((res) => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

export const goProgress = function () {
  window
    .showInputBox({
      password: false,
      ignoreFocusOut: false,
      placeHolder: '请输入进度: 0-100',
      validateInput: (text: string) => (/^\d+(\.\d+)?$/.test(text) ? undefined : '请输入数字')
    })
    .then((msg: any) => {
      previewProvider.postMessage({
        command: 'goProgress',
        data: {
          progress: Number(msg) * 0.01
        }
      });
    });
};

export const progressUpdate = function (data: any) {
  console.log('progressUpdate:', data.progress);
  readerManager.emit('StatusbarUpdateStatusBar', (data.progress * 100).toFixed(2) + '%');
  const treeNode = previewProvider.getTreeNode();
  if (treeNode && treeNode.type === '.txt' && typeof treeNode.path === 'string') {
    config.set(treeNode.path, 'progress', data.progress);
  }
};
