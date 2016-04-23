var Dispatcher = require('flux').Dispatcher;

var CompareDispatcher = new Dispatcher();

CompareDispatcher.handleAction = function(action){
	this.dispatch({
		source:'VIEW_ACTION',
		action:action
	});
}


module.exports = CompareDispatcher;