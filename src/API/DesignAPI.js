import Utils from '../utils/Utils'; 

// API
var VersionAPI = require('./VersionAPI.js');

// Action
import DesignAction from '../Action/DesignAction';
import DesignStore from '../Store/DesignStore';

import Files from '../utils/Files';


// API를 작성하는 법칙
// 1.ImageMagick이나 Git을 다 하고, 콜백을 받았을 때 데이터를 Json에 저장한다
// 2. receiveDesign으로 받자마자 바로 DesignAction으로 보낼 수 있도록 파라미터를 잘 조정한다


IPC.on('cover-end',function(event,design){
	var API = module.exports;
	DesignAction.updateDesign(design)
});

IPC.on('image-end',function(event,design){
	var API = module.exports;
	API.git(design);
});

IPC.on('git-end',function(event,design,hash){
	var API = module.exports;
	VersionAPI.createVersion(design,hash);
	API.writeDesign(design);
	API.addWatcher(design.path);
});

IPC.on('checkout-hash-finish',function(event,version){
	var API = module.exports;

	// 파일을 옮길 것이기 때문에 Watcher를 제거한다
	API.removeWatcher(version.parent.path);

	VersionAPI.checkoutMaster(version);
});

IPC.on('checkout-master-finish',function(event,version){
	VersionAPI.checkoutMasterFinish(version)
});

IPC.on('revert-commit-end',function(event,version,hash){
	var API = module.exports;
	var design = DesignStore.getDesignByPath(version.parent.path);
	design.cover = version.cover;
	design.image = version.image;
	design.size = version.size;
	design.width = version.width;
	design.height = version.height;
	design.mDate = version.mDate;
	design.version = version.name;
	VersionAPI.revertFinish(version,hash);
	DesignAction.updateDesign(design);
	API.writeDesign(design);
	API.addWatcher(design.path);
});



