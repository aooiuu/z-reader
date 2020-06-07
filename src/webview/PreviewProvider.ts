import { commands, ViewColumn } from 'vscode';
import { Webview } from './Webview';
import { IWebviewOption, IWebViewMessage } from '../@types';
import { Commands, WebViewMessage } from '../config';
import { TreeNode } from '../explorer/TreeNode';

class PreviewProvider extends Webview {
  private node = '';
  private treeNode?: TreeNode;

  public show(node: string, treeNode: TreeNode): void {
    this.node = node;
    this.treeNode = treeNode;
    this.showWebviewInternal();
  }
  public getTreeNode() {
    return this.treeNode;
  }

  protected getWebviewContent(): string {
    return this.node;
  }
  protected getWebviewOption(): IWebviewOption {
    return {
      title: 'Reader',
      viewColumn: ViewColumn.Active
    };
  }
  protected async onDidReceiveMessage(message: IWebViewMessage): Promise<void> {
    console.log('onDidReceiveMessage:', message);
    switch (message.command) {
      case WebViewMessage.editStyle: {
        commands.executeCommand(Commands.editTemplateCss);
        break;
      }
      case WebViewMessage.editHtml: {
        commands.executeCommand(Commands.editTemplateHtml);
        break;
      }
      case WebViewMessage.goProgress: {
        commands.executeCommand(Commands.goProgress);
        break;
      }
      case WebViewMessage.progressUpdate: {
        commands.executeCommand(Commands.progressUpdate, message.data);
        break;
      }
    }
  }
}

export const previewProvider: PreviewProvider = new PreviewProvider();
