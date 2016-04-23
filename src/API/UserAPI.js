import credentials from '../utils/credentials';
import UserAction from '../Action/UserAction';
import Utils from '../utils/Utils.js';



module.exports = {
	checkSession:function(){
		var json = Utils.receiveData(Utils.userJson);
		if(json==null) UserAction.updateSession(null);
		else UserAction.updateSession(json);
	},
	handleLogin:function(data,callback){
		var self = this;
		$.ajax({
			url: credentials.api_server + '/users/login',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result){
				if(result.status){
					if(data.remember){
						var userObj = {
							_id:result.body._id,
							email:result.body.email,
							name:result.body.name,
							pic:result.body.pic
						}
						self.writeUserJson(userObj)
					}
					UserAction.updateSession(result.body)
				} else {
					callback(result.message)
				}
			}
		});
	},
	writeUserJson:function(userObj){
		fs.writeFileSync(Utils.userJson,JSON.stringify(userObj,null,4),'utf8');
	},
	handleLogout:function(){
		UserAction.updateSession(null)
		this.deleteUserJson()
	},
	deleteUserJson:function(userObj){
		fse.removeSync(Utils.userJson)
	}
}