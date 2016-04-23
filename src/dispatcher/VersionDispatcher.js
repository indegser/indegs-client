var Dispatcher = require('flux').Dispatcher;

var VersionDispatcher = new Dispatcher();

VersionDispatcher.handleAction = function(action){
	this.dispatch({
		source:'VIEW_ACTION',
		action:action
	});
}


module.exports = VersionDispatcher;