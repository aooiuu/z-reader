import * as vscode from 'vscode';
import { TreeNode } from './TreeNode';
import { explorerNodeManager } from './explorerNodeManager';
import { store } from '../utils/store';

class TreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
  // private context: vscode.ExtensionContext;
  private onDidChangeTreeDataEvent: vscode.EventEmitter<TreeNode | undefined | null> = new vscode.EventEmitter<
    TreeNode | undefined | null
  >();
  public readonly onDidChangeTreeData: vscode.Event<any> = this.onDidChangeTreeDataEvent.event;

  public initialize(context: vscode.ExtensionContext): void {
    // this.context = context;
  }

  fire(): void {
    this.onDidChangeTreeDataEvent.fire();
  }

  public getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    // 这里要返回最终显示的
    return {
      label: element.name,
      tooltip: element.name,
      iconPath: '',
      collapsibleState: element.isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None,
      command: !element.isDirectory ? element.previewCommand : undefined
      // contextValue
    };
  }

  public async getChildren(element?: TreeNode | undefined): Promise<TreeNode[]> {
    if (!element) {
      return explorerNodeManager.getChildren();
    }
    return await explorerNodeManager.getChapter(element);
  }
}

export const treeDataProvider: TreeDataProvider = new TreeDataProvider();
