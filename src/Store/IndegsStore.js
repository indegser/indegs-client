var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');

var _route  = 'index'
var guide = false;
var _guideRoute = 1;
var status = false;

var showGuide = function(bool){
	guide = bool;
}
var changeGuide = function(guideRoute){
	_guideRoute = guideRoute;
}

var updateStatus = function(bool){
	if(bool){
		status = true;
	} else {
		status = false;
	}
}

var IndegsStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getGuide:function(){
		return guide;
	},
	getRoute:function(){
		return _route;
	},
	getGuideRoute:function(){
		return _guideRoute;
	},
	getStatus:function(){
		return status;
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'SHOW_GUIDE':
			showGuide(action.data);
			IndegsStore.emit('change');
			break;
		case 'CHANGE_GUIDE':
			changeGuide(action.data);
			IndegsStore.emit('change');
			break;
		case 'UPDATE_STATUS':
			updateStatus(action.data);
			IndegsStore.emit('change');
			break;
		default:
			return true;
	}
});

module.exports = IndegsStore;