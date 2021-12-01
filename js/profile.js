function getPP(data, frcd){
	var cnt = [];
	for(var i=0; i<40; i++)
		cnt.push(0);
	var calc = {};
	for(var i=0; i<data.length; i++){
		var q = data[i];
		var p = q.problem.contestId + q.problem.index
		if(q.verdict == "OK" && q.problem.rating != undefined && calc[p] == undefined
			&& (!frcd || q.author.participantType == "CONTESTANT" || q.author.participantType == "OUT_OF_COMPETITION"))
			++ cnt[q.problem.rating / 100], calc[p] = true;
	}
	var pp = 0;
	var o = 100;
	var acc = 100;
	var m = 0.0;
	var q = 1.0;
	for(var i=99; i>=0; i--){
		m += q;
		q *= 0.95;
	}
	for(var i=39; i>=0; i--){
		while(cnt[i] && o){
			pp += acc * i;
			-- cnt[i]; -- o;
			acc *= 0.95;
		}
	}
	pp /= m;
	return (pp.toFixed(2));
}
function getACCounts(data){
	var calc = {};
	var ans = 0;
	for(var i=0; i<data.length; i++){
		var q = data[i];
		var p = q.problem.contestId + q.problem.index;
		if(q.verdict == "OK" && calc[p] == undefined)
			++ ans, calc[p] = true;
	}
	return ans;
}

var profileInfoCurrentAsked = "";
var profileInfoDatas = [{}, [], [], {}];
var profileInfoLoaded = [false, false, false];
var profileInfoLoaders = [null, null, null];

