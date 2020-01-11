import { StatusBarItem } from 'vscode';

export let statusBarItem: StatusBarItem;

export const setText = function(text: string) {
  statusBarItem.text = `📘 ` + text;
};

export const setStatusBarItem = function(sBI: StatusBarItem) {
  statusBarItem = sBI;
};
