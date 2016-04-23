var url = {};
var osInfo = IPC.sendSync('os-info');
if(osInfo.osType == "Darwin"){
	url.indegsDir = osInfo.homeDir + '/Library/Application Support/Indegs/';
	url.configDir = url.indegsDir + 'config/';
	url.DBDir = url.indegsDir + 'db/';
	url.designDBDir = url.DBDir + 'design/';
	url.mediaDir = url.indegsDir + 'media/';
	url.designDir = url.mediaDir + 'design/';
	url.coverDir = url.mediaDir + 'cover/';
	url.imageDir = url.mediaDir + 'image/';
} else if(osInfo.osType == "Windows_NT"){
	url.indegsDir = osInfo.homeDir + '\\AppData\\Local\\Indegs\\';
	url.configDir = url.indegsDir + 'config\\';
	url.DBDir = url.indegsDir + 'db\\';
	url.designDBDir = url.DBDir + 'design\\';
	url.mediaDir = url.indegsDir + 'media\\';
	url.designDir = url.mediaDir + 'design\\';
	url.coverDir = url.mediaDir + 'cover\\';
	url.imageDir = url.mediaDir + 'image\\';
}

module.exports = {
	osInfo: osInfo,
	indegsDir: url.indegsDir,
	configDir: url.configDir,
	DBDir: url.DBDir,
	designDBDir: url.designDBDir,
	mediaDir: url.mediaDir,
	designDir: url.designDir,
	coverDir: url.coverDir,
	imageDir: url.imageDir,
	indegsJson: url.configDir + 'indegs.json',
	userJson: url.configDir + 'user.json',
	designJson: url.DBDir + 'design.json',
	receiveData: function(url){
 		var self = this;
 		try {
 			var data = fs.readFileSync(url, 'utf8');
 			var res = window.JSON.parse(data);
 			if(res.length == 0){
 				res = null;
 			}
 			return res;
 		} catch(e) {
 			return null;
 		}
 	},
	writeData: function(url,data){
 		var self = this;
 		if(!fs.existsSync(url)){
 			self.mkdirRecursiveSync(self.parseDir(url))
 		};
 		try{
 			fs.writeFileSync(url, JSON.stringify(data, null, 4), 'utf8');
 		} catch(e){
 			console.log(e);
 		}
 	},
 	copyFileSync:function(fromPath,toPath){
 		var self = this;
 		if(!fs.existsSync(toPath)){
 			self.mkdirRecursiveSync(self.parseDir(toPath))
 		}
 		try{
 			fse.copySync(fromPath,toPath)
 		} catch(e) {
 			console.log(e)
 		}
 	},
 	rewriteData:function(url,obj){
 		var self = this;
 		var data = this.receiveData(url);
 		if(data == null){
 			// Json파일이 없을 경우
			var data = [];
			data.push(obj);
			fs.writeFileSync(url,JSON.stringify(data,null,4),'utf8');
 		} else {
			for(var i=0;i<data.length;i++){
				if(data[i].hash == obj.hash){
					data[i] = obj;
					break;
				}
			}
			if(i == data.length){
				data.push(obj)
			}
			fs.writeFileSync(url,JSON.stringify(data,null,4),'utf8');
 		}
 	},
 	deleteAndWriteData:function(url,deleteObj){
 		var data = this.receiveData(url);
 		for(var i=0;i<data.length;i++){
 			if(data[i].hash == deleteObj.hash){
 				data.splice(i,1);
 				break;
 			}
 		}
 		this.writeData(url,data);
 	},
	rewriteWithKey: function(data, reWrtUrl, key){
		var self = this;
		var json = this.receiveData(reWrtUrl);
		if(json instanceof Array){
			for(var i=0;i<json.length;i++){
				if(json[i].hash == data.hash){
					json[i][key] = data[key];
					self.writeData(json, reWrtUrl);
				}
			}
		} else if(json instanceof Object){
			json[key] = data;
			self.writeData(json, reWrtUrl);
		}
	},
	parseDir: function(path){
 		var self = this;
 		var dir = '';
 		if(this.osInfo.osType == "Darwin"){
 			var paths = path.split('/');
 			for(var i=0; i<paths.length-1; i++)
 				dir = dir + paths[i] + '/';
 		} else if(this.osInfo.osType == "Windows_NT"){
 			var paths = path.split('\\');
 			for(var i=0; i<paths.length-1; i++)
 				dir = dir + paths[i] + '\\';
 		}
 		return dir;
 	},
	mkdirRecursiveSync: function(path){
 		var self = this;
 		var paths;
 		var dir = '';
 		if(this.osInfo.osType == "Darwin"){
 			paths = path.split('/');
 			for(var e in paths){
 				dir = dir + paths[e] + '/';
 				if(!fs.existsSync(dir))
 					fs.mkdirSync(dir);
 			}
 		} else{
 			paths = path.split('\\');
 			for(var e in paths){
 				dir = dir + paths[e] + '\\';
 				if(!fs.existsSync(dir))
 					fs.mkdirSync(dir);
 			}
 		}
 	},
 	getDirSize:function(dir){
 		var self = this;
 		var res = {}
 		var size = '';
 		function recursive(dir){
 			var files = fs.readdirSync(dir);
 			files.map(function(file){
	 			if(fs.lstatSync(dir+file).isDirectory()){
	 				recursive(dir+file+'/')
	 			} else {
	 				size = +size + +fs.statSync(dir+file).size;
	 			}
 			})
 			return size;
 		}
 		return recursive(dir)
 	},
	// getDesignPath: function(name,hash){
	// 	var self = this;
	// 	var path = {
	// 		designDir:'',		//Indegs/media/design/[hash]/
	// 		designFile:'',		//Indegs/media/design/[hash]/[name]
	// 		imageDir:'',		//Indegs/media/image/[hash]/
	// 		coverDir:'',		//Indegs/media/cover/[hash]/
	// 		versionJson:''		//Indegs/config/version/[hash]/version.json
	// 	};
	// 	if(this.osInfo.osType == "Darwin"){
	// 		path.designDir = self.designDir + hash + '/';
	// 		path.designFile = path.designDir + name;
	// 		path.imageDir = self.imageDir + hash + '/';
	// 		path.coverDir = self.coverDir + hash + '/';
	// 		path.versionJson = self.versionDir + hash + '.json';
	// 	}  else if(this.osInfo.osType == "Windows_NT"){
	// 		path.designDir = self.designDir + hash + '\\';
	// 		path.designFile = path.designDir + name;
	// 		path.imageDir = self.imageDir + hash + '\\';
	// 		path.coverDir = self.coverDir + hash + '\\';
	// 		path.versionJson = self.versionDir + hash + '.json';
	// 	}
	// 	return path;
	// },
	getDesignPath:function(hash){
		var self = this;
		var path = {
			designDir:'',		//Indegs/media/design/[hash]/
			imageDir:'',		//Indegs/media/image/[hash]/
			coverDir:'',		//Indegs/media/cover/[hash]/
		};
		if(this.osInfo.osType == "Darwin"){
			path.designDir = self.designDir + hash + '/';
			path.imageDir = self.imageDir + hash + '/';
			path.coverDir = self.coverDir + hash + '/';
		}  else if(this.osInfo.osType == "Windows_NT"){
			path.designDir = self.designDir + hash + '\\';
			path.imageDir = self.imageDir + hash + '\\';
			path.coverDir = self.coverDir + hash + '\\';
		}
		return path;
	},
	getDBPath:function(hash){
		var self = this;
		var path = {
			designJson:'',
			versionJson:'',
		}
		path.versionJson = self.designDBDir + hash + '.json';

		return path;
	},
	getVersionJson:function(parentHash){
		var self = this;
		return self.versionDir + parentHash + '.json';
	},
	getTitle:function(design){
		var title = design.name.slice(0,design.name.length - (design.ext.length+1));
		return title;
	},
	getExtension:function(path){
		var split = path.split('.');
		var ext = split[split.length-1];
		return ext;
	},
	getParsedDate:function(date){
		var date = new Date(date);
		var res = {};
		var AP;
		var hour = date.getHours();
		var minute = date.getMinutes();
		if(hour==0){
			hour = 12;
			AP = 'AM';
		} else if(hour>12){
			hour = (hour-12)
			AP = 'PM';
		} else if(hour<12){
			hour = hour;
			AP = 'AM';
		} else if(hour==12){
			hour = hour;
			AP = 'PM'
		};

		if(minute<10){
			minute = '0' + minute;
		}

		switch((date.getMonth()+1).toString()){
			case '1':
				res.month = 'Jan'
				break;
			case '2':
				res.month = 'Feb'
				break;
			case '3':
				res.month = 'Mar'
				break;
			case '4':
				res.month = 'Apr'
				break;
			case '5':
				res.month = 'May'
				break;
			case '6':
				res.month = 'Jun'
				break;
			case '7':
				res.month = 'Jul'
				break;
			case '8':
				res.month = 'Aug'
				break;
			case '9':
				res.month = 'Sept'
				break;
			case '10':
				res.month = 'Oct'
				break;
			case '11':
				res.month = 'Nov'
				break;
			case '12':
				res.month = 'Dec'
				break;
			default:
				return true;
		}
		res.day = (date.getDate()).toString();
		res.minute = minute;
		res.hour = hour;
		res.AP = AP;
		return res;
	}
}