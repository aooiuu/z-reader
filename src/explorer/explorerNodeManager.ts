import { Disposable, workspace } from 'vscode';
import { TreeNode } from './TreeNode';
import { readerDriver } from '../reader';

class ExplorerNodeManager implements Disposable {
  public treeNode: TreeNode[] = [];

  public getChildren(): TreeNode[] {
    return this.treeNode;
  }
  public getAllBooks(): Promise<TreeNode[]> {
    return new Promise((resolve) => {
      readerDriver.getAllBooks().then((treeNode: TreeNode[]) => {
        this.treeNode = treeNode;
        resolve(this.treeNode);
      });
    });
  }

  public setTreeNode(treeNode: TreeNode[]) {
    this.treeNode = treeNode;
  }

  // 获取
  public getChapter(treeNode: TreeNode): Promise<TreeNode[]> {
    const vConfig = workspace.getConfiguration('z-reader');
    const chapterOrder = vConfig.get('chapterOrder', '顺序');
    return readerDriver.getChapter(treeNode).then(chapters => {
      if (chapterOrder === '顺序') {
        return chapters;
      } else {
        return chapters.reverse();
      }
    });
  }
  public dispose(): void {
    this.treeNode = [];
  }
}

export const explorerNodeManager: ExplorerNodeManager = new ExplorerNodeManager();
