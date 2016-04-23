import React from 'react';
const shell = remote.require('shell');

import CompareAPI from '../../API/CompareAPI';
import CompareAction from '../../Action/CompareAction';
import CompareStore from '../../Store/CompareStore';
import UserStore from '../../Store/UserStore';

const PostTitle = React.createClass({
	getInitialState:function(){
		return({
			title:''
		})
	},
	submitInput:function(e){
		var title = this.state.title;
		if(title != null){
			CompareAction.updatePostTitle(title);
		}
		$(e.target).attr('placeholder','Title');
	},
	handleEnter:function(e){
		if(e.which == 13){
			$(e.target).blur()
		}
	},
	handleChange:function(e){
		this.setState({
			title:e.target.value
		});
	},
	changePlaceholder:function(e){
		$(e.target).attr('placeholder','ex) Movie Poster AB');
	},
	resize:function(e){
		var obj = $(e.target).context;
		obj.style.height = "1px";
		obj.style.height = (20+obj.scrollHeight)+"px";
	},
	render:function(){
		return (
			<div id="post-title">
				<textarea type="text" id="post-title-input" name="post-title" placeholder="Title" onClick={this.changePlaceholder} onBlur={this.submitInput} onKeyPress={this.handleEnter} onKeyUp={this.resize} onChange={this.handleChange} value={this.state.title} spellCheck="false" autoCorrect="off" autoComplete="off" />
			</div>
		)
	}
});

const PostText = React.createClass({
	getInitialState:function(){
		return({
			text:''
		})
	},
	submitInput:function(e){
		var text = this.state.text;
		if(text != null){
			function replaceAll(str, target, replacement) {
			    return str.split(target).join(replacement);
			};
			var replacement = replaceAll(text, '\n', '<br/>');
			CompareAction.updatePostText(replacement)
		}
	},
	handleEnter:function(e){
		// if(e.which == 13){
		// 	$(e.target).blur()
		// }
	},
	handleChange:function(e){
		this.setState({
			text:e.target.value
		});
	},
	resize:function(e){
		var obj = $(e.target).context;
		obj.style.height = "1px";
		obj.style.height = (20+obj.scrollHeight)+"px";
	},	
	render:function(){
		return (
			<div id="post-text">
				<textarea id="post-text-input" name="post-text" placeholder="Description (optional)" onBlur={this.submitInput} onKeyUp={this.resize} onKeyPress={this.handleEnter} onChange={this.handleChange} value={this.state.text} spellCheck="false" autoCorrect="off" autoComplete="off"/>
			</div>
		)
	}
});

const PostView = React.createClass({
	render:function(){
		var _compare = this.props._compare;
		return (
			<div id="post-view"></div>
		)
	}
});

const PostSubmit = React.createClass({
	handleSubmit:function(e){
		var session = UserStore.getSession();
		$(e.target).css('background','url("../images/loader.gif") 130% 50% / 90px no-repeat');
		$(e.target).css('background-color','white');
		$(e.target).css('border','none');
		$(e.target).text('');
		var _compare = CompareStore.getCompare();
		var _post = CompareStore.getPost();
		var postObj = {
			title:_post.title,
			text:_post.text,
			A:_compare.A,
			B:_compare.B,
			session:session
		}

		CompareAPI.postCompare(postObj,function(cardObj){
			CompareAction.togglePost(false);
			shell.openExternal('http://localhost:3030/');
		});
	},
	render:function(){
		return (
			<div id="post-submit" onClick={this.handleSubmit} >Post</div>
		)
	}
})

const Post = React.createClass({
	getInitialState:function(){
		return ({
			right:'-400px',
			_compare:this.props._compare
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this._onResize);
		this.layout();
		this.initTransition();
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			_compare:nextProps._compare
		})
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
		$('#post').css('height',windowHeight-systemHeight-actionHeight);
	},
	initTransition:function(){
		this.setState({
			right:'0px'
		})
	},
	render:function (){
		var _compare = this.state._compare;
		var right = this.state.right;
		var postStyle = {
			right:right
		}
		return (
			<div id="post" style={postStyle} >
				<div id="title">Share your perfection</div>
				<PostTitle />
				<PostText />
				<PostView _compare={_compare} />
				<PostSubmit />
			</div>
		)
	}
})
module.exports = Post;