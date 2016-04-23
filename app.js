global.__proto__ = require('./config/module_list');
var env = require('./config/environment');
var IPC = require('./libs/ipc');
var template = require('./libs/template.js');

app.on('ready', function(){
	if(process.platform == 'darwin'){
		ELECTRON.WINDOW = new BrowserWindow({
			width: 1200,
			'min-width':1000,
			height: 600,
			'min-height':600,
			titleBarStyle:'hidden-inset',
			icon:'./images/icon.png'
		});
		// menu = Menu.buildFromTemplate(template);
		// Menu.setApplicationMenu(menu);
		ELECTRON.WINDOW.on('blur',function(event){
			ELECTRON.BLUR = true;
		});
		ELECTRON.WINDOW.on('focus',function(event){
			ELECTRON.BLUR = false;
		});

		ELECTRON.WINDOW.on('close',function(event){
			if(ELECTRON.QUIT){
				app.quit()
			} else {
				if(ELECTRON.BLUR){
					app.quit()
				} else {
					event.preventDefault();
					ELECTRON.WINDOW.hide();
				}
			}
		});
	} else {
		ELECTRON.WINDOW = new BrowserWindow({
			width: 1200,
			'min-width':1000,
			height: 600,
			'min-height':600,
			frame:'false',
			icon:'./images/icon.png'
		});
		if(process.env.NODE_ENV == 'develop')
			ELECTRON.TRAY = new Tray('./icon.png');
		else 
			ELECTRON.TRAY = new Tray(process.resourcesPath + '/app.asar/icon.png');
	}

	app.on('activate', function(e, visible){
		if(visible == false){
			ELECTRON.WINDOW.show();
		}
	});

	
	ELECTRON.WINDOW.loadUrl('file://' + __dirname + '/index/index.html');
	ELECTRON.WINDOW.openDevTools()
});
app.on('window-all-closed', function(){
    if(process.platform != 'darwin')
        app.quit();
});