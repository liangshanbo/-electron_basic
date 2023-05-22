# 1、Electron简介
Electron 基于 Chromium 和 Node.js，让你可以使用HTML、CSS和Javascript 构建应用。Electron 兼容 Mac、Windows和Linux，可以构建出三个平台的应用程序。
# 2、Electron初探
## 2.1、初始化项目
```
npm i electron nodemon -D

// main.js
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
    });
    // 在Electron中，各个窗口显示的内容可以是本地HTML文件，也可以是一个远程url。
    win.loadURL('http://jx.1000phone.net');
    // 加载本地HTML文件
    // win.loadFile('index.html');
}
// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 您可以通过使用 app.whenReady() API来监听此事件。 在
// whenReady()成功后调用 createWindow()。 
app.whenReady().then(createWindow);

// package.json
// 执行期间，Electron 将依据应用中 package.json配置下main字段中配置的值查找此文件，您应该已在应用脚手架步骤中配置。
"main": "main.js",
 "scripts": {
     // 此脚本将告诉 Electron 在您项目根目录运行
    "start": "nodemon --exec electron ."
 },
```
# 3、Electron 核心概念
## 3.1、Election 主进程和渲染进程
主进程：启动项目试运行的 main.js 脚本就是我们说的主进程。它运行在一个完整的Node.js环境中，负责控制您应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程。主进程只有一个。
渲染进程：每个 Electron 的页面都在运行着自己的进程，这样的进程称之为渲染进程（基于 Chromium的多进程结构）。
主进程使用 BrowserWindow 创建实例，主进程销毁后，对应的渲染进程会被终止。主进程与渲染进程通过 IPC 方式（事件驱动）进行通信。
## 3.2、主进程事件生命周期
```
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
    });
    win.loadURL('http://jx.1000phone.net');
}
app.whenReady().then(createWindow);
// 
app.on('window-all-closed', () => {
    console.log(100);
});
```
## 3.3、渲染进程如何使用Node模块
### 3.3.1、通过webPreferences/nodeIntegration 实现
```
const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false        
    }
});
```
### 3.3.2、通过webPreferences/preload 实现
使用预加载脚本来安全地将特权 API 暴露至渲染进程中。Electron 的主进程是一个拥有着完全操作系统访问权限的 Node.js 环境。出于安全原因，渲染进程默认跑在网页页面上，而非 Node.js里。为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本。
BrowserWindow 的预加载脚本运行在具有 HTML DOM 和 Node.js、Electron API 的有限子集访问权限的环境中。
预加载脚本包含在浏览器窗口加载网页之前运行的代码。 其可访问 DOM 接口和 Node.js 环境，并且经常在其中使用 
contextBridge 接口将特权接口暴露给渲染器。
```
// 主进程
const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
        // 在启动应用时在渲染进程里预加载js
        preload: path.resolve(__dirname, './preload.js')
    }
})

// preload.js
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('myAPI', { platform: process.platform });

// 渲染进程 -> app.js
console.log(window.myAPI.platform);
```
# 4、主进程和渲染进程通信 
使用 ipcMain 和 ipcRender 实现通信。
```
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('versions', {  
    ping: () => ipcRenderer.invoke('ping'),  // 能暴露的不仅仅是函数，我们还可以暴露变量
})
```
```
// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  ipcMain.handle('ping', () => 'pong')
  win.loadFile('index.html')
}
app.whenReady().then(createWindow)
```
```
//renderer.js
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}

func()
```