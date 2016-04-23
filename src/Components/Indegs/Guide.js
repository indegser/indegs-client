var React = require('react');
var Utils = require('../../utils/Utils.js');

var IndegsAPI = require('../../API/IndegsAPI.js');
var IndegsAction = require('../../Action/IndegsAction.js');
var IndegsStore = require('../../Store/IndegsStore.js');

IPC.on('im-initialize-end',function(event){
	IndegsAPI.updateImageMagick(true);
});

const InitialGuide = React.createClass({
	getInitialState:function(){
		return({
			status:IndegsStore.getStatus()
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		IndegsStore.addChangeListener(this._onChange);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
		IndegsStore.removeChangeListener(this._onChange);
	},
	_onChange:function(){
		this.setState({
			status:IndegsStore.getStatus()
		})
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#initial-guide').css('margin-top',-$('#initial-guide').height()*0.5);
	},
	handleClick:function(){
		IndegsAction.changeGuide(2)
	},
	render:function(){
		var start;
		var status = this.state.status;
		var sen = "Designer's perfection result in countless decisions and changes.";
		if(status){
			start = <div id="guide-start-holder" onClick={this.handleClick}>
						<div id="initial-guide-start">Start</div>
						<div id="initial-guide-btn"></div>
					</div>
		} else {
			start = <div id="guide-loader-holder">
						<div id="initial-guide-loader-text">initializing indegs (can take a minute)</div>
						<div id="initial-guide-loader"></div>
					</div>
		}
		return (
			<div id="initial-guide">
				<div id="initial-guide-title">indegs.</div>
				<div id="initial-guide-subtitle">Love your perfection</div>
				<div className="initial-guide-text" id="initial-guide-text">{sen}</div>
				{start}
			</div>
		)
	}
});
const DesignPageGuide = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#design-page-guide').css('margin-top',-$('#design-page-guide').height()*0.5);
	},
	goNext:function(){
		IndegsAction.changeGuide(3);
	},
	goBack:function(){
		IndegsAction.changeGuide(1);
	},
	animateImage:function(e){
		$(e.target).css('margin-top','-200px');
		$(e.target).css('opacity','1');
	},
	render:function(){
		return (
			<div id="design-page-guide">
				<div className="guide-title">Manage your</div>
				<div className="guide-title">Photoshop files</div>
				<div className="guide-title">in one place</div>
				<div className="guide-space"></div>
				<div className="guide-text">Every Photoshop file in indegs comes with beautifull thumbnail.</div>
				<div className="guide-text">In indegs, it is called as "Design Cover"</div>
				<div className="previous-holder" onClick={this.goBack}>
					<div className="previous-text">Back</div>
					<div className="previous-btn"></div>
				</div>
				<div className="next-holder" onClick={this.goNext}>
					<div className="next-text">Next</div>
					<div className="next-btn"></div>
				</div>
				<img src='../images/indegs-mac.png' onLoad={this.animateImage} id="design-page-image" />
			</div>
		)
	}
});

const VersionCreateGuide = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#version-create-guide').css('margin-top',-$('#version-create-guide').height()*0.5);
	},
	goNext:function(){
		IndegsAction.changeGuide(4);
	},
	goBack:function(){
		IndegsAction.changeGuide(2);
	},
	animateImage:function(e){
		$(e.target).css('left','660px');
		$(e.target).css('opacity','1');
	},
	render:function(){
		return (
			<div id="version-create-guide">
				<div className="guide-title">While design-ing,</div>
				<div className="guide-title">[Save] your file.</div>
				<div className="guide-title">You just created a version.</div>
				<div className="guide-space"></div>
				<div className="guide-text">Versions are named with '#' and automatically thumbnailed. </div>
				<div className="guide-text">You can leave work message on the bottom side of each version.</div>
				<div className="previous-holder" onClick={this.goBack}>
					<div className="previous-text">Back</div>
					<div className="previous-btn"></div>
				</div>
				<div className="next-holder" onClick={this.goNext}>
					<div className="next-text">Next</div>
					<div className="next-btn"></div>
				</div>
				<img src='../images/version-guide.png' onLoad={this.animateImage} id="version-create-image" />
			</div>
		)
	}
});

