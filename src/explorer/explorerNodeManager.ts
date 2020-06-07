import { Disposable } from 'vscode';
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
    return readerDriver.getChapter(treeNode);
  }
  public dispose(): void {
    this.treeNode = [];
  }
}

export const explorerNodeManager: ExplorerNodeManager = new ExplorerNodeManager();
