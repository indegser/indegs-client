var React = require('react');
var ReactDOM = require('react-dom');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var clipboard = remote.require('clipboard');
var Utils = require('../utils/Utils.js');

var DesignAPI = require('../API/DesignAPI.js');
var DesignAction = require('../Action/DesignAction.js');
var VersionAPI = require('../API/VersionAPI.js');
var VersionAction = require('../Action/VersionAction.js');
var VersionStore = require('../Store/VersionStore.js');

import Action from './Version/Action';

import RouteAction from '../Action/RouteAction';

// IPC.on('git-delete-finish',function(event,version){
// 	VersionAPI.pruneVersion(version)
// });
// IPC.on('git-prune-finish',function(event,version){
// 	VersionAction.showLoader(version,false)
// })

const VersionMessage = React.createClass({
	getInitialState:function(){
		return({
			message:this.props.version.message
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			message:nextProps.version.message
		})
	},
	submitInput:function(e){
		var version = this.props.version;
		var versionJson = Utils.getVersionJson(version.parentHash);
		var message = this.state.message;
		version.message = message;
		Utils.rewriteWithKey(version,versionJson,'message');
		$(e.target).attr('placeholder','Leave your work message')
	},
	changePlaceholder:function(e){
		$(e.target).attr('placeholder','Press [Enter] to save your message');
		$(e.target).css('background-color','white !important');
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(e){
		this.setState({
			message:e.target.value
		});
		$(e.target).css('background-color','white !important');
	},
	render:function(){
		var width = this.props.width;
		if(width <= 300){
			width = '100%'
		} else {
			width = width;
		}
		return (
			<div className="version-message">
			<input type="text" style={{"width":width}} maxLength={50} className="version-message-input" onBlur={this.submitInput} onClick={this.changePlaceholder}onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.message} placeholder="Leave your work message"></input>
			</div>
		)
	}
});

const VersionImage = React.createClass({
	getInitialState:function(){
		return ({
			opacity:0
		})
	},
	componentDidMount:function(){
		this.clearAppearAnimation()
	},
	clearAppearAnimation:function(){
		var self = this;
		var version = this.props.version;
		var img = new Image();
		img.onload = function(){
			self.setState({
				opacity:1
			})
		}
		img.src = version.image;
	},
	contextMenu:function(e){
		var version = this.props.version;
		var status = this.props.status;
		var idx = this.props.idx;
		var enabled;
		var revertLabel,deleteLabel
		if(idx == 0){
			enabled = false;
			deleteLabel = 'Latest Version cannot be deleted';
			revertLabel = 'Latest Version cannot be reverted';
		} else {
			if(status == false){
				enabled = false;
				deleteLabel = "Unlinked design's version cannot be deleted";
				revertLabel = "Unlinked design's version cannot be deleted";
			} else {
				enabled = true;
				deleteLabel = 'Delete Version';
				revertLabel = 'Revert Version';
			}
		}
		var menu = new Menu();
		menu.append(new MenuItem({
			label:'Open',
			click:function(){
				fsOpen(version.image)
			}
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:revertLabel,
			click:function(){
				var confirm = Dialog.showMessageBox({
					browserWindow: BrowserWindow,
					type: 'question',
					message: 'Do you want to revert to selected version?',
					detail: 'When revert is finished, [re-open] your design file to check successful revert',
					buttons: ['Revert','Cancel']
				});
				if(confirm == 0){
					$('#version-body').animate({scrollTop:0},300,function(){
						VersionAPI.revertVersion(version)
					});
				}
			},
			enabled:enabled
		}));
		menu.append(new MenuItem({type:'separator'}));
		menu.append(new MenuItem({
			label:deleteLabel,
			click:function(){
				var _select = VersionStore.getSelect();
				var deleteArray = [];
				// 셀렉션이 있는가 우선 확인한다.
				if(_select == null || _select.length == 0){
					deleteArray.push(version)
				} else {
					deleteArray = _select;

					// 셀렉된 것에 현재 디자인이 포함되어 있는지 체크한다.
					for(var i=0;i<_select.length;i++){
						if(_select[i].hash == version.hash){
							break;
						}
					}
					// 포함되어 있지 않다면 deleteArray에 추가한다
					if(i == _select.length){
						deleteArray.push(version)
					}
				};
				var confirm = Dialog.showMessageBox({
					browserWindow: BrowserWindow,
					type: 'question',
					message: 'Do you want to move the selected version(s) to the Trash?',
					detail: 'Version data will be deleted',
					buttons: ['Move to trash','Cancel']
				});
				if(confirm == 0){
					// 제거할 것에 최신 버전이 들어가 있다면 경고를 띄워준다
					var latest = VersionStore.getLatestVersion();
					for(var i=0;i<deleteArray.length;i++){
						if(deleteArray[i].hash == latest.hash){
							break;
						}
					}
					if(i != deleteArray.length){
						Dialog.showMessageBox({
							browserWindow:BrowserWindow,
							type:'error',
							message:'Version #' + latest.name + ' will not be deleted',
							detail:'Latest version cannot be deleted',
							buttons:['Okay']
						});
						deleteArray.splice(i,1);
					}
					for(var i=0;i<deleteArray.length;i++){
						VersionAPI.deleteVersion(deleteArray[i]);
					}
				}
			},
			enabled:enabled
		}));
		menu.popup(BrowserWindow);
	},
	handleSelect:function(){
		var version = this.props.version;
		VersionAction.changeSelect(version);
	},
	render:function(){
		var self = this;
		var version = this.props.version;
		var imageStyle = this.props.imageStyle;
		var versionStyle = {};
		var holderStyle = {};
		versionStyle.width = (+imageStyle.width).toFixed(0) + 'px';
		versionStyle.height = (+imageStyle.height).toFixed(0) + 'px';
		holderStyle.width = +parseInt(versionStyle.width) + 6 + 'px';
		holderStyle.height = +parseInt(versionStyle.height) + 6 + 'px';
		holderStyle.opacity = this.state.opacity;

		return(
			<div className="version-img-holder" style={holderStyle} onClick={this.handleSelect}>
				<img style={versionStyle} className="version-img" onContextMenu={this.contextMenu} src={version.image} />
			</div>
		)
	}
})

