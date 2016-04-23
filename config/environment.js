var path = require('path');

(function(global){
	global.STATIC = {};
	global.STATIC.PATH = {};

	global.ELECTRON = {};
	global.ELECTRON.WINDOW = null;
	global.ELECTRON.TRAY = null;
	global.ELECTRON.MENU = null;
	global.ELECTRON.QUIT = false;
	global.ELECTRON.BLUR = false;

	global.COMMAND = {}
	global.COMMAND.GIT = "";
	global.COMMAND.IMAGEMAGICK = "";
	global.COMMAND.IDENTIFY = "";
	if(os.type() == "Darwin"){
		if(process.env.NODE_ENV == 'develop'){
			global.COMMAND.GIT = 'bin/git';
			global.COMMAND.IMAGEMAGICK = 'bin/imagemagick/bin/convert';
			global.COMMAND.IDENTIFY = 'bin/imagemagick/bin/identify';
		} else{
			global.COMMAND.GIT = process.resourcesPath + '/bin/git';
			global.COMMAND.IMAGEMAGICK = process.resourcesPath + '/bin/imagemagick/bin/convert';
			global.COMMAND.IDENTIFY = process.resoucesPath + '/bin/imagemagick/bin/identify';
		}
	} else if(os.type() == "Windows_NT"){
		if(process.env.NODE_ENV == 'develop'){
			global.COMMAND.GIT = 'bin\\bin\\git';
			global.COMMAND.IMAGEMAGICK = 'bin\\imagemagick\\convert';
			global.COMMAND.IDENTIFY = 'bin\\imagemagick\\identify';
		} else{
			global.COMMAND.GIT = process.resourcesPath + '\\bin\\bin\\git';
			global.COMMAND.IMAGEMAGICK = process.resourcesPath + '\\bin\\imagemagick\\convert';
			global.COMMAND.IDENTIFY = process.resourcesPath + '\\bin\\imagemagick\\identify';
		}
	}
})(global);