var CompareDispatcher = require('../dispatcher/CompareDispatcher.js');

var CompareAction = {
	updateVersions:function(data){
		CompareDispatcher.handleAction({
			actionType:'UPDATE_VERSIONS',
			data:data
		})
	},
	emptyVersions:function(data){
		CompareDispatcher.handleAction({
			actionType:'UPDATE_VERSIONS',
			data:data
		})
	},
	updateCompare:function(data){
		CompareDispatcher.handleAction({
			actionType:'UPDATE_COMPARE',
			data:data
		})
	},
	emptyCompare:function(data){
		CompareDispatcher.handleAction({
			actionType:'EMPTY_COMPARE'
		})
	},
	emptySection:function(data){
		CompareDispatcher.handleAction({
			actionType:'EMPTY_SECTION',
			data:data
		})
	},
	togglePost:function(data){
		CompareDispatcher.handleAction({
			actionType:'TOGGLE_POST',
			data:data
		})
	},
	updatePostTitle:function(data){
		CompareDispatcher.handleAction({
			actionType:'UPDATE_POST_TITLE',
			data:data
		})
	},
	updatePostText:function(data){
		CompareDispatcher.handleAction({
			actionType:'UPDATE_POST_TEXT',
			data:data
		})
	}
}

module.exports = CompareAction;