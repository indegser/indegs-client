var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var IndegsAction = {
	showGuide:function(data){
		AppDispatcher.handleAction({
			actionType:'SHOW_GUIDE',
			data:data
		})
	},
	changeGuide:function(data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_GUIDE',
			data:data
		})
	},
	updateStatus:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_STATUS',
			data:data
		})
	}
}

module.exports = IndegsAction;