var VersionDispatcher = require('../dispatcher/VersionDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');
var VersionAPI = require('../API/VersionAPI.js');

var _loader = [];
var route = null;
var _parent;
var _version = [];
var layoutOption = '1';
var _select = [];

var ctrlPressed = false;


// 버전 셀렉션에 관한 부분
var updateCtrlPress = function(bool){
	ctrlPressed = bool;
}

var changeSelect = function(select){
	if(select == null){
		_select = [];
	} else {
		if(ctrlPressed){
			// 중복된 것은 '선택'에서 제거해준다
			for(var i=0;i<_select.length;i++){
				if(_select[i].hash == select.hash){
					break;
				}
			}

			// 중복된 것이 없을 때 '선택'에 추가한다
			if(i == _select.length){
				_select.push(select)
			} else {
				_select.splice(i,1)
			}
		} else {
			_select = [];
			_select.push(select);
		}
	}
}



var clearVersion = function(){
	_version = [];
}

var clearSelect = function(){
	_select = [];
}

var updateParent = function(parent){
	_parent = parent;
}

var addLoader = function(hash){
	_loader.push({
		hash:hash
	});
}

var removeLoader = function(hash){
	for(var i=0;i<_loader.length;i++){
		if(_loader[i].hash == hash){
			_loader.splice(i,1);
			break;
		}
	}
}

var compare = function(a,b){
	if(a.name < b.name){return 1;}
	if(a.name > b.name){return -1;}
	return 0;
}

var receiveVersions = function(versions){
	if(_version != null){
		for(var i=0;i<versions.length;i++){
			for(var k=0;k<_version.length;k++){
				if(versions[i].hash == _version[k].hash){
					_version[k] == versions[i];
					break;
				}
			}
			if(k==_version.length){
				_version.unshift(versions[i])
			}
		}
	} else {
		_version = [];
		_version = versions;
	}
	_version.sort(compare);
}

var updateVersion = function(version){
	if(_version!=null){
		function find(version, _version){
			for(var i=0;i<_version.length;i++){
				if(_version[i].name == version.name){
					_version[i] = version;
					break;
				}
			}
			if(i == _version.length){
				_version.unshift(version);
			}
		}
		if(_parent != null && _parent.hash == version.parent.hash){
			find(version, _version);
		}
	} else {
		_version = [];
		_version.push(version);
	}
}
var deleteVersion = function(version){
	for(var i=0;i<_version.length;i++){
		if(_version[i].hash == version.hash){
			_version.splice(i,1)
			break;
		}
	}
	_select = [];
}

var changeLayoutOption = function(option){
	layoutOption = option;
}



var VersionStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getVersions:function(){
		return _version;
	},
	getVersion:function(){
		return _version;
	},
	getLatestVersion:function(){
		return _version[0];
	},
	getLayoutOption:function(){
		return layoutOption;
	},
	getLoader:function(){
		return _loader;
	},
	getRoute:function(){
		return route;
	},
	getParent:function(){
		return _parent;
	},
	getSelect:function(){
		return _select;
	}
});

VersionDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'RECEIVE_VERSIONS':
			receiveVersions(action.data);
			VersionStore.emit('change');
			break;
		case 'UPDATE_VERSION':
			updateVersion(action.data);
			VersionStore.emit('change');
			break;
		case 'DELETE_VERSION':
			deleteVersion(action.data);
			VersionStore.emit('change');
			break;
		case 'CLEAR_VERSION':
			clearVersion(action.data);
			clearSelect(action.data);
			VersionStore.emit('change');
			break;
		case 'CHANGE_LAYOUT_OPTION':
			changeLayoutOption(action.data);
			VersionStore.emit('change');
			break;
		case 'ADD_LOADER':
			addLoader(action.data);
			VersionStore.emit('change');
			break;
		case 'REMOVE_LOADER':
			removeLoader(action.data);
			VersionStore.emit('change');
			break;
		case 'UPDATE_PARENT':
			updateParent(action.data);
			VersionStore.emit('change');
			break;
		case 'CHANGE_SELECT':
			changeSelect(action.data);
			VersionStore.emit('change');
			break;
		case 'UPDATE_CTRL_PRESS':
			updateCtrlPress(action.data);
			break;

		default:
			return true;
	}
});

module.exports = VersionStore;