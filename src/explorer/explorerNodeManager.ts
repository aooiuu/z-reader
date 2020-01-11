import { Disposable, Position } from 'vscode';
import { TreeNode } from './TreeNode';
import { getLocalBooks, getChapter, hasChapter, getAllBooks } from '../reader';

class ExplorerNodeManager implements Disposable {
  public treeNode: TreeNode[] = [];

  public getChildren(): TreeNode[] {
    return this.treeNode;
  }
  public getAllBooks(): Promise<TreeNode[]> {
    return new Promise(resolve => {
      getAllBooks().then((treeNode: TreeNode[]) => {
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
    return getChapter(treeNode);
  }
  public dispose(): void {
    this.treeNode = [];
  }
}

export const explorerNodeManager: ExplorerNodeManager = new ExplorerNodeManager();
