var CompareDispatcher = require('../dispatcher/CompareDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');

var _compare;
var _version;
var _post;

var updateVersions = function(versions){
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
}

var emptyVersions = function(){
	_version = null;
}

var updateCompare = function(compare){
	// empty된 이후, 다시 object로 초기화
	if(_compare == null) _compare = {};

	if(compare.section == 'a'){
		for(var i=0; i<_version.length;i++){
			if(_version[i].name == compare.value){
				_compare.A = _version[i];
				_compare.A.status = true;
				break;
			}
		}
		if(i == _version.length){
			_compare.A = {status:false,name:compare.value}
		}
	} else {
		for(var i=0; i<_version.length;i++){
			if(_version[i].name == compare.value){
				_compare.B = _version[i];
				_compare.B.status = true;
				break;
			}
		}
		if(i == _version.length){
			_compare.B = {status:false,name:compare.value}
		}
	}
}

var emptyCompare = function(){
	_compare = null;
}

var emptySection = function(section){
	if(section == 'a'){
		_compare.A = null;
	} else {
		_compare.B = null;
	}
};

var togglePost = function(bool){
	if(bool){
		_post = {};
	} else {
		_post = null;
	}
}

var updatePostTitle = function(title){
	_post.title = title;
}

var updatePostText = function(text){
	_post.text = text;
}



var CompareStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getCompare:function(){
		return _compare;
	},
	getPost:function(){
		return _post
	}
});

CompareDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_VERSIONS':
			updateVersions(action.data);
			CompareStore.emit('change');
			break;
		case 'EMPTY_VERSIONS':
			emptyVersions(action.data);
			CompareStore.emit('change');
			break;
		case 'UPDATE_COMPARE':
			updateCompare(action.data);
			CompareStore.emit('change');
			break;
		case 'EMPTY_COMPARE':
			emptyCompare();
			CompareStore.emit('change');
			break;
		case 'EMPTY_SECTION':
			emptySection(action.data);
			CompareStore.emit('change');
			break;
		case 'TOGGLE_POST':
			togglePost(action.data);
			CompareStore.emit('change');
			break;
		case 'UPDATE_POST_TITLE':
			updatePostTitle(action.data);
			// CompareStore.emit('change');
			break;
		case 'UPDATE_POST_TEXT':
			updatePostText(action.data);
			// CompareStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = CompareStore;