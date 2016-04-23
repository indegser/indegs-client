module.exports = {
	getExtension:function(file){
		var self = this;
		var extObj = file.name.split('.');
		var ext = extObj[extObj.length-1];

		if(ext.toLowerCase() == 'psd'){
			return {
				status:true,
				ext:'psd'
			}
		} else {
			return {
				status:false
			}
		}
	},
	parsePsd:function(obj){
		var psd = PSD.fromFile(obj.path);
		psd.parse();
		obj.width = psd.header.width;
		obj.height = psd.header.height;
		if(psd.header.mode == '3'){
			obj.colorMode = 'rgb'
		} else {
			obj.colorMode = 'cmyk'
		}
		return obj;
		// DesignAPI.linkDesign(obj,design);
	},
	parseFile:function(file){
		var obj = {
			name: file.name,
			path: file.path,
			size: file.size,
			aDate: new Date(),
			mDate: file.lastModifiedDate,
			ext: file.ext
		}
		return obj;
	}
}