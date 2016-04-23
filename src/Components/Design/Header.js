var React = require('react');
var DesignAPI = require('../../API/DesignAPI.js');
var DesignAction = require('../../Action/DesignAction.js');
var DesignStore = require('../../Store/DesignStore.js');

var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var VersionAction = require('../../Action/VersionAction.js');
var VersionStore = require('../../Store/VersionStore.js');

const Add = React.createClass({
	handleClick:function(){
		$('#add-input').click()
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files;
		for(var i=0;i<file.length;i++){
			self.checkExtension(file[i])
		}
		e.target.value = null;
	},
	checkExtension:function(file){
		var self = this;
		var extObj = file.name.split('.');
		var ext = extObj[extObj.length-1]
		if(ext.toLowerCase() == 'psd'){
			var obj = {name:file.name,path:file.path,size:file.size,mdate:file.lastModifiedDate,ext:ext}
			self.checkExisting(obj)
		} else {
			Dialog.showMessageBox({
				browserWindow:BrowserWindow,
				type:'error',
				message:ext +' file is not supported',
				detail:file.name.slice(0,file.name.slice-4),
				buttons:['Okay']
			})
		}
	},
	checkExisting:function(obj){
		var self = this;
		var exist = false;
		var _design = this.props._design;
		for(var i=0;i<_design.length;i++){
			if(_design[i].path == obj.path){
				exist = true;
			}
		}
		if(exist){
			Dialog.showMessageBox({
				browserWindow:BrowserWindow,
				type:'error',
				message:obj.name+' is already being tracked',
				buttons:['Okay']
			});
		} else {
			self.parsePSD(obj)
		}
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

const Delete = React.createClass({
	render:function(){
		return (
			<div className="action-btn" id="delete">
				<span id="delete-btn"></span>
				<span id="delete-text">Delete</span>
			</div>
		)
	}
});

const Edit = React.createClass({
	render:function(){
		return (
			<div className="action-btn" id="edit">
				<span id="edit-btn"></span>
				<span id="edit-text">Edit</span>
			</div>
		)
	}
});

const Status = React.createClass({
	render:function(){
		return (
			<div id="status"></div>
		)
	}
});

const Sort = React.createClass({
	getInitialState:function(){
		return({
			sortOption:DesignStore.getSortOption()
		})
	},
	toggleSortBox:function(){
		var self = this;
		var menu = new Menu();
		menu.append(new MenuItem({
			label:'By Name',
			click:function(){
				DesignAction.changeSortOption('name');
				self.setState({
					sortOption:'name'
				})
			}
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:'By Modified Date',
			click:function(){
				DesignAction.changeSortOption('mDate');
				self.setState({
					sortOption:'mDate'
				})
			}
		}));
		menu.popup(BrowserWindow);
	},
	render:function(){
		var sort;
		var sortOption = this.state.sortOption;
		if(sortOption == 'name'){
			sort = 'By Name'
		}
		if(sortOption == 'mDate'){
			sort = 'By Modified Date'
		}
		if(sortOption == 'aDate'){
			sort = 'By Added Date'
		}
		return (
			<div className="action-btn" onClick={this.toggleSortBox} id="sort">
				<span id="sort-text">{sort}</span>
				<span id="sort-btn"></span>
			</div>
		)
	}
})


const Back = React.createClass({
	goBack:function(){
		DesignAction.changeRoute(null);
		DesignAction.changeSelect(null);
		VersionAction.clearVersion();
	},
	render:function(){
		var self = this;
		return(
			<div className="action-btn" id="version-back" onClick={this.goBack}>
				<span id="back-btn"></span>
				<span id="back-text">{self.props.select}</span>
			</div>
		)
	}
})


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
			<div className="action-btn" onClick={this.toggleLayoutBox} id="version-layout">
				<div id="layout-text">{layout}</div>
				<div id="layout-btn"></div>
			</div>
		)
	}
})

const VersionHeader = React.createClass({
	render:function(){
		var version = this.props.version;
		var select = this.props.select;
		return (
			<div id="version-action">
				<Back select={version.name} />
				<Layout />
			</div>
		)
	}
});

const DesignHeader = React.createClass({
	render:function(){
		var _design = this.props._design;
		return (
			<div id="design-action">
				<Add _design={_design} />
				<Sort />
			</div>
		)
	}
});

const Header = React.createClass({
	render:function(){
		var header;
		var route = this.props.route;
		var select = this.props.select;
		var _design = this.props._design;
		if(route != null){
			header = <VersionHeader version={route} select={select} />
		} else {
			header = <DesignHeader select={select} _design={_design} />
		}
		return (
			<div id="action">
				{header}
			</div>
		)
	}
});


module.exports = Header;