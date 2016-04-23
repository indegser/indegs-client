import React from 'react';
import RouteAction from '../../Action/RouteAction';

import VersionAction from '../../Action/VersionAction';
import VersionStore from '../../Store/VersionStore';

import CompareStore from '../../Store/CompareStore';
import CompareAPI from '../../API/CompareAPI';
import CompareAction from '../../Action/CompareAction';

import UserStore from '../../Store/UserStore';

var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

const Back = React.createClass({
	goBack:function(){
		RouteAction.changeRoute('/designs');
	},
	render:function(){
		var self = this;
		var parent = this.props.parent;
		return(
			<div className="action-btn" id="go-back" onClick={this.goBack}>
				<span id="btn"></span>
				<span id="text">{parent.name}</span>
			</div>
		)
	}
});


const CreateError = React.createClass({
	render:function(){
		return (
			<div id="create-error">
				{this.props.message}
			</div>
		)
	}
})

const Create = React.createClass({
	getInitialState:function(){
		return ({
			error:null
		})
	},
	create:function(){
		var self = this;
		CompareAction.togglePost(true);
		// var session = UserStore.getSession();

		// if(session == null) self.setState({error:'Sign in first'});
		// else {

		// 	// var _compare = CompareStore.getCompare();
		// 	// var postObj = {
		// 	// 	A:_compare.A,
		// 	// 	B:_compare.B,
		// 	// 	session:session
		// 	// }
		// 	// CompareAPI.postCompare(postObj)
		// }
	},
	render:function(){
		var createError;
		var error = this.state.error;
		if(error == null) createError = null;
		else {
			createError = <CreateError message={error}/>
		}
		return (
			<div className="action-btn" id="create" onClick={this.create}>
				<div id="text">Publish AB test</div>
				{createError}
			</div>
		)
	}
});


const Action = React.createClass({
	goVersion:function(e){
		var _version = this.props._version;
		var parent = _version[0].parent;
		var mode = $(e.target).text().toLowerCase();
		var route = '/design/'+ parent.hash + '/' + mode + '/';
		RouteAction.changeRoute(route);
	},
	render:function(){
		var _version = this.props._version;
		return (
			<div className="action" id="compare-action">
				<Back parent={_version[0].parent} />
				<div className="mode-wrapper">
					<div className="mode-btn" onClick={this.goVersion}>Version</div>
					<div className="mode-btn mode-selected">Compare</div>
					<div className="cb"></div>
				</div>
				<Create />
			</div>
		)
	}
});

module.exports = Action;