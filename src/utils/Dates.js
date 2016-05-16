

module.exports = {
	getTimeStandard:function(){
		var res = {};
		var today = new Date();
		var lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));
		var lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
		var yesterday = new Date(new Date().setDate(today.getDate()-1));
		var hourAgo = new Date(new Date().setHours(today.getHours()-1));
		var minuteAgo = new Date(new Date().setMinutes(today.getMinutes()-1));

		res.today = today.getTime();
		res.lastYear = lastYear.getTime();
		res.lastMonth = lastMonth.getTime();
		res.yesterday = yesterday.getTime();
		res.hourAgo = hourAgo.getTime();
		res.minuteAgo = minuteAgo.getTime();
		return res;
	},
	getDesignDate:function(dateString){
		var date = new Date(dateString);
		var time = this.getTimeStandard();
		if(date.getTime()>=time.minuteAgo){
			// 바로 지금 업데이트 된 경우
			return 'just now'
		}
		if(date.getTime()>=time.hourAgo){
			// 한 시간 전에 업데이트 된 경우
			var diff = ((time.today-date.getTime())/1000/60).toFixed(0);
			return diff + ' minutes ago'
		}
		if(date.getTime()>=time.yesterday){
			// 하루 전에 업데이트되거나 추가된 경우
			var diff = ((time.today-date.getTime())/1000/60/60).toFixed(0);
			if(diff == 1){
				return 'an hour ago';
			} else {
				return diff + ' hours ago'
			}
		}
	},
	getVersionDate:function(date){
		var date = new Date(date);
		var month,AP,day;
		var year = date.getFullYear();
		var hour = date.getHours();
		var minute = date.getMinutes();
		day = (date.getDate()).toString();
		if(hour==0){
			hour = 12;
			AP = 'AM';
		} else if(hour>12){
			hour = (hour-12)
			AP = 'PM';
		} else if(hour<12){
			hour = hour;
			AP = 'AM';
		} else if(hour==12){
			hour = hour;
			AP = 'PM'
		};

		if(minute<10){
			minute = '0' + minute;
		}

		switch((date.getMonth()+1).toString()){
			case '1':
				month = 'Jan'
				break;
			case '2':
				month = 'Feb'
				break;
			case '3':
				month = 'Mar'
				break;
			case '4':
				month = 'Apr'
				break;
			case '5':
				month = 'May'
				break;
			case '6':
				month = 'Jun'
				break;
			case '7':
				month = 'Jul'
				break;
			case '8':
				month = 'Aug'
				break;
			case '9':
				month = 'Sept'
				break;
			case '10':
				month = 'Oct'
				break;
			case '11':
				month = 'Nov'
				break;
			case '12':
				month = 'Dec'
				break;
			default:
				return true;
		}
		var dateString = month + ' ' + day + ', ' + year + ', ' + hour + ':' + minute + ' ' + AP
		return dateString;
	}
}







