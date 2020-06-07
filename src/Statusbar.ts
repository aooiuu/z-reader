import { StatusBarItem, StatusBarAlignment, Disposable, window } from 'vscode';
import { readerManager } from './ReaderManager';

class Statusbar implements Disposable {
  private statusBar: StatusBarItem;

  constructor() {
    this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    this.updateStatusBar(`z-reader`);
    this.statusBar.show();
    readerManager.on('StatusbarUpdateStatusBar', (arg) => this.updateStatusBar(arg));
  }

  public dispose(): void {
    this.statusBar.dispose();
  }

  public updateStatusBar(text: string) {
    this.statusBar.text = `📘 ` + text;
  }
}

export const statusbar = new Statusbar();
