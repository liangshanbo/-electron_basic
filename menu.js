const { dialog, Menu } = require('electron');

function initMenu() {
    const mainMenu = Menu.buildFromTemplate([
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
            label: '文件',
            submenu: [
                { label: 'submenu_1' },
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
            label: '选择',
            submenu: [
                { label: 'submenu_1' },
                { label: 'submenu_2' }
            ]
        },
        {
            label: '查看',
            submenu: [
                { label: '全屏', role: 'toggleFullScreen', },
                { label: 'submenu_2' }
            ]
        },
        {
            label: '调试',
            submenu: [
                { label: 'submenu_1' },
                { label: 'submenu_2' }
            ]
        },
        {
            label: '窗口',
            submenu: [
                { label: 'submenu_1' },
                { label: 'submenu_2' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                { label: 'submenu_1' },
                { label: 'submenu_2' }
            ]
        },
    ]);
    Menu.setApplicationMenu(mainMenu);
}

module.exports = initMenu;