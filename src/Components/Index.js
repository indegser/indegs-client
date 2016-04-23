import React from 'react';
import IndexStore from '../Store/IndexStore';



const Action = React.createClass({
	handleMode:function(e){
		var mode = $(e.target).text().toLowerCase();
		console.log(mode)
	},
	render:function(){
		return (
			<div className="action" id="index-action">
				<div className="mode-wrapper">
					<div className="mode-btn" onClick={this.handleMode}>Project</div>
					<div className="mode-btn" onClick={this.handleMode}>Design</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
})

const Index = React.createClass({
	getInitialState:function(){
		return ({
			mode:'a'
		})
	},
	componentDidMount:function(){
		IndexStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		IndexStore.addChangeListener(this._onChange);
	},
	render:function(){
		return (
			<div id="index">
				<Action />
				<div id="body"></div>
			</div>
		)
	}
})

module.exports = Index;