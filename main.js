const path = require('path');
const { app, BrowserWindow, ipcMain, dialog, globalShortcut, Menu } = require('electron');
const  createTray = require('./tray');
const initMenu = require('./menu.js');
const contextMenu = require('./contextMenu');

console.log('initMenu', initMenu);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        // show: false,
        webPreferences: {
            preload: path.resolve(__dirname, './preload.js')
        }
    })
    createTray(win);
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })

    // win.once('ready-to-show', () => {
    //     win.show();
    // })

    win.webContents.on('dom-ready', () => {
        console.log('ready')
    })

    win.webContents.on('context-menu', () => {
        contextMenu.popup();
    })

    win.webContents.on('did-finish-load', () => {
        console.log('finished');
        // dialog1 选择文件弹窗
        // dialog.showOpenDialog({
        //     buttonLabel: '选择',
        //     defaultPath: app.getPath('desktop'),
        //     properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory']
        // }).then(result => {
        //     console.log('result', result);
        // })

        // dialog2 信息提示弹窗
        // dialog.showMessageBox({
        //     title: 'Message Box',
        //     message: 'Place select an option',
        //     detail: 'Message detail.',
        //     buttons: ['Yes', 'No', 'Maybe']
        // }).then(result => {
        //     console.log('result', result);
        // })
        // dialog3 保存文件弹窗
        // dialog.showSaveDialog({}).then(result => {
        //     console.log(result);
        // })

        // globalShortcut.register('G', () => {
        //     console.log('User Pressed G')
        // })

        globalShortcut.register('CommandOrControl+Y', () => {
            console.log('User Pressed CommandOrControl+Y')
            globalShortcut.unregister('CommandOrControl+Y');
        })

    })

    // win.loadFile('./index.html');
    win.loadURL('http://jx.1000phone.net');
    // win.loadURL('https://github.com/');
    // 打开开发者工具
    // win.webContents.openDevTools();

    // // 创建第二个窗口
    // const win2 = new BrowserWindow({
    //     width: 600,
    //     height: 400,
    //     show: false,
    //     parent: win, // 定义父窗口
    //     // modal: true  // 锁定在主窗口
    // })
    // win2.loadURL('https://www.baidu.com');

    // setTimeout(() => {
    //     win2.show();
    // }, 2000);

    initMenu();
}

app.on('window-all-closed', () => {
    // 对于MacOS系统，关闭窗口时不会直接退出应用
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

app.whenReady().then(() => {
    createWindow();
    // 对于MacOS系统，当全部窗口关闭，点击 dock 图标，窗口再次打开
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })

    app.on('browser-window-blur', (e) => {
        console.log('App unfocused')
        e.preventDefault()
    })

    app.on('browser-window-focus', (e) => {
        console.log('App focused')
        e.preventDefault()
    })

    console.log(app.getPath('desktop'));
    console.log(app.getPath('music'));
    console.log(app.getPath('temp'));

});