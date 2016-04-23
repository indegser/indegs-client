import React from 'react';

import Action from './Compare/Action';
import Post from './Compare/Post';

import VersionAPI from '../API/VersionAPI';

import CompareAction from '../Action/CompareAction';
import CompareStore from '../Store/CompareStore';

import RouteAction from '../Action/RouteAction';



import Utils from '../utils/Utils';
import Dates from '../utils/Dates';


const VersionDate = React.createClass({
	render:function(){
		var dateString;
		var date = this.props.date;
		var dateString = Dates.getDateString(date);

		return (
			<div className="date">{dateString}</div>
		)
	}
});

const VersionMessage = React.createClass({
	getInitialState:function(){
		return ({
			message:this.props.version.message
		})
	},
	submitInput:function(e){
		var version = this.props.version;
		var message = this.state.message;
		version.message = message;
		VersionAPI.updateVersionMessage(version)
		$(e.target).attr('placeholder','Write a message explaining this version.(optional)')
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
		var message = this.state.message;
		var width = this.props.width;
		if(width <= 300){
			width = '100%'
		} else {
			width = width;
		}
		return (
			<div className="message">
			<input type="text" style={{"width":width}} maxLength={50} className="version-message-input" onBlur={this.submitInput} onClick={this.changePlaceholder}onKeyPress={this.handleEnter} onChange={this.handleChange} value={message} placeholder="Write a message explaining this version.(optional)"></input>
			</div>
		)
	}
})

const Item = React.createClass({
	getInitialState:function(){
		return ({
			version:this.props.version,
			opacity:0
		})
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			version:nextProps.version
		},function(){
			self.layout()
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout();
		this.clearAppearAnimation();
	},
	clearAppearAnimation:function(){
		var self = this;
		var version = this.state.version;
		var img = new Image();
		img.onload = function(){
			self.setState({
				opacity:1
			})
		}
		img.src = version.image;
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout();
	},
	layout:function(){
		var self = this;
		var version = this.state.version;

		// 지금은 AB만 지원하므로 col을 2로 설정한다
		var col = 2;
		var x;
		if(col == 1) x = 1;
		if(col == 2) x = 0.5;
		if(col == 3) x = 0.3333333;

		var windowWidth = $(window).outerWidth();
		var windowHeight = $(window).height();
		var systemHeight = $('#system').outerHeight();
		var actionHeight = 35;
		var searchHeight = 70;

		var body = {
			width:windowWidth,
			height:windowHeight - systemHeight - searchHeight
		}

		var item = {
			width:body.width*x,
			height:null,
			padding:{
				h:20*2,
				v:20*1
			},
			ratio:body.width*x/body.height
		}

		var extra = {
			date:20+10,
			input:22
		}
		var imageWidth,imageHeight;
		var extraHeight = extra.date + extra.input + item.padding.h + item.padding.v;
		var ratio = version.width/version.height;


		// 이제 이미지 스타일을 구한다
		var image = {};

		if(ratio <= 1 && ratio <= item.ratio){
			// 세로가 극단적으로 긴 경우
			image.height = body.height - extraHeight;
			image.width = ratio * image.height;
		}
		if(ratio <= 1 && ratio > item.ratio){
			// 세로가 가로보다 길지만, 홀더보단 비율이 큰 경우
			if(ratio <= (item.width-item.padding.h)/(body.height-extraHeight)){
				image.height = body.height - extraHeight;
				image.width = ratio * image.height;
			} else {
				image.width = item.width - item.padding.h;
				image.height = image.width * version.height/version.width;
			}
		}
		if(ratio > 1 && ratio <= item.ratio){
			// 가로가 세로보다 길지만, 홀더의 비율보단 작은 경우
			image.height = body.height - extraHeight;
			image.width = ratio * image.height;
		}
		if(ratio > 1 && ratio > item.ratio){
			// 가로가 극단적으로 긴 경우
			if(ratio <= (item.width-item.padding.h)/(body.height-extraHeight)){
				image.height = body.height - extraHeight;
				image.width = ratio * image.height;
			} else {
				image.width = item.width - item.padding.h;
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
		});
	},
	render:function(){
		var self = this;
		var version = this.state.version;
		var itemStyle = this.state.itemStyle;
		var imageStyle = this.state.imageStyle;
		if(itemStyle == null || imageStyle == null) return null;
		var imgStyle = {};
		imgStyle.opaciy = this.state.opacity;
		imgStyle.width = imageStyle.width;
		imgStyle.height = imageStyle.height;

		return (
			<div style={itemStyle} className="compare-item">
				<img className="compare-img" src={version.image} style={imgStyle} />
				<VersionDate date={version.mDate} />
				<VersionMessage width={imageStyle.width} version={version} />
			</div>
		)
	}
})

const NotFound = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout()
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout()
	},
	layout:function(){
		var windowWidth = $(window).outerWidth();
		var windowHeight = $(window).height();
		var systemHeight = $('#system').outerHeight();
		var actionHeight = 35;
		var searchHeight = 70;

		var body = {
			width:windowWidth,
			height:windowHeight-systemHeight-actionHeight-searchHeight
		}
		$('.compare-404').css('height',body.height);
	},
	render:function(){
		var version = this.props.version;
		return (
			<div className="compare-404">
				<div className="title">{'We could not find #' + version.name}</div>
				<div className="exp">Maybe version is being converted right now?</div>
			</div>
		)
	}
})

