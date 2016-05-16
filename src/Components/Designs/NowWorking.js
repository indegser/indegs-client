import React from 'react';

import DesignAction from '../../Action/DesignAction';
import DesignStore from '../../Store/DesignStore';

import Utils from '../../utils/Utils';
import Dates from '../../utils/Dates';

const Info = React.createClass({
	render:function(){
		var design = this.props.design;
		var isSelected = this.props.isSelected;
		var title = Utils.getTitle(design);
		var date = Dates.getDesignDate(design.aDate);

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

const Item = React.createClass({
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

		return(
			<div id="now-working-item" style={itemStyle} onClick={this.selectDesign} onDoubleClick={this.handleDoubleClick} onContextMenu={this.contextMenu}>
				<Cover design={design} isSelected={isSelected}/>
				<Info design={design} isSelected={isSelected}/>
			</div>
		)
	}
});

const NowWorking = React.createClass({
	getInitialState:function(){
		var defaultStyle = {
			marginLeft:'-200px'
		}
		return ({
			nowWorking:DesignStore.getNowWorking(),
			style:defaultStyle
		})
	},
	componentDidMount:function(){
		DesignStore.addChangeListener(this._onChange);
		window.addEventListener('resize',this._onResize);
	},
	animateAppear:function(){
		this.setState({
			style:{
				marginLeft:'0px'
			}
		})
	},
	componentWillUnmount:function(){
		DesignStore.removeChangeListener(this._onChange);
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		return;
	},
	_onChange:function(){
		var self = this;
		this.setState({
			nowWorking:DesignStore.getNowWorking()
		},function(){
			self.animateAppear()
		})
	},
	layout:function(){
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
	render:function(){
		var style = this.state.style;
		var nowWorking = this.state.nowWorking;
		if(nowWorking != null) {
			var nowItem = <Item design={nowWorking} key={nowWorking.hash} />
		} else {
			return null;
		}
		return (
			<div id="now-working" style={style}>
				<div id="title">Now Working</div>
				<div id="item-holder">
					{nowItem}
					<div className="cb"></div>
				</div>
			</div>
		)
	}
});

module.exports = NowWorking;