var VersionDispatcher = require('../dispatcher/VersionDispatcher.js');

var VersionAction = {
	receiveVersions:function(data){
		VersionDispatcher.handleAction({
			actionType:'RECEIVE_VERSIONS',
			data:data
		})
	},
	updateVersion:function(data){
		VersionDispatcher.handleAction({
			actionType:'UPDATE_VERSION',
			data:data
		})
	},
	deleteVersion:function(data){
		VersionDispatcher.handleAction({
			actionType:'DELETE_VERSION',
			data:data
		})
	},
	clearVersion:function(){
		VersionDispatcher.handleAction({
			actionType:'CLEAR_VERSION'
		})
	},
	changeLayoutOption:function(data){
		VersionDispatcher.handleAction({
			actionType:'CHANGE_LAYOUT_OPTION',
			data:data
		})
	},
	addLoader:function(data){
		VersionDispatcher.handleAction({
			actionType:'ADD_LOADER',
			data:data
		})
	},
	removeLoader:function(data){
		VersionDispatcher.handleAction({
			actionType:'REMOVE_LOADER',
			data:data
		})
	},
	updateParent:function(data){
		VersionDispatcher.handleAction({
			actionType:'UPDATE_PARENT',
			data:data
		})
	},
	changeSelect:function(data){
		VersionDispatcher.handleAction({
			actionType:'CHANGE_SELECT',
			data:data
		})
	},
	updateCtrlPress:function(data){
		VersionDispatcher.handleAction({
			actionType:'UPDATE_CTRL_PRESS',
			data:data
		})
	}
}

module.exports = VersionAction;