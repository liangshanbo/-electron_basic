const { Tray } = require('electron');

function createTray(win) {
    const tray = new Tray('icon.jpg');
    tray.setToolTip('我的第一个Electron应用'); 
    tray.on('click', (e) => {
        console.log('tray click');
        win.show();
    })
}

module.exports = createTray;