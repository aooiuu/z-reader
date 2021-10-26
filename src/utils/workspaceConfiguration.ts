import * as vscode from 'vscode';

export default function () {
  return vscode.workspace.getConfiguration('z-reader');
}
