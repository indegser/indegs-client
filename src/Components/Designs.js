var React = require('react');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var clipboard = remote.require('clipboard');
// Components
var Header = require('./Design/Header.js');

// var Info = require('./Design/Info.js');
var Version = require('./Version.js');

var Utils = require('../utils/Utils.js');
var Files = require('../utils/Files.js');
var VersionAPI = require('../API/VersionAPI.js');
var VersionAction = require('../Action/VersionAction.js');

// API
import DesignAPI from '../API/DesignAPI';

// Store
import DesignStore from '../Store/DesignStore';

// Action
import DesignAction from '../Action/DesignAction';


// Component
import Action from './Designs/Action';




import RouteAction from '../Action/RouteAction';



IPC.on('gc-end',function(event,res,design){

});




const DesignStatus = React.createClass({
	handleClick:function(e){
		$(e.target).children().last().click()
		$(e.target).next().click()
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files[0];
		self.checkExtension(file)
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
				buttons:['Okay']
			})
		}
	},
	checkExisting:function(obj){
		var self = this;
		var exist = false;
		var _design = Utils.receiveData(Utils.designJson);
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
		var design = this.props.design;
		var psd = PSD.fromFile(obj.path);
		psd.parse();
		obj.width = psd.header.width;
		obj.height = psd.header.height;
		DesignAPI.linkDesign(obj,design);
		// DesignAPI.initDesign(obj);
	},
	render:function(){
		return (
			<div className="design-status-holder" onClick={this.handleClick}>
				<div className="design-status-red"></div>
				<input type="file" className="design-status-input" onChange={this.handleChange} />
			</div>
		)
	}
});

const Info = React.createClass({
	render:function(){
		var design = this.props.design;
		var isSelected = this.props.isSelected;
		var title = Utils.getTitle(design);
		var dateObj = Utils.getParsedDate(design.mDate);
		var date = dateObj.month + ' ' + dateObj.day;

		return (
			<div className="info">
				<div>
					<div className="title">{title}</div>
					<div className="cb"></div>
				</div>
				<div>
					<div className="date">{date}</div>
					<div className="cb"></div>
				</div>
			</div>
		)
	}
})

const Cover = React.createClass({
	getInitialState:function(){
		return ({
			design:this.props.design
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			design:nextProps.design
		},function(){
			self.layout()
		})
	},
	componentDidMount:function(){
		this.layout()
	},
	layout:function(){
		var design = this.state.design;
		var item = {
			width:144,
			height:144
		}

		var img = {}
		var width = design.width;
		var height = design.height;
		var ratio = width/height;
		if(width>height){
			img.width = item.height * ((design.width/design.height).toFixed(2));	
			img.height = item.height;
			img.marginLeft = -(img.width*0.5).toFixed(1);
			img.marginTop = 0;
			img.left = '50%';
			img.top = 0;
		} else {
			img.width = item.width;
			img.height = item.width * ((design.height/design.width).toFixed(2));
			img.marginLeft = 0;
			img.marginTop = -(img.height*0.5).toFixed(1);
			img.left = 0;
			img.top = '50%';
		}

		var imgStyle = {
			width:img.width,
			height:img.height,
			marginLeft:img.marginLeft,
			marginTop:img.marginTop,
			left:img.left,
			top:img.top
		}

		this.setState({
			imgStyle:imgStyle
		})
	},
	render:function(){
		var design = this.state.design;
		var imgStyle = this.state.imgStyle;
		var img;
		if(design.cover == null){
			img = <div className="cover-img-loader"></div>
		} else {
			img = <img className="cover-img" src={design.cover} style={imgStyle}></img>
		}

		return (
			<div className="cover">
				<div className="cover-img-holder">
					{img}
				</div>
			</div>
		)
	}
})

