import { ProgressLocation, ProgressOptions, window } from 'vscode';

export class Notification {
  private isStop = false;
  private options: ProgressOptions = {
    location: ProgressLocation.Notification,
    title: 'loding...'
  };

  constructor(title?: string) {
    if (title) {
      this.options.title = title;
    }
    this.start();
  }

  async start() {
    this.isStop = false;
    window.withProgress(this.options, async () => {
      await new Promise((resolve) => {
        setInterval(() => {
          if (this.isStop) {
            resolve(1);
          }
        }, 500);
      });
    });
  }

  stop() {
    this.isStop = true;
  }
}

export function showNotification(tip?: string, timer?: number) {
  const notification = new Notification(tip);
  if (timer) {
    setTimeout(() => {
      notification.stop();
    }, timer);
  }
}

export function showWarningMessage(tip: string) {
  window.showWarningMessage(tip);
}