const View = React.createClass({
	componentDidMount:function(){
		this.resizeTimer;
		this.layout();
		window.addEventListener('resize',this._onResize);
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this._onResize);
	},
	_onResize:function(){
		this.layout();
		var resizeTimer = this.resizeTimer;
		$('#compare .compare-item').css('webkit-filter','blur(3px)');
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			$('#compare .compare-item').css('webkit-filter','blur(0px)');
		},50);
	},
	layout:function(){
		var windowWidth = $(window).outerWidth();
		var windowHeight = $(window).height();
		var systemHeight = $('#system').outerHeight();
		var actionHeight = 35;
		var searchHeight = 70;
		$('.compare-section').css('height',windowHeight-systemHeight-actionHeight-searchHeight)
	},
	render:function(){
		var _compare = this.props._compare;
		var A = _compare.A;
		var B = _compare.B;
		var itemA,itemB;
		if(A == null){
			itemA = null;
		} else {
			// status는 찾음의 유무
			if(A.status){
				itemA = <Item version={A} />
			} else {
				itemA = <NotFound version={A} />
			}
		}

		if(B == null){
			itemB = null;
		} else {
			// status는 찾음의 유무
			if(B.status){
				itemB = <Item version={B} />
			} else {
				itemB = <NotFound version={B} />
			}
		}
		return (
			<div className="compare-view">
				<div className="compare-section">
					{itemA}
				</div>
				<div className="compare-section">
					{itemB}
				</div>
				<div className="cb"></div>
			</div>
		)
	}
})


const SearchInput = React.createClass({
	getInitialState:function(){
		return ({
			value:(this.props.value||'')
		})
	},
	submitInput:function(e){
		var section = this.props.section;
		var value = e.target.value;

		// Input에 아무것도 없는 경우
		if(value.length == 0 || value == '#') CompareAction.emptySection(section);
		else {
			var sharpCount = (value.match(/#/g)||[]).length;
			var data = {
				section:section,
				value:value.slice(sharpCount,value.length)
			}
			CompareAction.updateCompare(data)
		}
	},
	handleChange:function(e){
		var self = this;
		var value = e.target.value;
		var section = this.props.section;
		var sharpCount = (value.match(/#/g)||[]).length;

		// Input을 다 지운 경우 ()
		if(value.length == 0){
			self.setState({
				value:value
			},function(){
				CompareAction.emptySection(section)
			})
		} else if(value.length == 1){
			// #이 포함되어 있지 않는 경우 (1)
			if(value.indexOf('#') < 0){
				self.setState({
					value:'#' + value
				})
			} else {
				// #이 포함되어 있는데 숫자가 없는 경우 (#)
				self.setState({
					value:'#'
				},function(){
					CompareAction.emptySection(section);
				});
			}
		} else {
			// #이 두 개 이상 들어있는 경우 (##1)
			if(sharpCount > 1){
				// 전부다 #인 경우 (###)
				if(value.length == sharpCount){
					self.setState({
						value:'#'
					},function(){
						CompareAction.emptySection(section)
					})
				} else {
					// 숫자가 포함되어 있는데 #이 여러개인 경우 (###2)
					self.setState({
						value:value.slice((sharpCount-1),value.length)
					})
				}
			} else {
				// 정상적인 경우 (#1)
				self.setState({
					value:value
				})
			}
		}

		var data = {
			section:section,
			value:value.slice(sharpCount,value.length)
		}
		CompareAction.updateCompare(data)
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	render:function(){
		var value = this.state.value;

		return (
			<input type="text" className="search-input" onBlur={this.submitInput} onKeyPress={this.handleEnter} onChange={this.handleChange} value={value} placeholder="#" />
		)
	}
})

const Search = React.createClass({
	getInitialState:function(){
		return ({
			_version:this.props._version,
			_compare:this.props._compare
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			_version:nextProps._version,
			_compare:nextProps._compare
		})
	},
	render:function(){
		var _version = this.state._version;
		var _compare = this.state._compare;

		return (
			<div id="compare-search">
				<div className="search-section">
					<SearchInput section={'a'} />
				</div>
				<div className="search-section">
					<SearchInput section={'b'} />
				</div>
				<div className="cb"></div>
			</div>
		)
	}
});

const Compare = React.createClass({
	getInitialState:function(){
		return ({
			_version:this.props._version,
			_post:CompareStore.getPost(),
			_compare:CompareStore.getCompare()
		})
	},
	componentWillMount:function(){
		CompareAction.updateVersions(this.props._version)
	},
	componentDidMount:function(){
		CompareStore.addChangeListener(this._onChange);
		window.addEventListener("keydown",this.handleBackspace);
	},
	componentWillUnmount:function(){
		CompareStore.removeChangeListener(this._onChange);
		window.removeEventListener("keydown",this.handleBackspace);
		CompareAction.emptyCompare()
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		this.setState({
			_version:nextProps._version
		},function(){
			CompareAction.updateVersions(self.props._version)
		})
	},
	_onChange:function(){
		this.setState({
			_compare:CompareStore.getCompare(),
			_post:CompareStore.getPost()
		})
	},
	handleBackspace:function(e){
		var id = e.keyCode;
		var _version = this.state._version;
		var hash = _version[0].parent.hash;
		
		if($('.search-input').is(':focus') || $('#login-holder input').is(':focus') || $('.compare-item .message input').is(':focus') || $('#post-title-input').is(':focus') || $('#post-text-input').is(':focus')){
			return null;
		} else {
			if(id==8 || id==46){
				RouteAction.changeRoute('/design/'+ hash +'/version');
			}
		}
	},
	render:function(){
		var _version = this.state._version;
		var _compare = this.state._compare;
		var _post = this.state._post;
		var view;
		if(_compare==null) view = null;
		else view = <View _compare={_compare} />;

		if(_post == null){
			var post = null;
		} else {
			var post = <Post _compare={_compare} />
		}

		return (
			<div id="compare">
				<Action _version={_version} />
				{post}
				<Search _version={_version} _compare={_compare} />
				{view}
			</div>
		)
	}
})

module.exports = Compare;