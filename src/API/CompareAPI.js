import credentials from '../utils/credentials';

module.exports = {
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
	postImage:function(obj,callback){
		var split = obj.image.split('/');
		var name = split[split.length-1];
		this.createFileObject(obj.image,name, function(image){
			var formData = new FormData();
			formData.append('image',image,image.name);
			$.ajax({
				url:credentials.api_server + '/cards/image',
				type:'POST',
				contentType:false,
				processData:false,
				data:formData,
				success:function(result){
					if(result.status){
						callback(result.body);
					} else {
						console.log(result.body);
					}
				}
			})	
		})
	},
	postCompare:function(postObj,callback){
		var self = this;
		var date = new Date();
		postObj.A.authorId = postObj.session._id;
		postObj.B.authorId = postObj.session._id;
		postObj.A.date = date;
		postObj.B.date = date;

		var data = {
			title:postObj.title,
			text:postObj.text,
			authorId:postObj.session._id,
			date:date
		}
		self.postImage(postObj.A, function(A){
			data.A = A._id;
			self.postImage(postObj.B, function(B){
				data.B = B._id;
				$.ajax({
					url:credentials.api_server + '/cards',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						if(result.status){
							callback(result.body)
							// AppAPI.updatePublished(result.body);
							// CardAction.updateCard(result.body);
							// AppHistory.push('/')
						} else {
							console.log(result.body)
						}
					}
				})
			})
		})
	}
}