function addWatcher(id, idx){
	var p = $(`<div class="singleWatchContent"><div class="singleWatchTitle">#${id} | ${idx}</div><div style="flex: 1; display: flex; flex-direction: row;"><div style="flex: 1; overflow: hidden; display: grid; place-items: center"><span class="singleWatchInfo">Pending...</span></div></div></div>`)
	p.css("transform", "scale(1, 0)");
	p.css("max-height", "0px");
	p.css("margin", "0");
	p.css("padding", "0");
	var IN = false;
	function fadeIn(){
		if(IN)	return;
		IN = true;
		$(".watchDisplayer").append(p);
		setTimeout(function(){p.attr("style", "");}, 100);
	}
	var lastJudgement = "";
	function fadeOut(lj){
		setTimeout(function(){
			if(!IN)	return;
			if(lj != lastJudgement)	return;
			IN = false;
			p.css("transform", "scale(1, 0)");
			p.css("max-height", "0px");
			p.css("margin", "0");
			p.css("padding", "0");
			setTimeout(function(){
				p.remove();
			}, 200);
		}, 5000);
	}
	fadeIn();
	function loadWatchType(){
		$.ajax({
			url: settings.mainURL + `/${getProblemIndexes(idx)[0] >= 100000 ? "gym" : "contest"}/` + getProblemIndexes(idx)[0] + '/submission/' + id,
			success: function(data){
				if(data.indexOf(`data-entityId="${id}"`) == -1){
					setTimeout(loadWatchType, 10000);
					return;
				}
				var ctL = $(data).find("table").eq(0).find("tr").eq(1);
				if(ctL.children().eq(4).children().eq(0).hasClass("verdict-accepted")){
					p.find(".singleWatchInfo").addClass("green");
				}
				if(ctL.children().eq(4).children().eq(0).hasClass("verdict-rejected")
				|| ctL.children().eq(4).children().eq(0).hasClass("verdict-failed")){
					p.find(".singleWatchInfo").addClass("red");
				}
				p.find(".singleWatchInfo").html(ctL.children().eq(4).text());
				if(ctL.children().eq(4).text() != lastJudgement)
					fadeIn(), fadeOut(ctL.children().eq(4).text());
				lastJudgement = ctL.children().eq(4).text();
				if(ctL.children().eq(4).children().eq(0).hasClass("verdict-waiting")
				|| lastJudgement == "In queue" || lastJudgement == "")
					setTimeout(loadWatchType, 1500);
				else if(settings.openNotification){
					new Notification(`Result of CF${idx}`, {body: ctL.children().eq(4).text().trim(), icon: '../favicon.png'});
				}
			},
			error: function(){
				setTimeout(loadWatchType, 1500);
			}
		})
	}
	setTimeout(function(){loadWatchType()}, 200);
}