const VersionItem = React.createClass({
	getInitialState:function(){
		return({
			col:this.props.col,
			version:this.props.version,
			isSelected:this.props.isSelected
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		var isSelected = this.state.isSelected;
		this.setState({
			col:nextProps.col,
			version:nextProps.version,
			isSelected:nextProps.isSelected
		},function(){
			self.layout()
		})
	},
	_onResize:function(){
		this.layout();
	},
	layout:function(){
		var self = this;
		var version = this.state.version;
		var col = this.state.col;

		var x;
		if(col == 1) x = 1;
		if(col == 2) x = 0.5;
		if(col == 3) x = 0.3333333;
		var windowWidth = $(window).outerWidth();
		var windowHeight = $(window).height();
		var systemHeight = $('#system').outerHeight();

		var body = {
			width:windowWidth,
			height:windowHeight-systemHeight
		}

		// #version의 가로 세로 값을 변수로 정의한다
		// 40은 #version의 측면 패딩 값이다
		var item = {
			width:body.width*x,
			height:null,
			padding:{
				h:20*2,
				v:20*2
			},
			ratio:body.width*x/body.height
		}

		var imageHolder = {
			padding:{
				h:3*2,
				v:3*2
			}
		}

		var extra = {
			date:20,
			input:20,
			name:30
		}
		var imageWidth,imageHeight;
		var extraHeight = extra.date + extra.input + extra.name + item.padding.h + item.padding.v;
		var ratio = version.width/version.height;


		// 이제 이미지 스타일을 구한다
		var image = {};

		if(ratio <= 1 && ratio <= item.ratio){
			// 세로가 극단적으로 긴 경우
			image.height = body.height - extraHeight - imageHolder.padding.v;
			image.width = ratio * image.height;
		}
		if(ratio <= 1 && ratio > item.ratio){
			// 세로가 가로보다 길지만, 홀더보단 비율이 큰 경우
			if(ratio <= (item.width-item.padding.h)/(body.height-extraHeight)){
				image.height = body.height - extraHeight - imageHolder.padding.v;
				image.width = ratio * image.height;
			} else {
				image.width = item.width - item.padding.h - imageHolder.padding.h;
				image.height = image.width * version.height/version.width;
			}
		}
		if(ratio > 1 && ratio <= item.ratio){
			// 가로가 세로보다 길지만, 홀더의 비율보단 작은 경우
			image.height = body.height - extraHeight - imageHolder.padding.v;
			image.width = ratio * image.height;
		}
		if(ratio > 1 && ratio > item.ratio){
			// 가로가 극단적으로 긴 경우
			if(ratio <= (item.width-item.padding.h)/(body.height-extraHeight)){
				image.height = body.height - extraHeight - imageHolder.padding.v;
				image.width = ratio * image.height;
			} else {
				image.width = item.width - item.padding.h - imageHolder.padding.h;
				image.height = image.width * version.height/version.width;
			}
		}
		var itemStyle = {
			width:item.width
		}
		var imageStyle = {
			width:image.width,
			height:image.height
		}
		this.setState({
			itemStyle:itemStyle,
			imageStyle:imageStyle
		},function(){
			self.props.loaded(self.props.idx)
		});
	},
	render:function(){
		var self = this;
		var version = this.state.version;
		var itemStyle = this.state.itemStyle;
		var imageStyle = this.state.imageStyle;
		var isSelected = this.state.isSelected;
		if(itemStyle == null || imageStyle == null) return null;
		var idx = this.props.idx;
		var dateObj = Utils.getParsedDate(version.mDate);
		var date = dateObj.month + ' ' + dateObj.day + ', ' + dateObj.hour + ':' + dateObj.minute + ' ' + dateObj.AP;

		var itemClass;
		if(isSelected){
			itemClass = 'version-item version-item-selected';
		} else {
			itemClass = 'version-item';
		}


		return(
			<div style={itemStyle} className={itemClass} id={'version-item-'+idx} >
				<VersionImage idx={idx} imageStyle={imageStyle} version={version} status={this.props.status} isSelected={isSelected} />
				<div className="version-counter">{'#' + version.name}</div>
				<div className="version-date">{date}</div>
				<VersionMessage width={imageStyle.width} version={version} />
			</div>
		)
	}
});

const Body = React.createClass({
	getInitialState:function(){
		return({
			_select:this.props._select,
			_version:this.props._version,
			col:this.props.col
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout();
		this.heightFix();
		this.resizeTimer;
		this.loaded = [];
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			_version:nextProps._version,
			_select:nextProps._select,
			col:nextProps.col
		},function(){
			self.heightFix();
		})
	},
	_onResize:function(){
		var self = this;
		this.layout();
		this.heightFix();

		// 리사이징 블러 애니메이션
		var resizeTimer = this.resizeTimer;
		$('#version .version-item').css('-webkit-filter','blur(3px)');
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			$('#version .version-item').css('-webkit-filter','blur(0px)');
		},50)
	},
	layout:function(){
		var self = this;
		var windowHeight = $(window).outerHeight();
		var windowWidth = $(window).outerWidth();
		var systemHeight = $('#system').outerHeight();
		$('#version-body').css('width',windowWidth);
		$('#version-body').css('height',windowHeight-systemHeight-35);
		// this.heightFix()
	},
	onChildLoad:function(idx){
		var self = this;
		var loaded = this.loaded;
		loaded.push(idx);
		var _version = this.state._version;
		if(loaded.length%3 == _version.length%3){
			loaded = [];
			self.heightFix();
		}
	},
	heightFix:function(){
		var _version = this.state._version;
		var col = this.state.col;
		for(var i=0;i<_version.length;i++){
			$('#version-item-'+i).css('height','')
			if(col == 2){
				if(i%2 == 1){
					var ratioA = _version[i].width/_version[i].height;
					var ratioB = _version[i-1].width/_version[i-1].height;
					var A = $('#version-item-'+i);
					var B = $('#version-item-'+(i-1));
					if(ratioA>=ratioB){
						A.css('height',B.outerHeight())
					} else {
						B.css('height',A.outerHeight())
					}
				}
			}
			if(col == 3){
				if(i%3 == 2){
					var ratioA = _version[i].width/_version[i].height;
					var ratioB = _version[i-1].width/_version[i-1].height;
					var ratioC = _version[i-2].width/_version[i-2].height;
					var A = $('#version-item-'+i);
					var B = $('#version-item-'+(i-1));
					var C = $('#version-item-'+(i-2));
					if(ratioA<ratioB){
						if(ratioA<ratioC){
							A.css('height',A.outerHeight());
							B.css('height',A.outerHeight());
							C.css('height',A.outerHeight());
						} else {
							A.css('height',C.outerHeight());
							B.css('height',C.outerHeight());
							C.css('height',C.outerHeight());
						}
					} else {
						if(ratioB<ratioC){
							A.css('height',B.outerHeight());
							B.css('height',B.outerHeight());
							C.css('height',B.outerHeight());
						} else {
							A.css('height',C.outerHeight());
							B.css('height',C.outerHeight());
							C.css('height',C.outerHeight());
						}
					}
				}
			}		
		}
	},
	nullSelect:function(e){
		var _select = this.state._select;
		if(_select.length != 0){
			var a = $('.version-img');
			if(!a.is(e.target)&& a.has(e.target).length == 0){
				VersionAction.changeSelect(null)
			}
		}
	},
	render:function(){
		var self = this;
		var _version = this.state._version;
		var _select = this.state._select;
		var col = this.state.col;

		// 버전아이템 생성
		var versionItem = _version.map(function(version,idx){
			for(var i=0; i<_select.length; i++){
				if(_select[i].hash == version.hash) break;
			}
			if(i == _select.length){
				return <VersionItem key={version.name} idx={idx} col={col} version={version} loaded={self.onChildLoad} />
			} else {
				return <VersionItem key={version.name} idx={idx} col={col} version={version} loaded={self.onChildLoad} isSelected={true}/>
			}
		});

		return (
			<div id="version-body" onClick={this.nullSelect} >
				{versionItem}
			</div>
		)
	}
});



