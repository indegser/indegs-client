import credentials from '../utils/credentials';

module.exports = {
	post:function(_post,_session,callback){
		var self = this;
		var date = new Date();

		_post.A.author_id = _session._id;
		_post.B.author_id = _session._id;

		var card = {
			title:_post.title,
			description:_post.description,
			author_id:_session._id,
			A:{
				width:_post.A.width,
				height:_post.A.height
			},
			B:{
				width:_post.B.width,
				height:_post.B.height
			}
		}
		self.getSectionFormData(_post.A,function (A){
			self.getSectionFormData(_post.B,function (B){
				var formData = new FormData();
				formData.append('A',A,A.name);
				formData.append('B',B,B.name);
				formData.append('card',JSON.stringify(card));
				self.postCard(formData,function (cardObj){
					callback(cardObj)
				});
			})
		})
	},
	getSectionFormData:function(section,callback){
		var self = this;

		var origin = {
			type:'indegs-desktop',
			url:section.image
		}
		var salt = (Math.round((new Date().valueOf() * Math.random())) + "").slice(0,6);
		var image = self.createFileObject(section.image,salt,function(data){
			data.origin = origin;
			callback(data);
		})
	},
	createFileObject:function(path,name,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            var blob = xhr.response;
            blob.name = name;
            blob.lastModifiedDate = new Date();
            callback(blob)
        });
        xhr.send();
	},
	postCard:function(formData,callback){
		$.ajax({
			xhr: function(){
				var xhr = new window.XMLHttpRequest();
				//Upload progress
				xhr.upload.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with upload progress
						console.log(percentComplete);
					}
				}, false);
				//Download progress
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						//Do something with download progress
						console.log(percentComplete);
					}
				}, false);
				return xhr;
			},
			url:credentials.api_server + '/cards',
			type:'POST',
			contentType:false,
			processData:false,
			data:formData,
			success:function(result){
				if(result.status){
					callback(result.body)
				} else {
					console.log(result.body);
				}
			}		
		})
	}
}