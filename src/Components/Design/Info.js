var React = require('react');
var DesignAPI = require('../../API/DesignAPI.js');
var DesignAction = require('../../Action/DesignAction.js');
var DesignStore = require('../../Store/DesignStore.js');
var Utils = require('../../utils/Utils.js');

const SelectedLink = React.createClass({
	handleClick:function(e){
		$('#selected-status-input').click()
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
		var select = this.props.select;
		var psd = PSD.fromFile(obj.path);
		psd.parse();
		obj.width = psd.header.width;
		obj.height = psd.header.height;
		DesignAPI.linkDesign(obj,select);
	},
	render:function(){
		return (
			<div>
				<div className="selected-status-value" id="selected-status-relink" onClick={this.handleClick} >Relink</div>
				<input type="file" id="selected-status-input" onChange={this.handleChange} />
			</div>
		)
	}
})

const SelectedStatus = React.createClass({
	render:function(){
		var select = this.props.select;
		var value;
		if(select.status == false){
			value = <SelectedLink select={select} />
		} else {
			value = <div className="selected-status-value">Safe</div>
		}
		return (
			<div className="selected-status">
				<div className="selected-status-field">Status</div>
				{value}
			</div>
		)
	}
})

const SelectedInfo = React.createClass({
	render:function(){
		var selected = this.props.select;
		var title = selected.name.slice(0,selected.name.length - (selected.ext.length+1));
		var dateObj = Utils.getParsedDate(selected.mDate);
		var date = dateObj.month + ' ' + dateObj.day + ',   ' + dateObj.hour + ':' + dateObj.minute + ' ' + dateObj.AP;
		return (
			<div id="selected-info">
				<SelectedStatus select={selected}/>
				<div id="selected-info-field">Modified</div>
				<div className="selected-info-value">{date}</div>
				<div id="selected-info-field">Version</div>
				<div className="selected-info-value">{selected.counter}</div>
			</div>
		)
	}
})
const IndegsInfo = React.createClass({
	getInitialState:function(){
		return({
			designLength:DesignStore.getDesignLength(),
			_design:DesignStore.getDesign(),
			versionLength:0
		})
	},
	componentDidMount:function(){
		DesignStore.addChangeListener(this._onChange);
		this.countTotalVersion()
	},
	componentWillUnmount:function(){
		DesignStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		var self = this;
		this.setState({
			designLength:DesignStore.getDesignLength(),
			_design:DesignStore.getDesign()
		},function(){
			self.countTotalVersion()
		})
	},
	countTotalVersion:function(){
		var self = this;
		var total = 0;
		var _design = this.state._design;
		_design.map(function(design){
			total += design.counter;
		})
		this.setState({
			versionLength:total
		})
	},
	render:function(){
		var designLength = this.state.designLength;
		var versionLength = this.state.versionLength;
		return (
			<div id="indegs-info">
				<div className="indegs-info-field">Design</div>
				<div className="indegs-info-value">{designLength}</div>
				<div className="indegs-info-field">Version</div>
				<div className="indegs-info-value">{versionLength}</div>
			</div>
		)
	}
})

const SelectedBlur = React.createClass({
	// getInitialState:function(){
	// 	var select = this.props.select;
	// 	return({
	// 		cover:select.cover,
	// 		select:select
	// 	})
	// },
	// componentDidMount:function(){
	// 	var self = this;
	// 	self.hoverAnimation()
	// },
	// componentWillReceiveProps:function(nextProps){
	// 	var self = this;
	// 	var nextSelect = nextProps.select;
	// 	var select = this.props.select;
	// 	if(nextSelect.hash != select.hash){
	// 		self.setState({
	// 			cover:nextSelect.cover,
	// 			select:nextSelect
	// 		},function(){
	// 			clearInterval(self.hoverTime)
	// 			self.hoverAnimation()
	// 		});
	// 	}
	// },
	// componentWillUnmount:function(){
	// 	var self = this;
	// 	clearInterval(self.hoverTime)
	// },
	// hoverAnimation:function(){
	// 	var self = this;
	// 	var select = this.state.select;
	// 	var path = Utils.getDesignPath(select.name,select.hash);
	// 	var _version = Utils.receiveData(path.versionJson);
	// 	if(_version.length != 1){
	// 		var byCounter = function(a,b){
	// 			if(a.counter < b.counter){return 1};
	// 			if(a.counter > b.counter){return -1};
	// 			return 0;
	// 		}

	// 		_version.sort(byCounter);
	// 		var cnt = 0;
	// 		self.hoverTime = setInterval(function(){
	// 			if(cnt<_version.length){
	// 				var url = _version[cnt].cover;
	// 				self.setState({
	// 					cover:url
	// 				});
	// 				cnt++;
	// 			} else {
	// 				cnt = 0;
	// 			}
	// 		},700)
	// 	}

	// },
	render:function(){
		var url = this.props.select.cover.replace(/\\/g,"/");
		return (
			<div id="selected-blur" style={{backgroundImage:'url("' + url + '")'}}></div>
		)
	}
})

const Info = React.createClass({
	getInitialState:function(){
		return({
			select:this.props.select
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			select:nextProps.select
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
	},
	_onResize:function(){
		this.layout();
	},
	layout:function(){
		var self = this;
		var windowHeight = $(window).outerHeight();
		var windowWidth = $(window).outerWidth();
		var systemHeight = $('#system').outerHeight();
		$('#design-info').css('height',windowHeight-systemHeight-35);
	},
	render:function(){
		var select= this.state.select;
		var info,blur,className;
		if(select == null){
			info = <IndegsInfo />;
			blur = null;
			className = null;
		} else {
			info = <SelectedInfo select={select} />;
			blur = <SelectedBlur select={select} />
			className = 'design-info-selected'
		}
		return (
			<div id="design-info" className={className}>
				{info}
				{blur}
			</div>
		)
	}
})

module.exports = Info;