module.exports={
	initWatcher:function(){
		var self = this;

		this.watcher = chokidar.watch('file, dir, or glob', {persistent: true
		});

		// 파일의 변화 감지
		this.watcher.on('change',function(path){
			self.removeWatcher(path);
			var design = DesignStore.getDesignByPath(path);
			self.updateDesign(design);

		});

		// 파일 유실 감지
		this.watcher.on('unlink',function(path){
			self.removeWatcher(path);
			var design = DesignStore.getDesignByPath(path);
			self.checkDesign(design);
		});
	},
	addWatcher:function(path){
		this.watcher.add(path);
	},
	removeWatcher:function(path){
		this.watcher.unwatch(path);
	},
	receiveDesigns:function(){
		var self = this;
		self.initWatcher();
		var designJson = Utils.designJson;
		var data = Utils.receiveData(designJson);
		if(data != null){
			DesignAction.receiveDesigns(data);
			for(var i=0; i<data.length; i++){
				self.checkDesign(data[i]);
			}
		} else {
			return null;
		}
	},
	checkDesign:function(design){
		var self = this;
		if(fs.existsSync(design.path)){
			self.addWatcher(design.path);
		} else {
			// 링크가 유실된 경우 디자인을 업데이트한다
			design.status = false;
			DesignAction.updateDesign(design);
		}
	},
	linkDesign:function(obj,design){
		var self = this;
		var newDesign = design.constructor();
		for(var attr in design){
			if(design.hasOwnProperty(attr))	newDesign[attr] = design[attr];
		}
		newDesign.status = 'tracking';
		newDesign.name = obj.name;
		newDesign.path = obj.path;
		newDesign.size = obj.size;
		newDesign.width = obj.width;
		newDesign.height = obj.height;
		newDesign.hash = IPC.sendSync('hash-gen', newDesign.path);
		newDesign.mDate = obj.mdate.toString();
		newDesign.counter = +design.counter + +1;

		var path = Utils.getDesignPath(design.name,design.hash);
		var newPath = Utils.getDesignPath(newDesign.name,newDesign.hash);

		fse.copySync(path.designDir,newPath.designDir);
		fse.copySync(path.coverDir,newPath.coverDir);
		fse.copySync(path.imageDir,newPath.imageDir);
		fse.removeSync(path.designDir);
		fse.removeSync(path.coverDir);
		fse.removeSync(path.imageDir);
		fse.removeSync(newPath.designDir + design.name);
		fse.copySync(newDesign.path,newPath.designDir+newDesign.counter+'.'+obj.ext);
		VersionAPI.linkVersion(newDesign,design);
		var twoDesign = {design:design,newDesign:newDesign};
		DesignAction.linkDesign(twoDesign);
		self.imageMagick(newDesign)
	},
	updateDesign:function(design){
		var self = this;

		// 일단 NowWorking에 넣어준다
		DesignAction.updateNowWorking(design);

		var stats = fs.statSync(design.path);
		var path = Utils.getDesignPath(design.hash);

		design.version = +design.version + +1;
		design.size = stats.size;
		design.mDate = stats.mtime.toString();
		
		// psd 파일을 parsing을 통해서 가로 세로변수로 저장한다
		var parsedDesign = Files.parsePsd(design);
		VersionAPI.createVersion(parsedDesign,null);
		self.imageMagick(parsedDesign);
	},
	initDesign:function(obj){
		var design = obj;
		design.hash = IPC.sendSync('hash-gen',design.path);
		design.aDate = obj.aDate.toString();
		design.mDate = obj.mDate.toString();
		design.version = 1;

		this.addDesign(design);
	},
	addDesign:function(design){
		var self = this;
		var path = Utils.getDesignPath(design.hash);

		// 디자인의 인덱스 경로를 생성한다
		Utils.mkdirRecursiveSync(path.coverDir);
		Utils.mkdirRecursiveSync(path.imageDir);
		Utils.mkdirRecursiveSync(path.designDir);

		// GitIgnore를 생성하고 Git init을 실행한다
		fs.writeFileSync(path.designDir+'.gitignore',"*\n!" + '*.psd', 'utf8');
		IPC.sendSync('git-init',path.designDir);

		VersionAPI.createVersion(design,null);
		this.imageMagick(design);
	},
	imageMagick:function(design){
		var self = this;
		var path = Utils.getDesignPath(design.hash);

		// imageMagick 리사이즈 대응
		var cover,image,coverRatio,imageRatio;
		var ratioA = (design.width/design.height);
		var ratioB = (design.height/design.width);
		if(design.width>=design.height){
			coverRatio = (149*ratioA).toFixed(0) + 'x149';
			if(design.width>=1080){
				imageRatio = '1080x'+ (1080*ratioB).toFixed(0);
			} else {
				imageRatio = null;
			}
		} else {
			coverRatio = '149x'+ (149*ratioB).toFixed(0);
			if(design.height>=720){
				imageRatio = (720*ratioA).toFixed(0) +'x720';
			} else {
				imageRatio = null;
			}
		}

		// imageMagick 칼라모드 대응
		if(design.colorMode == 'cmyk'){
			cover = path.coverDir + 'cover-' + design.version + '.jpg';
			image = path.imageDir + 'image-' + design.version + '.jpg';
		} else {
			cover = path.coverDir + 'cover-' + design.version + '.png';
			image = path.imageDir + 'image-' + design.version + '.png';
		}

		var data = {
			design:design,
			cover:cover,
			image:image,
			coverRatio:coverRatio,
			imageRatio:imageRatio
		}

		IPC.send('imageMagick',data);

		DesignAction.updateDesign(design);
	},
	git:function(design){
		var self = this;
		var path = Utils.getDesignPath(design.hash);
		var oldFile = path.designDir + (design.version - 1) + '.psd';
		var newFile = path.designDir + design.version + '.psd';
		fse.removeSync(oldFile);
		fse.copySync(design.path,newFile);
		IPC.send('git',design,path.designDir);
	},
	writeDesign:function(design){
		var self = this;
		Utils.rewriteData(Utils.designJson,design);
	},
	deleteDesign:function(design){
		var self = this;

		// 트래킹에서 디자인을 제거한다
		this.removeWatcher(design.path);

		// 디자인 스토어에서 디자인을 제거한다
		DesignAction.deleteDesign(design);

		// 디자인 경로에서 디자인을 제거한다
		var path = Utils.getDesignPath(design.hash);
		var DB = Utils.getDBPath(design.hash);
		fse.removeSync(path.designDir);
		fse.removeSync(path.coverDir);
		fse.removeSync(path.imageDir);
		fse.removeSync(DB.versionJson);

		// 디자인Json에서 디자인을 제거한 후, 다시 저장한다.
		Utils.deleteAndWriteData(Utils.designJson,design);
	}
}





