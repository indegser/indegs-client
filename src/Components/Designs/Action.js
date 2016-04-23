import React from 'react';
import RouteAction from '../../Action/RouteAction';

import Files from '../../utils/Files';

var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

import DesignAPI from '../../API/DesignAPI';
import DesignStore from '../../Store/DesignStore';


const Delete = React.createClass({
	handleDelete:function(){
		var message;
		var _select = DesignStore.getSelect();
		if(_select.length > 1){
			message = 'Do you want to move the selected designs to the Trash?'
		} else {
			message = 'Do you want to move the selected design to the Trash?'
		}
		var menu = new Menu();
		var confirm = Dialog.showMessageBox({
			browserWindow: BrowserWindow,
			type: 'question',
			message: message,
			detail: 'All version data will be deleted',
			buttons: ['Move to trash','Cancel']
		});
		if(confirm == 0){
			for(var i =0;i<_select.length;i++){
				DesignAPI.deleteDesign(_select[i]);
			}
			// DesignAPI.deleteDesign(design)
		}
	},
	render:function(){
		return (
			<div className="action-btn" id="delete" onClick={this.handleDelete}>
				<span id="text">Delete</span>
			</div>
		)
	}
})

const Add = React.createClass({
	getInitialState:function(){
		return ({
			_design:this.props._design
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			_design:nextProps._design
		})
	},
	handleClick:function(){
		$('#add-input').click()
	},
	handleChange:function(e){
		var self = this;
		var files = e.target.files;
		this.checkExtension(files);
		e.target.value = null;
	},
	checkExtension:function(files){
		var self = this;
		var success = [];
		var error = "";
		for(var i=0;i<files.length;i++){
			var res = Files.getExtension(files[i]);
			if(res.status){
				files[i].ext = res.ext;
				success.push(files[i]);
			} else {
				error += files[i].name + ', ';
			}
		}
		if(error.length > 0){
			Dialog.showMessageBox({
				browserWindow:BrowserWindow,
				type:'error',
				message:error.slice(0,error.length-2),
				detail:'Not supported',
				buttons:['Okay']
			});
		}
		if(success.length > 0) self.checkExisting(success);
	},
	checkExisting:function(files){
		var success = [];
		var error = "";
		var _design = this.state._design;
		if(_design == null){
			success = files;
		} else {
			for(var i=0; i<files.length; i++){
				for(var k=0; k<_design.length; k++){
					if(files[i].path ==_design[k].path){
						error += files[i].name + ', ';
						break;
					}
				}
				if(k==_design.length){
					success.push(files[i]);
				}
			}
			if(error.length > 0){
				Dialog.showMessageBox({
					browserWindow:BrowserWindow,
					type:'error',
					message:error.slice(0,error.length-2),
					detail:'Alreay being managed',
					buttons:['Okay']
				});
			}
		}
		if(success.length > 0){
			for(var i=0; i<success.length; i++){
				var parsedFile = Files.parseFile(success[i]);
				var designObj = Files.parsePsd(parsedFile);
				DesignAPI.initDesign(designObj)
			}
		};
	},
	parsePSD:function(obj){
		var psd = PSD.fromFile(obj.path);
		psd.parse();
		obj.width = psd.header.width;
		obj.height = psd.header.height;
		DesignAPI.initDesign(obj);
	},
	render:function(){
		return (
			<div className="action-btn" id="add" onClick={this.handleClick}>
				<span id="add-btn"></span>
				<span id="add-text">New</span>
				<input type="file" multiple id="add-input" onChange={this.handleChange}/>
			</div>
		)
	}
});

const Action = React.createClass({
	handleMode:function(e){
		var mode = $(e.target).text().toLowerCase();
		var route = '/' + mode + 's/';
		RouteAction.changeRoute(route);
	},
	render:function(){
		var _design = this.props._design;
		return (
			<div className="action" id="designs-action">
				<Add _design={_design} />
				<Delete />
				<div className="mode-wrapper">
					<div className="mode-btn mode-selected" onClick={this.handleMode}>Design</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
});

module.exports = Action;