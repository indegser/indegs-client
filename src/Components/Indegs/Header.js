var React = require('react');
var osInfo = IPC.sendSync('os-info');
const shell = remote.require('shell');

import credentials from '../../utils/credentials';

import UserAPI from '../../API/UserAPI';
import UserStore from '../../Store/UserStore';
import RouteStore from '../../Store/RouteStore';
import RouteAction from '../../Action/RouteAction';

const WindowBtn = React.createClass({
	getInitialState:function(){
		return ({
			fullscreen:false
		})
	},
 	componentDidMount:function(){
 		window.addEventListener('resize',this.handleResize);
 	},
 	componentWillUnMount:function(){
 		window.removeEventListener('resize',this.handleResize);
 	},
 	handleClick:function(event){
 		var self = this;
 		if(event.target.id === 'window-min'){
 			BrowserWindow.minimize();
 		} else if(event.target.id === 'window-close') {
 			BrowserWindow.hide();
 		} else {
 			if(self.state.fullscreen === true){
 				BrowserWindow.unmaximize();
 				self.setState({fullscreen:false})
 			} else {
 				BrowserWindow.maximize();
 				self.setState({fullscreen:true})
 			}
 		}
 	},
 	handleResize:function(){
 		var self = this;
 		if(BrowserWindow.isMaximized()){
 			self.setState({fullscreen:true})
 		} else {
 			self.setState({fullscreen:false})
 		}
 	},
 	render:function(){
 		var max;
 		if(this.state.fullscreen){
 			max = <div className="window-btn" id="window-max-off" onClick={this.handleClick}></div>
 		} else {
 			max = <div className="window-btn" id="window-max" onClick={this.handleClick}></div>
 		};
 		return (
 			<div id="window-action">
 				<div className="window-btn" alt="ddd" id="window-min" onClick={this.handleClick}></div>
 				{max}
 				<div className="window-btn" id="window-close" onClick={this.handleClick}></div>
 			</div>
 		)
 	}

});

const LoginBox = React.createClass({
	getInitialState:function(){
		return({
			message:null,
			value:''
		})
	},
	componentDidMount:function(){
		var self = this;
		document.body.addEventListener('click',this.handleBodyClick);
		document.body.addEventListener('keypress',this.handleEnter);

	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick);
		document.body.removeEventListener('keypress',this.handleEnter);
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#login-holder');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleEnter:function(e){
		var self = this;
		if(e.which == 13){
			self.submit()
		}
	},
	submit:function(){
		var self = this;
		var remember = $('#login-remember-input').is(':checked');
		var json = {
			email:$('#login-email-input').val(),
			pw:$('#login-pw-input').val(),
			remember:remember
		};
		UserAPI.handleLogin(json,function (message){
			self.shakeForm()
			self.setState({
				message:message
			})
		})
	},
	shakeForm:function(e){
		var l = 10;  
		for( var i = 0; i < 8; i++ ){  
			$( "#login-holder" ).animate( { 
				'left': "+=" + ( l = -l ) + 'px',
				'right': "-=" + l + 'px'
			}, 50);  
		}
	},
	handleEmail:function(e){
		var value = $(e.target).val()
		this.setState({
			value:value
		})
	},
	goSignup:function(){
		shell.openExternal('http://indegs.com/join')
	},
	render:function(){
		var message = this.state.message;
		var title,titleStyle;
		if(message != null){
			title = message
			titleStyle = {'color':'#ff4242'}
		} else {
			title = 'Welcome Back !';
			titleStyle = null;
		}

		return (
			<div id="login-holder">
				<div id="login-title" style={titleStyle}>{title}</div>
				<div id="login-email">
					<input type="email" autoCorrect="off" spellCheck="false" name="email" id="login-email-input" placeholder="Email address" onChange={this.handleEmail} value={this.state.value} ></input>
				</div>
				<div id="login-pw">
					<input type="password" name="pw" id="login-pw-input" placeholder="Password"></input>
				</div>
				<div id="login-remember" onClick={this.handleRemember}>
					<input type="checkbox" defaultChecked={true} id="login-remember-input" />
					<span id="text">Remember me</span>
				</div>
				<div id="login-submit" onClick={this.submit}> Sign In ></div>
				<div id="login-signup">
					<span onClick={this.goSignup}>Create indegs account ></span>
				</div>
			</div>
		)
	}
});

const OffBtn = React.createClass({
	getInitialState:function(){
		return ({
			toggle:false
		})
	},
	toggleModal:function(){
		this.setState({
			toggle:true
		})
	},
	toggleFalse:function(){
		this.setState({
			toggle:false
		})
	},
	render:function(){
		var toggle = this.state.toggle;
		var loginModal;
		if(toggle) loginModal = <LoginBox toggle={this.toggleFalse}/>;
		else loginModal = null;

		return (
			<div id="login-off-btn" onClick={this.toggleModal}>
				<div id="title">Sign In ></div>
				<div id="off-pic"></div>
				<div className="cb"></div>
				{loginModal}
			</div>
		)
	}
});

