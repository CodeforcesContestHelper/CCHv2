var contestAllList = [];
var contestListUpdateTime;
$(".contestContent").click(function(){
	if(contestAllList.length == 0){
		contestListUpdateTime = new Date();
		
		return;
	}
	if((new Date()).getTime() - contestListUpdateTime.getTime() >= 20 * 60 * 1000){
		
	}
})