var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;


var _mode = 'project';

var changeMode = function(mode){
	_mode = mode;
}

var IndexStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getMode:function(){
		return _mode;
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'CHANGE_ROUTE':
			changeMode(action.data);
			IndexStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = IndexStore;