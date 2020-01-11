import { open } from '../utils/index';
import { store } from '../utils/store';
import { window, workspace } from 'vscode';
import { getContent, searchQidian as searchQidianHelper } from '../reader';
import { TreeNode } from '../explorer/TreeNode';
import { explorerNodeManager } from '../explorer/explorerNodeManager';
import { treeDataProvider } from '../explorer/treeDataProvider';
import { previewProvider } from '../webview/PreviewProvider';
import { TemplatePath } from '../config';
import { setText as statusbarSetText } from '../statusbar';
import * as config from '../utils/config';

export const openReaderWebView = function(treeNode: TreeNode) {
  getContent(treeNode).then(function(data: string) {
    previewProvider.show(data, treeNode);
  });
};

export const localRefresh = function() {
  explorerNodeManager.getAllBooks().then((treeNode: TreeNode[]) => {
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  });
};

export const openLocalDirectory = function() {
  open(store.booksPath);
};

export const searchQidian = function() {
  return new Promise(function(resolve) {
    window
      .showInputBox({
        password: false,
        ignoreFocusOut: false,
        placeHolder: '请输入小说的名字',
        prompt: ''
      })
      .then((msg: string | undefined) => {
        searchQidianHelper(msg || '').then((TreeNode: TreeNode[]) => {
          treeDataProvider.fire();
          explorerNodeManager.treeNode = TreeNode;
        });
      });
  });
};

export const editTemplateHtml = function() {
  openTextDocument(store.extensionPath + TemplatePath.templateHtml);
};

export const editTemplateCss = function() {
  openTextDocument(store.extensionPath + TemplatePath.templateCss);
};

const openTextDocument = function(path: string) {
  workspace.openTextDocument(path).then(res => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

export const goProgress = function() {
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

export const progressUpdate = function(data: any) {
  console.log('progressUpdate:', data.progress);
  statusbarSetText((data.progress * 100).toFixed(2) + '%');
  const treeNode = previewProvider.getTreeNode();
  if (treeNode) {
    setProgress(treeNode, data.progress);
  }
};

const getProgress = function(treeNode: TreeNode) {
  return config.get(treeNode.path, 'progress');
};
const setProgress = function(treeNode: TreeNode, progress: string) {
  config.set(treeNode.path, 'progress', progress);
};
