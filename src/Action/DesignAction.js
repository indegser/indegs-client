var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var DesignAction = {
	receiveDesigns:function(data){
		AppDispatcher.handleAction({
			actionType:'RECEIVE_DESIGNS',
			data:data
		})
	},
	updateDesign:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_DESIGN',
			data:data
		})
	},
	updateStatus:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_STATUS',
			data:data
		})
	},
	deleteDesign:function(data){
		AppDispatcher.handleAction({
			actionType:'DELETE_DESIGN',
			data:data
		})
	},
	linkDesign:function(data){
		AppDispatcher.handleAction({
			actionType:'LINK_DESIGN',
			data:data
		})
	},
	changeSelect:function(data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_SELECT',
			data:data
		})
	},
	updateCtrlPress:function(data){
		AppDispatcher.handleAction({
			actionType:'UPDATE_CTRL_PRESS',
			data:data
		})
	},
	changeSortOption:function(data){
		AppDispatcher.handleAction({
			actionType:'CHANGE_SORT_OPTION',
			data:data
		})
	}
}

module.exports = DesignAction;