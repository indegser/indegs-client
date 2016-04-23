import VersionAction from '../Action/VersionAction';
import Utils from '../utils/Utils';

module.exports = {
	receiveVersions:function(hash){
		var path = Utils.getDBPath(hash);
		var data = Utils.receiveData(path.versionJson);
		if(data !== null){
			VersionAction.receiveVersions(data)
		} else {
			return null;
		}
	},
	receiveVersion:function(design){
		var path = Utils.getDesignPath(design.name,design.hash);
		var json = Utils.receiveData(path.versionJson);
		if(json !== null){
			for(var i=0; i<json.length; i++){
				VersionAction.updateVersion(json[i])
			}
		} else {
			return null;
		}
	},
	checkResize:function(design){
		var path = Utils.getDesignPath(design.name,design.hash);
		var json = Utils.receiveData(path.versionJson);
		if(json != null){
			var ratioA = design.width/design.height;
			var ratioB = json[json.length-1].width/json[json.length-1].height;
			if(ratioA != ratioB){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	createVersion:function(design,hash){
		var self = this;
		if(hash==null){
			VersionAction.addLoader(design.hash);
		} else {
			var path = Utils.getDesignPath(design.hash);
			var version = {
				parent:{
					hash:design.hash,
					name:design.name,
					path:design.path,
					ext:design.ext
				},
				hash:hash,
				name:design.version,
				path:path.designDir+design.version+'.'+design.ext,
				cover:design.cover,
				image:design.image,
				mDate:design.mDate,
				width:design.width,
				height:design.height,
				size:design.size
			}
			var split = version.cover.split('.');
			version.ext = split[split.length-1];


			self.writeVersion(version);
			VersionAction.removeLoader(design.hash);
			VersionAction.updateVersion(version);
		}
	},
	writeVersion:function(version){
		var path = Utils.getDBPath(version.parent.hash);
		Utils.rewriteData(path.versionJson,version);
	},
	revertVersion:function(version){
		var self = this;
		var path = Utils.getDesignPath(version.parent.hash);
		IPC.send('checkout-hash',path.designDir,version);
		// VersionAction.showLoader(version.parentHash,'Reverting version');
	},
	checkoutMaster:function(version){
		var self = this;
		var path = Utils.getDesignPath(version.parent.hash);

		var versionFile = path.designDir + version.name + '.' + version.parent.ext;
		var tmpFile = Utils.mediaDir + version.name + '.' + version.parent.ext;

		fse.copySync(versionFile,tmpFile);
		IPC.send('checkout-master',path.designDir,version);
	},
	checkoutMasterFinish:function(version){
		var path = Utils.getDesignPath(version.parent.hash);
		var DB = Utils.getDBPath(version.parent.hash);

		// 올드 파라미터들을 설정한다
		var tmpFile = Utils.mediaDir + version.name + '.' + version.parent.ext;
		var oldCover = version.cover;
		var oldImage = version.image;
		var oldFile = version.versionFile;


		// 리센트 파라미터를 설정한다
		var json = Utils.receiveData(DB.versionJson);
		var sortByName = function(a,b){
			if(a.name < b.name){return 1};
			if(a.name > b.name){return -1};
			return 0;
		}

		json.sort(sortByName);
		var recent = json[0];

		version.name = +recent.name + +1;
		version.cover = path.coverDir + 'cover-'+ version.name + '.' + version.ext;
		version.image = path.imageDir + 'image-'+ version.name + '.' + version.ext;


		// 이전 파일들을 복사하고 삭제한다
		fse.copySync(oldCover,version.cover);
		fse.copySync(oldImage,version.image);

		// 마스터로 체크아웃한 경우 최신 파일이 있으므로, 이것을 지워준다
		var recentFile = path.designDir + recent.name + '.' + recent.parent.ext;
		fse.removeSync(recentFile);

		// 임시 파일을 깃 디렉토리에 다시 복사한다
		var newVersionFile = path.designDir + version.name + '.' + version.parent.ext;
		fse.copySync(tmpFile,newVersionFile);
		fse.removeSync(tmpFile);

		// 깃 디렉토리에 복사된 파일을 디자인 파일 경로에 복사한다
		fse.copySync(newVersionFile,version.parent.path);

		IPC.send('revert-commit',path.designDir,version)
	},
	revertFinish:function(version,hash){
		var DB = Utils.getDBPath(version.parent.hash);
		version.hash = hash;
		Utils.rewriteData(DB.versionJson,version);
		VersionAction.updateVersion(version);
		// VersionAction.showLoader(null,null);
	},
	deleteVersion:function(version){
		var self = this;
		var DB = Utils.getDBPath(version.parent.hash);
		// VersionAction.showLoader(version.parentHash,'Deleting Version');
		fse.removeSync(version.cover);
		fse.removeSync(version.image);
		VersionAction.deleteVersion(version);

		Utils.deleteAndWriteData(DB.versionJson,version);
		// VersionAction.showLoader(null,null);
	},
	pruneVersion:function(version){
		var path = Utils.getDesignPath(version.parentName,version.parentHash);
		var dir = path.designDir;
		fse.removeSync(path.designDir + '.git/refs/original');
		fse.removeSync(path.designDir + '.git/logs/');
		IPC.send('git-prune',dir,version);
	},
	linkVersion:function(newDesign,design){
		var self = this;
		var path = Utils.getDesignPath(design.name,design.hash);
		var newPath = Utils.getDesignPath(newDesign.name,newDesign.hash);
		var json = Utils.receiveData(path.versionJson);
		for(var i=0;i<json.length;i++){
			json[i].parentName = newDesign.name;
			json[i].parentPath = newDesign.path;
			json[i].parentHash = newDesign.hash;
			json[i].cover = newPath.coverDir + 'cover-'+json[i].counter+'.png';
			json[i].image = newPath.imageDir + 'image-'+json[i].counter+'.png';
		}
		Utils.writeData(json,newPath.versionJson);
		fse.removeSync(path.versionJson);

	},
	updateVersionMessage:function(version){
		var DB = Utils.getDBPath(version.parent.hash);
		Utils.rewriteData(DB.versionJson,version);
		VersionAction.updateVersion(version);
	}







}
