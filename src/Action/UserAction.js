var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var UserAction = {
	updateSession:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_SESSION',
			data:data
		})
	}
}

module.exports = UserAction;