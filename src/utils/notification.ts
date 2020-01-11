import { ProgressLocation, ProgressOptions, window } from 'vscode';

export default class {
  private status: boolean = false;
  private options: ProgressOptions = {
    location: ProgressLocation.Notification,
    title: 'loding...'
  };
  constructor(options: ProgressOptions | any) {
    this.options = { ...this.options, ...options };
  }
  async start() {
    window.withProgress(this.options, async () => {
      await new Promise(resolve => {
        setInterval(() => {
          if (this.status) {
            resolve();
          }
        }, 500);
      });
    });
  }
  stop() {
    this.status = true;
  }
}
