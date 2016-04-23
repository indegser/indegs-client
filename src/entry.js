var React = require('react');
var ReactDOM = require('react-dom');

// 컴포넌트
var Header = require('./Components/Indegs/Header.js');
var Guide = require('./Components/Indegs/Guide.js');

import Designs from './Components/Designs';
import Design from './Components/Design';
// import Project from './Components/Project';

// import Version from './Components/Version';

var IndegsStore = require('./Store/IndegsStore.js');

import RouteStore from './Store/RouteStore';

// API
import IndegsAPI from './API/IndegsAPI';
import UserAPI from './API/UserAPI';


// IndegsAPI.checkIndegs();

const Index = React.createClass({
	getInitialState:function(){
		return({
			guide:IndegsStore.getGuide(),
			route:RouteStore.getRoute()
		})
	},
	componentWillMount:function(){
		// 인덱스가 시동이 걸리면 반드시 체크해야하는 사항들
		// 1. 인덱스 디렉토리가 있는가
		// 2. 저장된 세션이 있는가
		IndegsAPI.checkIndegs();
		UserAPI.checkSession();
	},
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		IndegsStore.addChangeListener(this._onChange);
		RouteStore.addChangeListener(this._router);
		this.preventDrop();
		this.layout();
	},
	componentWillUnmount:function(){
		IndegsStore.removeChangeListener(this._onChange);
		RouteStore.removeChangeListener(this._router);
	},
	_onChange:function(){
		this.setState({
			guide:IndegsStore.getGuide()
		})
	},
	_router:function(){
		this.setState({
			route:RouteStore.getRoute()
		});
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#index-body').css('height',window.outerHeight);
	},
	preventDrop:function(){
		var holder = document.getElementById('index');
		holder.ondragover = function () {
			return false;
		};
		holder.ondragleave = function() {
			return false;
		};

		holder.ondragend = function () {
			return false;
		};
		holder.ondrop = function (e) {
			e.preventDefault();
			return false;
		};
	},
	onFileDrop:function(e){
		e.preventDefault()
	},
	render:function(){
		var route = this.state.route;
		var body;
		if(route == null) return null;
		switch(route.section){
			case 'project':
				body = <Project hash={route.hash}/>;
				break;
			case 'design':
				body = <Design hash={route.hash} page={route.page}/>;
				break;
			case 'designs':
				body = <Designs />;
				break;
		}

		return (
		<div id="index-body" onDrop={this.onFileDrop}>
			<Header />
			{body}
		</div>
		)
	}
})

ReactDOM.render(<Index />, document.getElementById('index'));
