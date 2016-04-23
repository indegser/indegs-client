/* 일반 공통 모듈 */
exports.exec = require('sync-exec');
exports.execAsyn = require('child_process').exec;
exports.spawn = require('child_process').spawn;
exports.os = require('os');

/* Electron 모듈 */
var electron = require('electron');
exports.app = electron.app;
exports.BrowserWindow = electron.BrowserWindow;
exports.Tray = electron.Tray;
exports.Menu = electron.Menu;
exports.MenuItem = electron.MenuItem;
exports.ipc = electron.ipcMain;
exports.Shortcut = electron.globalShortcut;

/* 보안 모듈 */
exports.md5 = require('blueimp-md5').md5;

/* Debug 관련 모듈 */
exports.crashReporter = require('crash-reporter').start();

/* 커스텀 모듈 */