const Version = React.createClass({
	getInitialState:function(){
		return({
			_select:VersionStore.getSelect(),
			_version:this.props._version,
			col:this.props.col
		});
	},
	componentWillMount:function(){
		VersionStore.addChangeListener(this._onSelectChange);
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		window.addEventListener("keydown",this._onKeyDown);
		window.addEventListener("keyup",this._onKeyUp);
		this.layout();
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			_version:nextProps._version,
			col:nextProps.col
		});
	},
	componentWillUnmount:function(){
		VersionStore.removeChangeListener(this._onSelectChange);
		window.removeEventListener('resize',this.layout);
		window.removeEventListener('keydown',this._onKeyDown);
		window.removeEventListener('keyup',this._onKeyUp);
	},
	_onSelectChange:function(){
		this.setState({
			_select:VersionStore.getSelect()
		})
	},
	_onResize:function(){
		this.layout();
	},
	_onKeyDown:function(e){
		this.handleBackspace(e);
		this.handleCtrl(e);
	},
	_onKeyUp:function(e){
		this.handleCtrlFalse(e);
	},
	layout:function(){
		var self = this;
		var windowHeight = $(window).outerHeight();
		var windowWidth = $(window).outerWidth();
		var systemHeight = $('#system').outerHeight();
		$('#version').css('width',windowWidth);
		$('#version').css('height',windowHeight-systemHeight);
		// this.heightFix()
	},
	handleBackspace:function(e){
		var id = e.keyCode;
		if($('.version-message-input').is(':focus') || $('#login-holder input').is(':focus')){
			return null;
		} else {
			if(id==8 || id==46){
				RouteAction.changeRoute('/designs');
				VersionAction.clearVersion();
			}
		}
	},
	handleCtrl:function(e){
		var self = this;
		if(e.metaKey || e.ctrlKey){
			VersionAction.updateCtrlPress(true);
		} else {
			VersionAction.updateCtrlPress(false);
		}
	},
	handleCtrlFalse:function(e){
		VersionAction.updateCtrlPress(false);
	},
	render:function(){
		var self = this;
		var hash = this.props.hash;
		var _version = this.state._version;
		var _select = this.state._select;
		var col = this.state.col;

		return (
			<div id="version">
				<Action hash={hash}/>
				<Body _version={_version} _select={_select} col={col} />
			</div>
		)
	}
});

module.exports = Version;