const DesignItem = React.createClass({
	getInitialState:function(){
		return({
			design:this.props.design,
			isSelected:this.props.isSelected
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			design:nextProps.design,
			isSelected:nextProps.isSelected
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){

	},
	contextMenu:function(event){
		event.preventDefault();
		var self = this;
		var design = this.state.design;

		var menu = new Menu();
		menu.append(new MenuItem({
			label:'Open "' + design.name + '"',
			click:function(){
				fsOpen(design.path)
			}
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:'Show in Finder',
			click:function(){
				fsOpen(design.path.slice(0,design.path.length - design.name.length))
			}
		}));
		menu.append(new MenuItem({
			type:'separator'
		}));
		menu.append(new MenuItem({
			label:'Delete',
			click:function(){
				var _select = DesignStore.getSelect();
				var deleteArray = [];
				// 셀렉션이 있는가 우선 확인한다.
				if(_select == null || _select.length == 0){
					deleteArray.push(design)
				} else {
					deleteArray = _select;

					// 셀렉된 것에 현재 디자인이 포함되어 있는지 체크한다.
					for(var i=0;i<_select.length;i++){
						if(_select[i].hash == design.hash){
							break;
						}
					}
					// 포함되어 있지 않다면 deleteArray에 추가한다
					if(i == _select.length){
						deleteArray.push(design)
					}
				};
				var message;
				if(deleteArray.length > 1){
					message = 'Do you want to move the selected designs to the Trash?'
				} else {
					message = 'Do you want to move the selected design to the Trash?'
				}
				var confirm = Dialog.showMessageBox({
					browserWindow: BrowserWindow,
					type: 'question',
					message: message,
					detail: 'All version data will be deleted',
					buttons: ['Move to trash','Cancel']
				});
				if(confirm == 0){
					for(var i=0;i<deleteArray.length;i++){
						DesignAPI.deleteDesign(deleteArray[i])
					}
				}
			}
		}));
		menu.popup(BrowserWindow);
	},
	selectDesign:function(e){
		var self = this;
		var design = this.state.design;
		DesignAction.changeSelect(design);
	},
	handleDoubleClick:function(){
		var design = this.props.design;
		RouteAction.changeRoute('/design/' + design.hash + '/version');
	},
	render:function(){
		var self = this;
		var design = this.state.design;
		var isSelected = this.state.isSelected;
		var itemStyle = this.props.itemStyle;
		var itemClass;
		// var url = design.cover.replace(/\\/g,"/");
		// if(design.status == false){
		// 	status = <DesignStatus design={design}/>
		// } else {
		// 	status = null
		// }

		if(isSelected){
			itemClass = "item item-selected";
		} else {
			itemClass = "item";
		}


		return(
			<div className={itemClass} style={itemStyle} onClick={this.selectDesign} onDoubleClick={this.handleDoubleClick} onContextMenu={this.contextMenu}>
				<Cover design={design} isSelected={isSelected}/>
				<Info design={design} isSelected={isSelected}/>
			</div>
		)
	}
});

const Body = React.createClass({
	getInitialState:function(){
		return ({
			_design:this.props._design,
			_select:this.props._select
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			_design:nextProps._design,
			_select:nextProps._select
		})
	},
	componentDidMount:function(){
		this.resizeTimer;
		window.addEventListener('resize',this._onResize);
		window.addEventListener('keydown',this._onKeyDown);
		window.addEventListener('keyup',this._onKeyUp);
		this.layout();
		this.designItemLayout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
		window.removeEventListener('keydown',this._onKeyDown);
		window.removeEventListener('keyup',this._onKeyUp);
	},
	_onKeyDown:function(e){
		var self = this;
		if(e.metaKey || e.ctrlKey){
			DesignAction.updateCtrlPress(true);
		} else {
			DesignAction.updateCtrlPress(false);
		}
	},
	_onKeyUp:function(e){
		var self = this;
		DesignAction.updateCtrlPress(false)
	},
	_onResize:function(){
		var self = this;
		var resizeTimer = this.resizeTimer;
		this.layout();

		$('#designs .item').css('-webkit-filter','blur(5px)');
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			$('#designs .item').css('-webkit-filter','blur(0px)');
			self.designItemLayout();
		},500)
	},
	layout:function(){
		$('#designs-body').css('height',window.outerHeight-$('#system').outerHeight()-$('#designs-action').outerHeight());
		$('#designs-drag-over').css('height',window.outerHeight-$('#system').outerHeight()-$('#designs-action').outerHeight());
	},
	designItemLayout:function(){
		var body = {
			width:window.outerWidth,
		}
		var item = {
			width:150,
			margin:10
		}
		var itemWidth = item.width + item.margin*2;

		var leftover = body.width%itemWidth;
		var count = Math.floor((body.width/itemWidth));
		var newWidth = 150;
		var newMargin = item.margin + Math.floor(leftover/count)*0.5;

		var itemStyle = {
			width:newWidth,
			'margin':'0 ' + newMargin + 'px'
		};

		this.setState({
			itemStyle:itemStyle
		});
	},
	onFileDrop:function(e){
		e.preventDefault();
		$('#designs-drag-over').hide();

		var self = this;
		var files = e.dataTransfer.files;
		this.checkExtension(files)
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
		if(success.length > 0){
			for(var i=0; i<success.length; i++){
				var parsedFile = Files.parseFile(success[i]);
				var designObj = Files.parsePsd(parsedFile);
				DesignAPI.initDesign(designObj)
			}
		};
	},
	onFileDragOver:function(e){
		$('#designs-drag-over').show();
	},
	onFileDragLeave:function(e){
		$('#designs-drag-over').hide();
	},
	handleSelect:function(e){
		var a = $('#designs .item');
		if(!a.is(e.target)&& a.has(e.target).length == 0){
			DesignAction.changeSelect(null)
		}
	},
	render:function(){
		var _design = this.state._design;
		var _select = this.state._select;
		var itemStyle = this.state.itemStyle;

		if(_design == null) return null;

		var designItem = _design.map(function(design,idx){
			for(var i=0;i<_select.length;i++){
				if(_select[i].hash == design.hash) break;
			}
			if(i == _select.length){
				return <DesignItem idx={idx} key={design.name} design={design} itemStyle={itemStyle}/>
			} else {
				return <DesignItem idx={idx} key={design.name} design={design} isSelected={true} itemStyle={itemStyle} />
			}
		})

		return (
			<div id="designs-body" onDragOver={this.onFileDragOver} onClick={this.handleSelect}>
				<div id="designs-drag-over" onDrop={this.onFileDrop} onDragLeave={this.onFileDragLeave}></div>
				<div>
					{designItem}
				</div>
			</div>
		)
	}
});

