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
import { Notification } from '../utils/notification';
import request from '../utils/request';
import * as path from 'path';

const showNotification = function (tip?: string, timer?: number) {
  const notification = new Notification(tip);
  if (timer) {
    setTimeout(() => {
      notification.stop();
    }, timer);
  }
};

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

export const collectRefresh = async function () {
  const notification = new Notification('加载收藏列表');
  try {
    const treeNode: TreeNode[] = [];
    const list = await config.getConfig('__collect_list', []);
    console.log('__collect_list', list);
    list.forEach((v: any) => {
      treeNode.push(new TreeNode(v));
    });

    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};

export const editCollectList = function () {
  workspace.openTextDocument(config.getConfigFile('__collect_list')).then((res) => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

export const collectBook = async function (treeNode: TreeNode) {
  try {
    const list = await config.getConfig('__collect_list', []);
    console.log(treeNode);
    let isExists = false;
    for (let i = 0; i < list.length; i++) {
      if (treeNode.path === list[i].path && treeNode.type === list[i].type) {
        isExists = true;
        break;
      }
    }
    if (isExists) {
      showNotification('已收藏该书', 1000);
      return;
    }
    list.push(treeNode.data);
    await config.setConfig('__collect_list', list);
    showNotification('收藏成功', 1000);
  } catch (error) {
    console.log(error);
  }
};

export const cancelCollect = async function (treeNode: TreeNode) {
  const list = await config.getConfig('__collect_list', []);
  let bookIndex = null;
  for (let i = 0; i < list.length; i++) {
    if (treeNode.path === list[i].path && treeNode.type === list[i].type) {
      bookIndex = i;
      break;
    }
  }
  if (bookIndex !== null) {
    list.splice(bookIndex, 1);
  }
  await config.setConfig('__collect_list', list);
  showNotification('取消收藏成功', 1000);
};

export const clearCollect = async function () {
  await config.setConfig('__collect_list', []);
  showNotification('清空收藏成功', 1000);
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
  const msg = await window.showInputBox({
    password: false,
    ignoreFocusOut: false,
    placeHolder: '请输入小说的名字',
    prompt: ''
  });
  if (msg) {
    _searchOnline(msg);
  }
};

export const editTemplateHtml = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateHtml));
};

export const editTemplateCss = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateCss));
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

// 上一个章节
export const lastChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.lastChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有上一章了~', 1000);
  }
};
// 下一个章节
export const nextChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.nextChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有下一章了~', 1000);
  }
};

// 重新加载cookie
export const reLoadCookie = function () {
  request.reLoadCookie();
  showNotification('重新加载cookie完成~', 1000);
};
