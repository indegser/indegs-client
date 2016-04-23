var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/Utils.js');

var _route = {
	section:'designs'
};

var changeRoute = function(route,data){
	if(route == null) _route = null;
	else {
		var parsed = route.split('/');
		_route = {};
		_route.section = parsed[1];
		_route.hash = parsed[2];
		_route.page = parsed[3];
		_route.data = data;
	}
}

var RouteStore = objectAssign({},EventEmitter.prototype,{
	addChangeListener:function(cb){
		this.on('change',cb);
	},
	removeChangeListener:function(cb){
		this.removeListener('change',cb);
	},
	getRoute:function(){
		return _route;
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case 'CHANGE_ROUTE':
			changeRoute(action.route,action.data);
			RouteStore.emit('change');
			break;

		default:
			return true;
	}
});

module.exports = RouteStore;