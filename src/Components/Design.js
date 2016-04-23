import React from 'react';

import VersionAPI from '../API/VersionAPI';
import VersionStore from '../Store/VersionStore';
import VersionAction from '../Action/VersionAction';

import DesignStore from '../Store/DesignStore';

import Version from './Version';
import Compare from './Compare';

const Loader = React.createClass({
	render:function(){
		return (
			<div id="design-loader"></div>
		)
	}
})

const Design = React.createClass({
	getInitialState:function(){
		return ({
			_version:VersionStore.getVersions(),
			_loader:VersionStore.getLoader(),
			col:VersionStore.getLayoutOption()
		})
	},
	componentWillMount:function(){
		VersionStore.addChangeListener(this._onChange);
		var hash = this.props.hash;
		var parent = DesignStore.getDesignByHash(hash);
		VersionAction.updateParent(parent);
		VersionAPI.receiveVersions(hash);
	},
	componentWillUnmount:function(){
		VersionStore.removeChangeListener(this._onChange);
		VersionAction.clearVersion();
	},
	_onChange:function(){
		this.setState({
			_version:VersionStore.getVersions(),
			_loader:VersionStore.getLoader(),
			col:VersionStore.getLayoutOption()
		})
	},
	render:function(){
		// 라우팅과 관련된 것들
		var hash = this.props.hash;
		var page = this.props.page;

		var _version = this.state._version;
		var _loader = this.state._loader;
		var loading;
		var col = this.state.col;
		var body;

		// for(var i=0;i<_loader.length;i++){
		// 	if(_loader[i].hash == parent.hash){
		// 		break;
		// 	}
		// }
		// if(i == _loader.length){
		// 	loading = false;
		// } else {
		// 	loading = true;
		// }

		// 디자인 페이지 라우트
		if(page=='version') body = <Version hash={hash} _version={_version} col={col} />;
		else if(page=='compare') body = <Compare hash={hash} _version={_version} />;

		return (
			<div id="design">
				{body}
			</div>
		)
	}
});

module.exports = Design;