var name = require('electron').app.getName();
var template = [
    {
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {   type: 'separator'   },
            {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                role: 'hideothers'
            },
            {   type: 'separator'   },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { ELECTRON.QUIT=true;app.quit(); }
            },
        ]
    },
  //   {
  //   label: 'Edit',
  //   submenu: [
  //     {
  //       label: 'Undo',
  //       accelerator: 'CmdOrCtrl+Z',
  //       role: 'undo'
  //     },
  //     {
  //       label: 'Redo',
  //       accelerator: 'Shift+CmdOrCtrl+Z',
  //       role: 'redo'
  //     },
  //     {
  //       type: 'separator'
  //     },
  //     {
  //       label: 'Cut',
  //       accelerator: 'CmdOrCtrl+X',
  //       role: 'cut'
  //     },
  //     {
  //       label: 'Copy',
  //       accelerator: 'CmdOrCtrl+C',
  //       role: 'copy'
  //     },
  //     {
  //       label: 'Paste',
  //       accelerator: 'CmdOrCtrl+V',
  //       role: 'paste'
  //     },
  //     {
  //       label: 'Select All',
  //       accelerator: 'CmdOrCtrl+A',
  //       role: 'selectall'
  //     },
  //   ]
  // },
  //   {
  //   label: 'View',
  //   submenu: [
  //     {
  //       label: 'Reload',
  //       accelerator: 'CmdOrCtrl+R',
  //       click: function(item, focusedWindow) {
  //         if (focusedWindow)
  //           focusedWindow.reload();
  //       }
  //     },
  //     {
  //       label: 'Toggle Full Screen',
  //       accelerator: (function() {
  //         if (process.platform == 'darwin')
  //           return 'Ctrl+Command+F';
  //         else
  //           return 'F11';
  //       })(),
  //       click: function(item, focusedWindow) {
  //         if (focusedWindow)
  //           focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
  //       }
  //     },
  //     {
  //       label: 'Toggle Developer Tools',
  //       accelerator: (function() {
  //         if (process.platform == 'darwin')
  //           return 'Alt+Command+I';
  //         else
  //           return 'Ctrl+Shift+I';
  //       })(),
  //       click: function(item, focusedWindow) {
  //         if (focusedWindow)
  //           focusedWindow.toggleDevTools();
  //       }
  //     },
  //   ]
  // },
    {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'hide'
            },
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'Visit Indegs.com',
                click: function() { require('electron').shell.openExternal('http://indegs.com') }
            },
        ]
    },
];

module.exports = template;