$(".inputOptionsUsername").click(function(){
	$(".infoChangeUsernameWindow").css("display", "grid");
	setTimeout(function(){
		$(".infoChangeUsernameWindow").css("opacity", "1");
	}, 100);
})
$(".closeInfoChangeUsername").click(function(){
	$(".infoChangeUsernameWindow").css("opacity", "0");
	setTimeout(function(){
		$(".infoChangeUsernameWindow").css("display", "none");
	}, 500);
})
var profileRatingCharts = null, maxLabel = null;
function profileDrawGraph(data){
	if(profileRatingCharts != null)
		profileRatingCharts.destroy();
	// var dt = 0;
	// for(var i=0; i<data.length; i++)
	// 	if(data[dt] < data[i])
	// 		dt = i;
	// if(data.length != 0)
	// 	data[dt][1] = {y: data[dt][1], fillColor: 'red'};
	Highcharts.setOptions((DarkMode) ? DarkUnica : DefaultStyle);
	var chart = {
		type: 'line',
		animation: Highcharts.svg, // don't animate in IE < IE 10.
		zoomType: 'x'
	};
	var title = {
		text: null
	};
	var xAxis = {
		type: 'datetime',
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%m-%d',
			week: '%m-%d',
			month: '%Y-%m',
			year: '%Y'
		},
		gridLineWidth : 1
	};
	var yAxis = {
		title: {
			text: null
		},
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%Y-%m-%d',
			week: '%m-%d',
			month: '%Y-%m',
			year: '%Y'
		},
		gridLineColor: "transparent",
		// tickPositions: [1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000],
		plotLines: [
			{
				color: '#CCCCCC',
				from: -9999,
				to: 1200
			},
			{
				color: '#77FF77',
				from: 1200,
				to: 1400
			},
			{
				color: '#77DDBB',
				from: 1400,
				to: 1600
			},
			{
				color: '#AAAAFF',
				from: 1600,
				to: 1900
			},
			{
				color: '#FF88FF',
				from: 1900,
				to: 2100
			},
			{
				color: '#FFCC88',
				from: 2100,
				to: 2300
			},
			{
				color: '#FFBB55',
				from: 2300,
				to: 2400
			},
			{
				color: '#FF7777',
				from: 2400,
				to: 2600
			},
			{
				color: '#FF3333',
				from: 2600,
				to: 3000
			},
			{
				color: '#AA0000',
				from: 3000,
				to: 9999
			},
		]
	};
	var tooltip = {
		borderRadius: 5,
		formatter: function () {
			if(profileInfoDatas[3][this.x] == undefined)
				return "";
			var val = profileInfoDatas[1][profileInfoDatas[3][this.x]];
			return `<b><span info="Rank">${languageOption.general.Rank}</span>: ` + val.rank + ' | '
			+ `<span info="Rating">${languageOption.general.Rating}</span>: ` + val.oldRating + " >> " + val.newRating + '</b><br/>'
			+ `#` + val.contestId + ' | ' + val.contestName + '<br/>'
			+ Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x);
		}
	};
	var plotOptions = {
		area: {
			pointStart: 1940,
			marker: {
				enabled: false,
				symbol: 'circle',
				radius: 2,
				states: {
					hover: {
					  enabled: true
					}
				}
			}
		},
		series: { 
            cursor: 'pointer', 
            events: { 
                click: function(e) {
                	if(profileInfoDatas[3][e.point.x] == undefined)
                		return;
                	var val = profileInfoDatas[1][profileInfoDatas[3][e.point.x]];
                	$("[for=singleContent]").click();
                	loadSingleInformation(0, val.handle, val.contestId, new Date(), true);
                } 
            } 
        } 
	};
	var legend = {
		enabled: false
	};
	var exporting = {
		enabled: false
	};
	var series= [{
		name: 'rating',
		data: data
	}];
	var credits = {
		enabled: false
	}
	var json = {};
	json.chart = chart; 
	json.title = title;	  
	json.tooltip = tooltip;
	json.xAxis = xAxis;
	json.yAxis = yAxis; 
	json.legend = legend;  
	json.exporting = exporting;	
	json.series = series;
	json.plotOptions = plotOptions;
	json.credits = credits;
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	profileRatingCharts = Highcharts.chart("infoRatingGraphContainer", json);
}
function infoLoadUsername(un){
	$("[for=infoContent]").click();
	for(var i=0; i<=2; i++)
		if(profileInfoLoaders[i] != null)
			profileInfoLoaders.abort();
	var hCode = (new Date()).getTime();
	profileInfoCurrentAsked = un + '#' + hCode;
	profileInfoDatas = [{}, [], []];
	profileInfoLoaded = [false, false, false]
	$(".infoShowProblems").addClass("disabled");
	$(".infoShowSubmissions").addClass("disabled");
	$(".infoUserBlock").css("opacity", 0);
	$(".infoGraphBlock").css("opacity", 0);
	$(".infoProblemSubmitted span").html("-");
	$(".infoProblemAccept span").html("-");
	$(".infoProblemContestPP span").html("-");
	$(".infoProblemPracticePP span").html("-");
	$(".infoUserAvatar").attr("src", "");
	function infoLoadData(id, url, S){
		$(".infoLoaders" + id + "> i").attr("class", "fas fa-hourglass-half");
		profileInfoLoaders[id] = $.ajax({
			url: url,
			success: function(json){
				profileInfoLoaders[id] = null;
				if(un + '#' + hCode != profileInfoCurrentAsked)
					return;
				if(json.status != "OK")
					$(".infoLoaders" + id + "> i").attr("class", "fas fa-unlink red");
				else{
					$(".infoLoaders" + id + "> i").attr("class", "fas fa-check green");
					S(json.result);
				}
			},
			error: function(){
				profileInfoLoaders[id] = null;
				if(un + '#' + hCode != profileInfoCurrentAsked)
					return;
				$(".infoLoaders" + id + "> i").attr("class", "fas fa-unlink red");
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.addEventListener('progress', function (e) {
					if(un + '#' + hCode != profileInfoCurrentAsked)
						return;
					$(".infoLoaders" + id + "> i").attr("class", "fas fa-spin fa-sync-alt");
				});
				return xhr;
			}
		});
	}
	infoLoadData(0, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.info', {handles: un}), function(d){
		d = d[0];
		profileInfoDatas[0] = d;
		$(".infoUserBlock").css("opacity", 1);
		$(".infoUserAvatar").attr("src", d.titlePhoto);
		$(".infoSmallUserRanks").html(`<div class='${ratingToClass(d.rating)}'>${ratingToGrade(d.rating)}</div>`);
		$(".infoUsername").html(`<div class='${ratingToClass(d.rating)}'>${d.handle}</div>`);
		$(".infoUserRanksValue").html(`<div style='display: inline-block' class='${ratingToClass(d.rating)}'>${ratingToSmalln(d.rating)} ${d.rating}</div> (max. <div style='display: inline-block' class='${ratingToClass(d.maxRating)}'>${ratingToSmalln(d.maxRating)} ${d.maxRating}</div>)`);
		$(".infoUserContributionValue").html(`${d.contribution == 0 ? 0 : (d.contribution > 0 ? `<span class='green'>+${d.contribution}</span>` : `<span class='red'>${d.contribution}</span>`)}`);
		$(".infoUserFriends > span").attr("argv", `[${d.friendOfCount}]`).html(languageOption.general.infoFriends.format([d.friendOfCount]));
		$(".infoUserTimes > div:first-child").html((new Date(d.registrationTimeSeconds * 1000)).pattern("yyyy-MM-dd hh:mm"));
		$(".infoUserTimes > div:last-child").html((new Date(d.lastOnlineTimeSeconds * 1000)).pattern("yyyy-MM-dd hh:mm"));
	});
	infoLoadData(1, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.rating', {handle: un}), function(d){
		profileInfoDatas[1] = d;
		$(".infoBlockTitle > div").attr("argv", `[${d.length}]`).html(languageOption.general.infoContestTitle.format([d.length]));
		$(".infoGraphBlock").css("opacity", 1);
		var D = [];
		profileInfoDatas[3] = {};
		for(var i=0; i<d.length; i++)
			D.push([d[i].ratingUpdateTimeSeconds * 1000, d[i].newRating]),
			profileInfoDatas[3][d[i].ratingUpdateTimeSeconds * 1000] = i;
		profileDrawGraph(D);
	});
	infoLoadData(2, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.status', {handle: un}), function(d){
		profileInfoDatas[2] = d;
		$(".infoShowProblems").removeClass("disabled");
		$(".infoShowSubmissions").removeClass("disabled");
		$(".infoProblemSubmitted span").html(d.length);
		$(".infoProblemAccept span").html(getACCounts(d));
		function dec(x){
			return x.substring(0, x.length-3) + `<span style="font-size: 24px">${x.substring(x.length-3)}</span>`;
		}
		$(".infoProblemContestPP span").html(dec(getPP(d, true)));
		$(".infoProblemPracticePP span").html(dec(getPP(d, false)));
	});
}
function infoSetupUsername(){
	if($(".infoChangeUsernameInputArea > button").hasClass("dangerColor"))
		return;
	var val = $(".infoChangeUsernameInputArea > input").val();
	if(val == "")
		val = currentLoginHandle;
	if(val.length < 3 || val.length > 24 || !queryUsrename.test(val)){
		$(".infoChangeUsernameInputArea > button").removeClass("primaryColor").addClass("dangerColor");
		$(".infoChangeUsernameInputArea > button").html("<span class='fas fa-exclamation-triangle'></span>");
		setTimeout(function(){
			$(".infoChangeUsernameInputArea > button").addClass("primaryColor").removeClass("dangerColor");
			$(".infoChangeUsernameInputArea > button").html("<span class='fas fa-paper-plane'></span>");
		}, 1000)
	}
	else{
		$(".infoChangeUsernameWindow").css("opacity", "0");
		setTimeout(function(){
			$(".infoChangeUsernameWindow").css("display", "none");
		}, 500);
		infoLoadUsername(val);
	}
}
$(".infoChangeUsernameInputArea > input").bind('keydown',function(event){
    if(event.keyCode == "13")
    	infoSetupUsername();
});
$(".infoChangeUsernameInputArea > button").click(function(){infoSetupUsername()});