const ProfileBox = React.createClass({
	componentDidMount:function(){
		var self = this;
		document.body.addEventListener('click',this.handleBodyClick)
	},
	componentWillUnmount:function(){
		document.body.removeEventListener('click',this.handleBodyClick)
	},
	handleBodyClick:function(e){
		var self = this;
		var a = $('#profile-modal');
		if(!a.is(e.target)&&a.has(e.target).length == 0){
			self.props.toggle(false)
		}
	},
	handleLogout:function(){
		UserAPI.handleLogout()
		// AppAPI.handleLogout()
	},
	toggleBox:function(){
		this.props.toggle(false)
	},
	handleChange:function(){
		return null;
	},
	selectAll:function(e){
		$(e.target).select()
	},
	render:function(){
		var session = this.props.session;
		// var value = 'http://indegs.com/users/57063e101fda892137ec7245'
		var value = 'http://indegs.com/users/'+session._id; 

		return (
			<div id="profile-modal">
				<div id="name">{session.name}</div>
				<div id="email">{'( ' +session.email +' )'}</div>
				<div id="link">
					<div id="link-title">Public repository</div>
					<div id="link-question">
						<span>Copy below link and paste it in any browsers.</span>
						<span>Need help?</span>
					</div>
					<input onFocus={this.selectAll} id="link-input" type="text" value={value} onChange={this.handleChange}></input>
				</div>
				<div className="item" id="logout" onClick={this.handleLogout}>Log out</div>
			</div>
		)
	}
})

const UserPic = React.createClass({
	handleImageLoad:function(e){
		var image = $(e.target);
		image.parent().children('#loader').css('display','none');
	},
	render:function(){
		var session = this.props.session;
		var src;
		if(session.pic != null){
			src = credentials.image_server + '/' + session.pic;
		} else {
			src = null;
		}

		return (
			<div id="image-holder">
				<div id="loader"></div>
				<img src={src} id="image" onLoad={this.handleImageLoad} />
			</div>
		)
	}
});

const OnBtn = React.createClass({
	getInitialState:function(){
		return({
			session:this.props.session,
			toggle:false
		})
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			session:nextProps.session
		})
	},
	toggleProfile:function(){
		this.setState({
			toggle:true
		})
	},
	onToggle:function(bool){
		this.setState({
			toggle:false
		})
	},
	render:function(){
		var self = this;
		var session = this.state.session;
		var toggle = this.state.toggle;

		if(toggle){
			var profileBox = <ProfileBox session={session} toggle={self.onToggle}/>;
		} else {
			var profileBox = null;
		}

		return (
			<div id="login-on-btn">
				<div id="profile" onClick={this.toggleProfile}>
					<UserPic session={session} />
				</div>
				{profileBox}
			</div>
		)
	}
});

const User = React.createClass({
	getInitialState:function(){
		return ({
			session:UserStore.getSession(),
			toggle:false
		})
	},
	componentDidMount:function(){
		UserStore.addChangeListener(this._onChange);
	},
	componentWillUnmount:function(){
		UserStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		this.setState({
			session:UserStore.getSession()
		})
	},
	toggleLogin:function(){
		var self = this;
		this.setState({
			toggle:true
		})
	},
	toggleFalse:function(){
		this.setState({
			toggle:false
		})
	},
	render:function(){
		var session = this.state.session;
		var defaultBtn;

		if(session==false){
			return null;
		} else if(session==null){
			defaultBtn = <OffBtn session={session} />
		} else {
			defaultBtn = <OnBtn session={session}/>
		}

		return (
			<div id="header-user">
				{defaultBtn}
			</div>
		)
	}
})

const System = React.createClass({
	getInitialState:function(){
		return({
			fullscreen:false
		})
	},
 	componentDidMount:function(){
 		window.addEventListener('resize',this.handleResize);
 	},
 	componentWillUnMount:function(){
 		window.removeEventListener('resize',this.handleResize);
 	},
 	handleResize:function(){
 		var self = this;
 		if(BrowserWindow.isMaximized()){
 			self.setState({fullscreen:true})
 		} else {
 			self.setState({fullscreen:false})
 		}
 	},
	windowResize:function(e){
		var self = this;
		var a = $('#header-user');
		if(a.is(e.target)||a.has(e.target).length>0) return null;
		if(self.state.fullscreen == true){
			BrowserWindow.unmaximize();
			self.setState({fullscreen:false})
		} else {
			BrowserWindow.maximize();
			self.setState({fullscreen:true})
		}
	},
 	render: function(){
 		// 운영체제에 따라서 윈도우 버튼을 다르게 보여줌
 		var windowBtn;
 		if(osInfo.osType == "Darwin"){
			windowBtn = null;
		} else if(osInfo.osType == "Windows_NT"){
			windowBtn = <WindowBtn />;
		}
 		return (
 			<div id="system" onDoubleClick={this.windowResize}>
				<div id="logo"></div>
				<User />
				{windowBtn}
 			</div>
 		)
 	}
});

module.exports = System;