import * as fs from 'fs';

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
