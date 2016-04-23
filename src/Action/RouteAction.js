var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var RouteAction = {
	changeRoute:function(route,data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_ROUTE',
			route:route,
			data:data
		})
	}
}

module.exports = RouteAction;