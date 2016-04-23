import React from 'react';
import RouteAction from '../../Action/RouteAction';

import VersionAction from '../../Action/VersionAction';
import VersionStore from '../../Store/VersionStore';

import DesignStore from '../../Store/DesignStore';

var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

const Back = React.createClass({
	goBack:function(){
		VersionAction.clearVersion();
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

const Layout = React.createClass({
	getInitialState:function(){
		return({
			layoutOption:VersionStore.getLayoutOption()
		})
	},
	toggleLayoutBox:function(){
		var self = this;
		var menu = new Menu();
		menu.append(new MenuItem({
			label:'One Column',
			click:function(){
				VersionAction.changeLayoutOption('1');
				self.setState({
					layoutOption:'1'
				})
			}
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:'Two Column',
			click:function(){
				VersionAction.changeLayoutOption('2');
				self.setState({
					layoutOption:'2'
				})
			}
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:'Three Column',
			click:function(){
				VersionAction.changeLayoutOption('3');
				self.setState({
					layoutOption:'3'
				})
			}
		}));
		menu.popup(BrowserWindow);
	},
	render:function(){
		var layout;
		var layoutOption = this.state.layoutOption;
		if(layoutOption == '1'){
			layout = 'One Column'
		}
		if(layoutOption == '2'){
			layout = 'Two Column'
		}
		if(layoutOption == '3'){
			layout = 'Three Column'
		}
		return (
			<div className="action-btn" onClick={this.toggleLayoutBox} id="layout">
				<div id="text">{layout}</div>
				<div id="btn"></div>
			</div>
		)
	}
});


const Mode = React.createClass({
	goCompare:function(e){
		var parent = this.props.parent;
		var route = '/design/'+ parent.hash + '/compare';
		RouteAction.changeRoute(route);
	},
	render:function(){
		return (
		<div className="mode-wrapper">
			<div className="mode-btn mode-selected">Version</div>
			<div className="mode-btn" onClick={this.goCompare}>Compare</div>
			<div className="cb"></div>
		</div>
		)
	}
})
const Action = React.createClass({
	getInitialState:function(){
		return ({
			parent:DesignStore.getDesignByHash(this.props.hash)
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			parent:DesignStore.getDesignByHash(nextProps.hash)
		})
	},
	render:function(){
		var parent = this.state.parent;
		return (
			<div className="action" id="version-action">
				<Back parent={parent} />
				<Mode parent={parent} />
				<Layout />
			</div>
		)
	}
});

module.exports = Action;