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

  private equalsTreeNode(a: TreeNode, b: TreeNode) {
    return a.path === b.path && a.name === b.name && a.type === b.type;
  }

  // 获取
  public async getChapter(treeNode: TreeNode): Promise<TreeNode[]> {
    const vConfig = workspace.getConfiguration('z-reader');
    const chapterOrder: string = vConfig.get('chapterOrder', '顺序');
    const tNode = this.treeNode.find((e: TreeNode) => this.equalsTreeNode(e, treeNode));
    try {
      const chapters: TreeNode[] = await readerDriver.getChapter(treeNode);
      if (tNode) {
        tNode.children = [...chapters];
      }
      if (chapterOrder === '倒序') {
        chapters.reverse();
      }
      return chapters;
    } catch (error) {
      return [];
    }
  }
  public dispose(): void {
    this.treeNode = [];
  }

  public nextChapter(currentNode: TreeNode): TreeNode | undefined {
    const treeNodes = this.treeNode.map((e) => e.children).filter((e) => e);
    let isFind = false;
    for (let i = 0; i < treeNodes.length; i++) {
      const element = treeNodes[i];
      for (let ii = 0; ii < element.length; ii++) {
        const rowNode = new TreeNode(element[ii]);
        if (isFind) {
          return rowNode;
        }
        if (this.equalsTreeNode(rowNode, currentNode)) {
          isFind = true;
        }
      }
    }
  }

  public lastChapter(currentNode: TreeNode): TreeNode | undefined {
    const treeNodes = this.treeNode.map((e) => e.children).filter((e) => e);
    for (let i = 0; i < treeNodes.length; i++) {
      const element = treeNodes[i];
      for (let ii = 1; ii < element.length; ii++) {
        const rowNode = new TreeNode(element[ii]);
        if (this.equalsTreeNode(rowNode, currentNode)) {
          return new TreeNode(element[ii - 1]);
        }
      }
    }
  }
}

export const explorerNodeManager: ExplorerNodeManager = new ExplorerNodeManager();