const Guide = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout();
		this.guideTitleLayout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout();
		this.guideTitleLayout();
	},
	layout:function(){
		$('#designs-guide').css('height',window.outerHeight-$('#system').outerHeight()-$('#designs-action').outerHeight());
		$('#designs-drag-over').css('height',window.outerHeight-$('#system').outerHeight()-$('#designs-action').outerHeight());
	},
	guideTitleLayout:function(){
		var title = $('#designs-guide #title');
		title.css('width',$('#'))
	},
	onFileDrop:function(e){
		e.preventDefault();
		$('#designs-drag-over').hide();

		var self = this;
		var files = e.dataTransfer.files;
		var success = [];
		var error = "";

		for(var i=0;i<files.length;i++){
			var ext = Files.getExtension(files[i]);
			if(!ext.status) error += files[i].name + ", ";
			else {
				files[i].ext = ext.ext;
				success.push(files[i]);
			}
		};
		if(error.length > 0){
			Dialog.showMessageBox({
				browserWindow:BrowserWindow,
				type:'error',
				message:error.slice(0,error.length-2),
				detail:'Not supported',
				buttons:['Okay']
			});
		}

		if(success.length == 0) return null;
		else {
			for(var i=0;i<success.length;i++){
				var parsedFile = Files.parseFile(success[i]);
				var designObj = Files.parsePsd(parsedFile);
				DesignAPI.initDesign(designObj)
			}
		}
		e.target.value = null;
	},
	onFileDragOver:function(e){
		$('#designs-drag-over').show();
	},
	onFileDragLeave:function(e){
		$('#designs-drag-over').hide();
	},
	render:function(){
		return (
			<div id="designs-guide" onDrop={this.onFileDrop} onDragOver={this.onFileDragOver}>
				<div id="title">Drag your photoshop files here.</div>
				<div id="designs-drag-over" onDragLeave={this.onFileDragLeave}></div>
			</div>
		)
	}
})

const Designs = React.createClass({
	getInitialState:function(){
		return ({
			_design:DesignStore.getDesigns(),
			_select:DesignStore.getSelect()
		})
	},
	componentWillMount:function(){
		DesignStore.addChangeListener(this._onChange);
		if(this.state._design == null || this.state._design.length == 0){
			DesignAPI.receiveDesigns();
		}
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
		DesignStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		this.setState({
			_design:DesignStore.getDesigns(),
			_select:DesignStore.getSelect()
		})
	},
	_onResize:function(){
		this.layout()
	},
	layout:function(){
		$('#designs').css('height',window.outerHeight-$('#system').outerHeight());
		$('#designs').css('padding-top',$('#designs-action').outerHeight())
	},
	render:function(){
		var body;
		var _design = this.state._design;
		var _select = this.state._select;
		if(_design==null || _design.length == 0) body = <Guide />;
		else body = <Body _design = {_design} _select={_select} />;

		return (
			<div id="designs">
				<Action _design={_design} />
				{body}
			</div>
		)
	}
})


module.exports = Designs;