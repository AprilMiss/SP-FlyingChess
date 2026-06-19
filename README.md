# SP飞行棋 PWA 离线手机版

## 使用方式

### 电脑测试
用 VS Code Live Server 或任意本地服务器打开 index.html。

### Android 手机上离线玩
1. 把整个文件夹上传到 GitHub Pages / Netlify / Vercel，或先用局域网服务器打开。
2. 用 Chrome 打开网址。
3. 菜单 → 添加到主屏幕。
4. 首次打开并加载完成后，即可离线使用。

### iPhone
1. 用 Safari 打开部署后的网址。
2. 分享 → 添加到主屏幕。
3. 首次打开并加载完成后，即可离线使用。

## 新增内容
- manifest.json
- service-worker.js
- assets/icon-192.png
- assets/icon-512.png
- js/pwa.js
- css/mobile.css
- 已在 index.html 中接入 PWA
- 手机横屏适配
- 棋盘自动缩放按钮
- 基础音效开关
- 离线缓存
