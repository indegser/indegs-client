var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');
var DesignAPI = require('../API/DesignAPI.js');

var _design;
var route = null;
var _select = [];
var sortOption = 'mDate';

var ctrlPressed = false;

var _status = null;



var changeSortOption = function(arg){
	sortOption = arg;
	_design.sort(compare)
}

var compare = function(a,b){
	if(sortOption == 'mDate'){
		var date1 = new Date(a.mDate);
		var date2 = new Date(b.mDate);
		if(date1 < date2){return 1;}
		if(date1 > date2){return -1;}
		return 0;
	}
	if(sortOption == 'name'){
		if(a.name.toLowerCase() > b.name.toLowerCase()){return 1;}
		if(a.name.toLowerCase() < b.name.toLowerCase()){return -1;}
		return 0;
	}
	if(sortOption == 'aDate'){
		var date1 = new Date(a.aDate);
		var date2 = new Date(b.aDate);
		if(date1 < date2){return 1;}
		if(date1 > date2){return -1;}
		return 0;
	}
}

var updateStatus = function(status){
	_status = status;
}

var receiveDesigns = function(designs){
	if(_design != null){
		for(var i=0;i<designs.length;i++){
			for(var k=0;k<_design.length;k++){
				if(designs[i].hash == _design[k].hash){
					_design[k] == designs[i];
					break;
				}
			}
			if(k==_design.length){
				_design.unshift(designs[i])
			}
		}
	} else {
		_design = [];
		_design = designs;
	}
	_design.sort(compare);
}

var updateDesign = function(design){
	if(_design!=null){
		function find(design, _design){
			for(var i=0;i<_design.length;i++){
				if(_design[i].path == design.path){
					_design[i] = design;
					break;
				}
			}
			if(i == _design.length){
				_design.unshift(design);
			}
		}
		find(design, _design);
		// if(select!=null && design.hash == select.hash){
		// 	select = design;
		// }
	} else {
		_design = [];
		_design.unshift(design)
	}
}

var deleteDesign = function(design){
	function findAndDelete(design,_design){
		for(var i=0;i<_design.length;i++){
			if(_design[i].hash == design.hash){
				_design.splice(i,1);
				break;
			}
		}
	}
	findAndDelete(design,_design);

	
	// 셀렉트를 초기화한다
	_select = [];
	// Utils.writeData(_design,Utils.designJson);
}

var linkDesign = function(twoDesign){
	for(var i=0; i<_design.length; i++){
		if(_design[i].path == twoDesign.design.path){
			if(_design[i].hash == select.hash){
				select = twoDesign.newDesign;
			}
			_design[i] = twoDesign.newDesign;
			_design.sort(compare);
			break;
		}
	}
	Utils.writeData(_design,Utils.designJson);
}


var changeRoute = function(design){
	route = design;
}

var changeSelect = function(select){
	if(select == null){
		_select = [];
	} else {
		if(ctrlPressed){
			// 중복된 것은 '선택된 디자인'에서 제거해준다
			for(var i=0;i<_select.length;i++){
				if(_select[i].hash == select.hash){
					break;
				}
			}

			// 중복된 것이 없을 때 '선택된 디자인'에 추가한다
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

var updateCtrlPress = function(bool){
	ctrlPressed = bool;
}


var DesignStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getDesigns:function(){
		return _design;
	},
	getSelect:function(){
		return _select;
	},
	getStatus:function(){
		return _status;
	},
	getDesignLength:function(){
		return _design.length;
	},
	getRoute:function(){
		return route;
	},
	getSortOption:function(){
		return sortOption;
	},
	getDesignByPath:function(path){
		for(var i=0; i<_design.length; i++){
			if(_design[i].path == path){
				return _design[i];
				break;
			}
		}
	},
	getDesignByHash:function(hash){
		for(var i=0; i<_design.length; i++){
			if(_design[i].hash == hash){
				return _design[i];
				break;
			}
		}
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'RECEIVE_DESIGNS':
			receiveDesigns(action.data);
			DesignStore.emit('change');
			break;
		case 'UPDATE_DESIGN':
			updateDesign(action.data);
			DesignStore.emit('change');
			break;
		case 'UPDATE_STATUS':
			updateStatus(action.data);
			DesignStore.emit('change');
			break;
		case 'DELETE_DESIGN':
			deleteDesign(action.data);
			DesignStore.emit('change');
			break;
		case 'LINK_DESIGN':
			linkDesign(action.data);
			DesignStore.emit('change');
			break;
		case 'CHANGE_SELECT':
			changeSelect(action.data);
			DesignStore.emit('change');
			break;
		case 'UPDATE_CTRL_PRESS':
			updateCtrlPress(action.data);
			break;
		case 'CHANGE_SORT_OPTION':
			changeSortOption(action.data);
			DesignStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = DesignStore;