// 使用预加载脚本来安全地将特权 API 暴露至渲染进程中。
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', { 
    platform: process.platform,
    setTitle: (title) => ipcRenderer.send('set-title', title),
});