var React = require('react');

var Utils = require('../../utils/Utils.js');
var DesignAPI = require('../../API/DesignAPI.js');

const Guide = React.createClass({
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
		$('#design-guide').css('height',windowHeight-systemHeight-35);
		$('#design-guide').css('width',windowWidth)
		$('#design-guide-holder').css('margin-top',-$('#design-guide-holder').outerHeight()*0.5);
	},
	handleClick:function(e){
		$('#add-input').click()
	},
	handleChange:function(e){
		var self = this;
		var file = e.target.files;
		for(var i=0;i<file.length;i++){
			self.checkExtension(file[i])
		}
		e.target.value = null;
	},
	onFileDrop:function(e){
		var self = this;
		e.preventDefault();
		var file = e.dataTransfer.files;
		for(var i=0;i<file.length;i++){
			self.checkExtension(file[i])
		}
		e.target.value = null;
	},
	checkExtension:function(file){
		var self = this;
		var ext = Utils.getExtension(file.path)
		if(ext.toLowerCase() == 'psd'){
			var obj = {name:file.name,path:file.path,size:file.size,mdate:file.lastModifiedDate,ext:ext}
			self.parsePSD(obj)
		} else {
			Dialog.showMessageBox({
				browserWindow:BrowserWindow,
				type:'error',
				message:ext +' file is not supported yet',
				detail:file.name.slice(0,file.name.slice-4),
				buttons:['Okay']
			})
		}
	},
	parsePSD:function(obj){
		var psd = PSD.fromFile(obj.path);
		psd.parse();
		obj.width = psd.header.width;
		obj.height = psd.header.height;
		DesignAPI.initDesign(obj);
	},
	render:function(){
		return(
			<div id="design-guide" onDrop={this.onFileDrop}>
				<div id="design-guide-holder">
					<div id="design-guide-title">Index design</div>
					<div id="design-guide-box">
						<div id="design-guide-text">Click [New Design] button or drag design files here to start</div>
						<div id="design-guide-btn" onClick={this.handleClick}>New Design</div>
						<input type="file" multiple id="add-input" onChange={this.handleChange}/>
					</div>
				</div>
			</div>
		)
	}
})



module.exports = Guide;