var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');
var VersionAPI = require('../API/VersionAPI.js');

var _session = false;

var updateSession = function(session){
	_session = session;
	console.log(session)
}

var UserStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getSession:function(){
		return _session;
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'UPDATE_SESSION':
			updateSession(action.data);
			UserStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = UserStore;