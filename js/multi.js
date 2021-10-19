function loadMultiList(cid, users, room, showUnofficial, S, E){
	var data = {};
	data.contestId = cid;
	if(users != undefined && users.length != 0)
		data.handles = users.join(",");
	if(room != undefined)
		data.room = room;
	data.showUnofficial = showUnofficial;
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + '/contest.standings', data),
		timeout: settings.largeTimeLimit,
		success: function(json){
			if(json.status != "OK")
				E();
			else
				S(json.result);
		},
		error: function(){
			E();
		},
		xhr: function() {
			var xhr = new XMLHttpRequest();
			var q = 0;
			singleLoadType = 1; reloadSingleMemoryUsed();
			xhr.addEventListener('progress', function (e) {
				 // (e.loaded - q);
				 q = e.loaded;
			});
			return xhr;
		}
	})
}

