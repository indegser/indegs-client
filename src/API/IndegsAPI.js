var Utils = require('../utils/Utils.js');
var IndegsAction = require('../Action/IndegsAction.js');

module.exports={
	initIndegs:function(){
		var self = this;
		Utils.mkdirRecursiveSync(Utils.configDir);
		Utils.mkdirRecursiveSync(Utils.designDBDir);
		Utils.mkdirRecursiveSync(Utils.coverDir);
		Utils.mkdirRecursiveSync(Utils.imageDir);
		Utils.mkdirRecursiveSync(Utils.designDir);
		Utils.mkdirRecursiveSync(Utils.indegsDir+'icon/')
		// IndegsAction.showGuide(true);
	},
	checkIndegs:function(){
		var self = this;
		var json = Utils.receiveData(Utils.indegsJson);
		if(json==null){
			self.initIndegs();
			// IPC.send('imageMagick-initialize','/Applications/Indegs.app/Contents/Resources/icon.png',Utils.indegsDir+'icon/icon.png');
			// self.updateImageMagick(false);
		} else {

		}
	},
	updateImageMagick:function(finish){
		if(finish){
			var data = {initialized:(new Date()).toString()}
			Utils.writeData(data,Utils.indegsJson)
			IndegsAction.updateStatus(true);
			fse.removeSync(Utils.indegsDir+'icon/');
		} else {
			IndegsAction.updateStatus(false)
		}
	},
	handleLogin:function(data,callback){
		var self = this;
		$.ajax({
			url: 'http://indegs.com:3333'+'/users/login',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result){
				if(result.status){
					callback(result.body)
					console.log(result.body)
					// self.updateSession(result.body)
				} else {
					console.log(result.body)
				}
			}
		});
	}
}