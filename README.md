<h1 align="center">📚 z-reader</h1>

[![Version](https://vsmarketplacebadge.apphb.com/version-short/aooiu.z-reader.svg)](https://marketplace.visualstudio.com/items?itemName=aooiu.z-reader) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/aooiu.z-reader.svg)](https://marketplace.visualstudio.com/items?itemName=aooiu.z-reader) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/aooiu.z-reader.svg)](https://marketplace.visualstudio.com/items?itemName=aooiu.z-reader) ![stars](https://img.shields.io/github/stars/aooiuu/z-reader) ![forks](https://img.shields.io/github/forks/aooiuu/z-reader) ![release](https://img.shields.io/github/release/aooiuu/z-reader) ![issues](https://img.shields.io/github/issues/aooiuu/z-reader)

> 用来摸鱼或学习的小说阅读插件,支持在线搜索和本地阅读,支持 txt 和 epub 格式

- 📕 仓库地址: [github.com](https://github.com/aooiuu/z-reader)
- 📗 插件地址: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=aooiu.z-reader)
- 📘 更新日志: [CHANGELOG](https://github.com/aooiuu/z-reader/blob/master/CHANGELOG.md)
- 📙 插件不断完善, 欢迎提交 [issues](https://github.com/aooiuu/z-reader/issues)、[pr](https://github.com/aooiuu/z-reader/pulls)、[star](https://github.com/aooiuu/z-reader)

---

## 🎉 功能

- [x] 支持格式:txt、epub
- [x] 支持起点网小说搜索和阅读
- [x] 支持笔趣阁小说搜索和阅读
- [x] 支持侧边栏章节显示(epub、在线)
- [x] 自定义阅读界面的 CSS 和 HTML
- [x] 状态栏进度显示
- [x] 阅读进度自动保存
- [x] 阅读进度跳转
- [x] 自定义 TXT 文件编码

---

## 🎈 预览

![1](https://user-images.githubusercontent.com/28108111/68991070-72f48c00-0895-11ea-92f0-c57e8764c700.png)

![2](https://user-images.githubusercontent.com/28108111/68991071-7556e600-0895-11ea-96ca-f8e6cbaffb1c.gif)

![3](https://user-images.githubusercontent.com/28108111/68991073-7851d680-0895-11ea-975a-52aa9875aeed.gif)

---

## 🚀 升级指南

由于小说目录默认储存在插件目录，所以升级后会不同步旧版本的小说。

同步旧版本小说步骤：

1. `F1` 运行 `z-reader:打开本地文件目录`
2. 找到 `**\.vscode-insiders\extensions` 目录下 `aooiu.z-reader-${版本号}\book`
3. 复制对应版本的文件到当前版本的小说目录里面

v1.0.1 新增设置项 `本地小说目录`, 指定小说目录用于避免升级导致的需要手动同步问题
