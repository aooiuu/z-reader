import * as fs from 'fs';
import { TextEncoder } from 'util';
import { Uri, workspace } from 'vscode';
import { store } from './store';

export function get(path: string, key: string) {
  const ConfPath = path + '.config.json';
  const isExists = fs.existsSync(ConfPath);
  let setting;
  if (isExists) {
    setting = JSON.parse(fs.readFileSync(ConfPath, 'utf-8'));
  } else {
    return false;
  }
  return setting[key];
}

export function set(path: string, key: string, value: string) {
  const newPath = path + '.config.json';
  const isExists = fs.existsSync(newPath);
  let setting;
  if (isExists) {
    setting = JSON.parse(fs.readFileSync(newPath, 'utf-8'));
  } else {
    setting = {};
  }
  setting[key] = value.toString();
  fs.writeFileSync(newPath, JSON.stringify(setting));
}

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function Utf8ArrayToStr(array: Uint8Array) {
  let out, i, c;
  let char2, char3;

  out = "";
  const len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
  }
  }

  return out;
}

export function getConfigFile(path: string): Uri {
  return Uri.joinPath(store.globalStorageUri, path + '.config.json')
}

export function getConfig(path: string, defaultVal: any = false): Promise<any> {
  return new Promise((resolve, reject) => {
    workspace.fs.readFile(Uri.joinPath(store.globalStorageUri, path + '.config.json')).then((data) => {
      const dataString = Utf8ArrayToStr(data);
      try {
        const json = JSON.parse(dataString);
        resolve(json);
      } catch (error) {
        resolve(defaultVal);
      }
    }, () => {
      resolve(defaultVal)
    })
  })
}

export function setConfig(path: string, value: any) {
  return new Promise((resolve, reject) => {
    const encoder = new TextEncoder();
    workspace.fs.writeFile(Uri.joinPath(store.globalStorageUri, path + '.config.json'), encoder.encode(JSON.stringify(value))).then(() => {
      resolve(true);
    }, () => {
      resolve(false);
    })
  })
}