const VersionPageGuide = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#version-page-guide').css('margin-top',-$('#version-page-guide').height()*0.5);
	},
	goNext:function(){
		IndegsAction.changeGuide(5);
	},
	goBack:function(){
		IndegsAction.changeGuide(3);
	},
	animateImage:function(e){
		$(e.target).css('margin-top','-225px');
		$(e.target).css('opacity','1');
	},
	render:function(){
		return (
			<div id="version-page-guide">
				<div className="guide-title">If you prefer</div>
				<div className="guide-title">previous version</div>
				<div className="guide-title">Just Revert to it.</div>
				<div className="guide-space"></div>
				<div className="guide-text">Version is visual history that you can always go back to.</div>
				<div className="previous-holder" onClick={this.goBack}>
					<div className="previous-text">Back</div>
					<div className="previous-btn"></div>
				</div>
				<div className="next-holder" onClick={this.goNext}>
					<div className="next-text">Next</div>
					<div className="next-btn"></div>
				</div>
				<img src='../images/revert-guide.png' onLoad={this.animateImage} id="revert-guide-image" />
			</div>
		)
	}
});

const VersionGcGuide = React.createClass({
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		IPC.send('test-git',Utils.indegsDir+'icon/');
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
	},
	resize:function(){
		this.layout();
	},
	layout:function(){
		$('#version-gc-guide').css('margin-top',-$('#version-gc-guide').height()*0.5);
	},
	goNext:function(){
		IndegsAction.showGuide(false);
	},
	goBack:function(){
		IndegsAction.changeGuide(4);
	},
	animateImage:function(e){
		$(e.target).css('margin-top','-239.5px');
		$(e.target).css('opacity','1');
	},
	render:function(){
		return (
			<div id="version-gc-guide">
				<div className="guide-title">Versions are changes.</div>
				<div className="guide-title">indegs compresses</div>
				<div className="guide-title">repeated data.</div>
				<div className="guide-space"></div>
				<div className="guide-text">if this message appears. Click [install].</div>
				<div className="guide-text">It is necessary for version data compression.</div>
				<div id="git-message"></div>
				<div className="previous-holder" onClick={this.goBack}>
					<div className="previous-text">Back</div>
					<div className="previous-btn"></div>
				</div>
				<div className="next-holder" onClick={this.goNext}>
					<div className="next-text">Next</div>
					<div className="next-btn"></div>
				</div>
				<img src='../images/gc-guide.png' onLoad={this.animateImage} id="gc-guide-image" />
			</div>
		)
	}
});


const Guide = React.createClass({
	getInitialState:function(){
		return({
			guideRoute:IndegsStore.getGuideRoute()
		})
	},
	componentDidMount:function(){
		window.addEventListener('resize',this.layout);
		IndegsStore.addChangeListener(this._onChange);
		this.layout();
	},
	componentWillUnmount:function(){
		window.removeEventListener('resize',this.layout);
		IndegsStore.removeChangeListener(this._onChange);
	},
	resize:function(){
		this.layout();
	},
	_onChange:function(){
		this.setState({
			guideRoute:IndegsStore.getGuideRoute()
		})
	},
	layout:function(){
		$('#indegs-guide').css('height',window.outerHeight-50);
	},
	render:function(){
		var guideRoute = this.state.guideRoute;
		var guide;
		if(guideRoute == 1){
			guide = <InitialGuide />
		}
		if(guideRoute == 2){
			guide = <DesignPageGuide />
		}
		if(guideRoute == 3){
			guide = <VersionCreateGuide />
		}
		if(guideRoute == 4){
			guide = <VersionPageGuide />
		}
		if(guideRoute == 5){
			guide = <VersionGcGuide />
		}
		return (
			<div id="indegs-guide">
				<div id="indegs-guide-nbsp">&nbsp</div>
				{guide}
			</div>
		)
	}
})

module.exports = Guide;