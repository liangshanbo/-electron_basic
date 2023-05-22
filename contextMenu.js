const { dialog, Menu } = require('electron');

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Electron',
        submenu: [
            { 
                label: 'Greet', 
                click: () => {
                    dialog.showMessageBox({
                        title: 'Message Box',
                        message: 'Place select an option',
                        detail: 'Message detail.',
                        buttons: ['Yes', 'No']
                    }).then(result => {
                        console.log('result', result);
                    })
                },
                // 快捷键
                accelerator: 'Shift + Alt + G'
            },
            { label: 'submenu_2' }
        ]
    },
    {
        label: '编辑',
        submenu: [
            { label: '撤销', role: 'undo' },
            { label: '恢复', role: 'redo' },
            { label: '剪切', role: 'cut' },
            { label: '复制', role: 'copy' },
            { label: '粘贴', role: 'paste' },
        ]
    },
    {
        label: '查看',
        submenu: [
            { label: '全屏', role: 'toggleFullScreen', },
            { label: 'submenu_2' }
        ]
    },
]);

module.exports = contextMenu;