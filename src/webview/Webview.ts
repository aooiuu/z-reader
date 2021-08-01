import { ConfigurationChangeEvent, Disposable, WebviewPanel, window, workspace } from 'vscode';
import { IWebviewOption, IWebViewMessage } from '../@types';

export abstract class Webview implements Disposable {
  protected readonly viewType: string = 'zReader.webview';
  protected panel: WebviewPanel | undefined;
  private listeners: Disposable[] = [];

  public dispose(): void {
    // if (this.panel) {
    //   this.panel.dispose();
    // }
    this.panel = undefined;
    for (const listener of this.listeners) {
      listener.dispose();
    }
    this.listeners = [];
  }

  protected showWebviewInternal(): void {
    const { title, viewColumn, preserveFocus } = this.getWebviewOption();
    if (!this.panel) {
      this.panel = window.createWebviewPanel(
        this.viewType,
        title,
        { viewColumn, preserveFocus },
        {
          enableScripts: true,
          enableCommandUris: true,
          enableFindWidget: true,
          retainContextWhenHidden: true
        }
      );
      this.panel.onDidDispose(this.onDidDisposeWebview, this, this.listeners);
      // 通过使用侦听器函数作为参数调用事件来表示您要订阅的事件的函数。
      this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, this, this.listeners);
      // 通过使用侦听器函数作为参数调用事件来表示您要订阅的事件的函数。
      workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.listeners);
    } else {
      this.panel.title = title;
    }
    this.panel.webview.html = this.getWebviewContent();
  }
  protected onDidDisposeWebview(): void {
    this.panel = undefined;
    for (const listener of this.listeners) {
      listener.dispose();
    }
    this.listeners = [];
  }

  public postMessage(iWebViewMessage: IWebViewMessage) {
    if (!this.panel) {
      return;
    }
    this.panel.webview.postMessage(iWebViewMessage);
  }

  protected async onDidChangeConfiguration(event: ConfigurationChangeEvent): Promise<void> {
    if (this.panel && event.affectsConfiguration('markdown')) {
      this.panel.webview.html = this.getWebviewContent();
    }
  }
  protected abstract onDidReceiveMessage(message: IWebViewMessage): Promise<void>;
  protected abstract getWebviewOption(): IWebviewOption;
  protected abstract getWebviewContent(): string;
}
