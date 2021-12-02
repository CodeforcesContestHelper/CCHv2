var ratingRanges = [
{
	color: '#BBBBBB',
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
];
var profileInfoCurrentAsked = "";
var profileInfoDatas = [{}, [], [], {}];
var profileChosenTags = [];
var profileInfoLoaded = [false, false, false];
var profileInfoLoaders = [null, null, null];
var profileTagsToColor = {}, profileIdToTag = {}, profileTagToId = {};
var profileProblemToSubmissions = {};
var profileFilteredInfo, profilePageID;
// -- move to settings
const profilePageCount = 100;
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
	delete(calc);
	return ans;
}
function getProblemsIf(data){
	var calc = {};
	var ret = [];
	delete(profileProblemToSubmissions);
	profileProblemToSubmissions = {};
	for(var i=0; i<data.length; i++){
		var q = data[i];
		var p = q.problem.contestId + q.problem.index;
		if(calc[p] == undefined){
			calc[p] = true;
			ret.push(q.problem);
			profileProblemToSubmissions[p] = [];
		}
		profileProblemToSubmissions[p].push(q);
	}
	delete(calc);
	return ret;
}

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

function getProblemStatistics(d){
	var ret = [];
	// tag analyse
	var app = {};
	for(var i=0; i<d.length; i++){
		for(var j=0; j<d[i].tags.length; j++){
			if(app[d[i].tags[j]] == undefined)
				app[d[i].tags[j]] = 0;
			++ app[d[i].tags[j]];
		}
	}
	var lis = [];
	for(var x in app)
		if(app.hasOwnProperty(x))
			lis.push([x, app[x]]);
	lis.sort(function(x, y){
		if(y[1] == x[1])
			return y[0] < x[0];
		return y[1] - x[1];
	});
	ret.push(lis);
	// rating analyse
	var lis2 = [];
	for(var i=800; i<=3500; i+=100)
		lis2.push(0);
	for(var i=0; i<d.length; i++) if(d[i].rating != undefined)
		++ lis2[(d[i].rating - 800) / 100];
	ret.push(lis2);
	return ret;
}

function problemPassedIf(id){
	var i = profileProblemToSubmissions[id];
	for(var x=0; x<i.length; x++){
		var t = i[x];
		if(t.verdict == "OK")
			return true;
	}
	return false;
}
var profileListFilterRegex = [/^:ac$/, /^:uac$/, /^:contest$/, /^:gym$/]
var profileListFilterFuncs = [
	function(q, argv){
		return problemPassedIf(q.contestId + q.index);
	},
	function(q, argv){
		return !problemPassedIf(q.contestId + q.index);
	},
	function(q, argv){
		return q.contestId < 99999;
	},
	function(q, argv){
		return q.contestId >= 100000;
	}
]

function profileProblemFilter(d, mn, mx, ft){
	var ret = d;
	if(mn != 0){
		var q = ret;
		ret = [];
		for(var i=0; i<q.length; i++)
			if(q[i].rating != undefined && q[i].rating >= mn)
				ret.push(q[i]);
	}
	if(mx != 0){
		var q = ret;
		ret = [];
		for(var i=0; i<q.length; i++)
			if(q[i].rating != undefined && q[i].rating <= mx)
				ret.push(q[i]);
	}
	for(var j=0; j<profileChosenTags.length; j++){
		var tg = profileChosenTags[j];
		var q = ret;
		ret = [];
		for(var i=0; i<q.length; i++)
			if(q[i].tags.indexOf(profileIdToTag[tg]) != -1)
				ret.push(q[i]);
	}
	ft = ft.split(" ");
	var namT = [], tagT = [];
	for(var i=0; i<ft.length; i++){
		var q = $.trim(ft[i]);
		if(q == "")
			continue;
		var flg = false;
		for(var j=0; j<profileListFilterRegex.length; j++)
			if(profileListFilterRegex[j].test(q)){
				tagT.push([j, profileListFilterRegex[j].exec(q)]);
				flg = true; break;
			}
		if(!flg)
			namT.push(q);
	}
	var q = ret;
	ret = [];
	for(var i=0; i<q.length; i++){
		var Q = q[i];
		var flg = true;
		for(var j=0; j<namT.length; j++)
			flg &= Q.name.toLowerCase().indexOf(namT[j].toLowerCase()) != -1;
		for(var j=0; j<tagT.length; j++)
			flg &= profileListFilterFuncs[tagT[j][0]](Q, tagT[j][1]);
		if(flg)
			ret.push(q[i]);
	}
	return ret;
}
function profileProblemSort(d, st, dir){
	function getVal(q, s){
		if(s == 1)
			return [q.contestId, q.index];
		if(s == 2)
			return [q.rating];
		return [q.name];
	}
	function comp(x, y){
		for(var i=0; i<x.length; i++)
			if(x[i] != y[i])
				return x[i] < y[i];
	}
	d.sort(function(x, y){
		var X = getVal(x, st), Y = getVal(y, st);
		if(X != Y){
			var ret = comp(X, Y) ? -1 : 1;
			if(dir)
				ret *= -1;
			return ret;
		}
		X = getVal(x, 1), Y = getVal(y, 1);
		var ret = comp(X, Y) ? -1 : 1;
		if(dir)
			ret *= -1;
		return ret;
	})
	return d;
}
function profileDisplayAllSubmissions(pid){
	$(".eventContainer").css("display", "grid");
	setTimeout(function(){
		$(".eventContainer").css("opacity", "1");
	}, 50);
	var useful = profileProblemToSubmissions[pid];
	$(".eventList").html('');
	for(var i = 0; i < useful.length; i++){
		var tim = "";
		var curr = useful[i];
		tim = (new Date(curr.creationTimeSeconds * 1000).pattern("yyyy/MM/dd hh:mm"));
		var vid = "";
		if(curr.verdict == "OK")
			vid = `<span class="green" style="font-weight: bold">${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if(curr.verdict == undefined)
			vid = `<span>${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if(curr.verdict == "TESTING")
			vid = `<span>${toDetailedInfo(curr.verdict, curr.testset)} on test ${curr.passedTestCount + 1}</span>`
		else if(curr.verdict == "PARTIAL" || curr.verdict == "COMPILATION_ERROR" || curr.verdict == "SKIPPED" || curr.verdict == "REJECTED")
			vid = `<span class="red">${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if(curr.verdict == "CHALLENGED")
			vid = `<span class="red" style="font-weight: bold">${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else
			vid = `<span class="red">${toDetailedInfo(curr.verdict, curr.testset)} on test ${curr.passedTestCount + 1}</span>`
		vid = $(vid);
		vid.attr("onclick", `openSubmission(${curr.contestId}, ${curr.id})`);
		vid.css("cursor", "pointer");
		vid = vid.prop("outerHTML");
		$(".eventList").append(`<p>${tim} ${vid}${curr.points != undefined || curr.pointsInfo != undefined ? ` | ${curr.pointsInfo != undefined ? curr.pointsInfo : curr.points}` : ""} [${toDetailedTestset(curr.testset)}]</p>`)
	}
}
function getRandomColor(){
	var r = Math.random() * 128 + 64, g = Math.random() * 128 + 64, b = Math.random() * 128 + 64
	return [`rgb(${r}, ${g}, ${b})`, `rgba(${r}, ${g}, ${b}, 0.5)`];
}
function renderProblemMain(){
	$(".profileProblemMain").html("");
	var len = Math.floor((profileFilteredInfo.length + profilePageCount - 1) / profilePageCount);
	len = Math.max(len, 1);
	profilePageID = Math.max(1, Math.min(len, profilePageID));
	var l = (profilePageID - 1) * profilePageCount;
	var r = l + profilePageCount;
	r = Math.min(r, profileFilteredInfo.length);
	$(".profileProblemPages").html(`${profilePageID}/${len}`);
	for(var i=l; i<r; i++){
		var tgs = "";
		for(var j=0; j<profileFilteredInfo[i].tags.length; j++)
			tgs += `<span class="profileTagBox" force="true" tagId="${profileTagToId[profileFilteredInfo[i].tags[j]]}" style='background: ${profileTagsToColor[profileFilteredInfo[i].tags[j]][1]};'>${profileFilteredInfo[i].tags[j]}</span>`;
		if(tgs == "")
			tgs = `<span class="profileTagBox" style='background: rgba(127, 127, 127, 0.5);'>-</span>`;
		$(".profileProblemMain").append(`<div class='profileProblemBlock'><div style='width: 20px; text-align: center'><i class='${problemPassedIf(profileFilteredInfo[i].contestId + profileFilteredInfo[i].index) ? "fas fa-check green" : "fas fa-times red"}' style="cursor: pointer" onclick="profileDisplayAllSubmissions('${profileFilteredInfo[i].contestId + profileFilteredInfo[i].index}')"></i></div><div style="width: 100px">${profileFilteredInfo[i].contestId + profileFilteredInfo[i].index}</div><div style="flex: 1"><span onclick="openProblemWin(['${profileFilteredInfo[i].contestId + profileFilteredInfo[i].index}'])" style="cursor: pointer">${profileFilteredInfo[i].name}</span><span style='color: grey; font-size: 12px'> *${profileFilteredInfo[i].rating == undefined ? "?" : profileFilteredInfo[i].rating}</span></div></div>`)
		$(".profileProblemMain").append(`<div class='profileProblemTags'>${tgs}</div>`);
	}
}
$(".profilePageLeft").click(function(){
	-- profilePageID;
	renderProblemMain();
})
$(".profilePageRight").click(function(){
	++ profilePageID;
	renderProblemMain();
})
function renderProfileProblemsPage(d, fir){
	var D = getProblemStatistics(d);
	$(".profileTagsDisplayer").html("");
	$(".profileTagsBar").html("");
	if(fir){
		$(".profileTagsInput").html("");
		delete(profileIdToTag); profileIdToTag = {};
		delete(profileTagToId); profileTagToId = {};
	}
	var passedQuestions = {};
	for(var i=0; i<D[0].length; i++)
		passedQuestions[D[0][i][0]] = D[0][i][1];
	var Sm = 0;
	for(var i=0; i<D[0].length; i++)
		Sm += D[0][i][1];
	$(".profileTagsDisplayer").append(`<span class="profileTagBox" style='background: rgba(127, 127, 127, 0.5);'>all: ${d.length}</span>`);
	for(var i=0; i<profileChosenTags.length; i++){
		var tg = profileIdToTag[profileChosenTags[i]];
		var ps = passedQuestions[tg];
		if(ps == undefined)
			ps = 0;
		$(".profileTagsBar").append(`<div class='problemTagsBarContent' style="background-color: ${profileTagsToColor[tg][0]}; width: ${Sm == 0 ? 0 : D[0][i][1] / Sm * 100}%" title='${tg}: ${ps}'></span>`);
		$(".profileTagsDisplayer").append(`<span class="profileTagBox" tagId="${profileTagToId[tg]}" style='background: ${profileTagsToColor[tg][1]};'><i class='fas fa-circle' style="color: ${profileTagsToColor[tg][0]}"></i> ${tg}: ${ps}</span>`)
	}
	if(D[0].length){
		for(var i=0; i<D[0].length; i++) if(profileChosenTags.indexOf(profileTagToId[D[0][i][0]]) == -1){
			if(profileTagsToColor[D[0][i][0]] == undefined)
				profileTagsToColor[D[0][i][0]] = getRandomColor();
			if(fir)
				profileIdToTag[i] = D[0][i][0],
				profileTagToId[D[0][i][0]] = i;
			$(".profileTagsBar").append(`<div class='problemTagsBarContent' style="background-color: ${profileTagsToColor[D[0][i][0]][0]}; width: ${D[0][i][1] / Sm * 100}%" title='${D[0][i][0]}: ${D[0][i][1]}'></span>`);
			$(".profileTagsDisplayer").append(`<span class="profileTagBox" tagId="${profileTagToId[D[0][i][0]]}" style='background: ${profileTagsToColor[D[0][i][0]][1]};'><i class='far fa-circle' style="color: ${profileTagsToColor[D[0][i][0]][0]}"></i> ${D[0][i][0]}: ${D[0][i][1]}</span>`)
		}
	}
	var mx = 0;
	for(var i=0; i<D[1].length; i++)
		mx = Math.max(mx, D[1][i]);
	for(var i=0; i<D[1].length; i++){
		var currRating = i * 100 + 800;
		var currPassed = D[1][i];
		var prob = 0;
		if(mx != 0)
			prob = currPassed / mx;
		$(".profileRatingGraphBar" + currRating).css("height", 60 * prob);
		$(".profileRatingGraphDesc" + currRating).css("bottom", 60 * prob + 30).html(currPassed);
	}
	// cssController2
	profilePageID = 1;
	delete(profileFilteredInfo);
	profileFilteredInfo = d;
	renderProblemMain();
	$(".profileTagBox").unbind("click").click(function(){
		var q = $(this).attr("tagId");
		if(q == undefined || q == "")
			return;
		q = Number(q);
		if(profileChosenTags.indexOf(q) != -1 && !($(this).attr("force") == "true"))
			profileChosenTags.splice(profileChosenTags.indexOf(q), 1);
		else if(profileChosenTags.indexOf(q) == -1)
			profileChosenTags.push(q);
		else
			return;
		reloadProfileProblemPage(false);
	})
	delete(D);
	delete(passedQuestions);
}
$(".profileTagsDisplayIf").click(function(){
	if($(this).hasClass("selected")){
		$(this).removeClass("selected");
		$(".cssController2").html(".profileProblemTags{display: none;}");
	}
	else{
		$(this).addClass("selected");
		$(".cssController2").html(".profileProblemTags{display: block;}");
	}
})
function initProfileRatingGraph(){
	function getColorByRating(x){
		for(var i=0; i<ratingRanges.length; i++)
			if(x >= ratingRanges[i].from && x < ratingRanges[i].to)
				return ratingRanges[i].color;
	}
	var wd = $(".profileRatingGraph").width();
	for(var i=800; i<=3500; i+=100){
		var currRating = i;
		var currPassed = 0;
		var prob = 0;
		var col = getColorByRating(currRating);
		if((i-800) % 3 == 0)
			$(".profileRatingGraph").append(`<span style='transform: translate(-50%, 0); position: absolute; bottom: 10px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; color: grey; font-size: 12px'>${currRating}</span>`)
		$(".profileRatingGraph").append(`<div number=${i} class="profileRatingGraphBarContent profileRatingGraphBar${i}" style='cursor: pointer; transition: 0.3s; border-radius: 5px; transform: translate(-50%, 0); position: absolute; bottom: 30px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; background-color: ${col}; width: 10px; height: ${60 * prob}px'></div>`)
		$(".profileRatingGraph").append(`<span number=${i} class="profileRatingGraphDescContent profileRatingGraphDesc${i}" style='cursor: pointer; transition: 0.3s; transform: translate(-50%, 0); position: absolute; bottom: ${60 * prob + 30}px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; color: grey; font-size: 12px'>${0}</span>`)
	}
	$(".profileRatingGraphBarContent").click(function(){
		var num = $(this).attr("number");
		if($(".profileDiffInput[info=minDiff]").val() == num
		&& $(".profileDiffInput[info=maxDiff]").val() == num)
			$(".profileDiffInput[info=minDiff]").val(""),
			$(".profileDiffInput[info=maxDiff]").val("");
		else
			$(".profileDiffInput[info=minDiff]").val(num),
			$(".profileDiffInput[info=maxDiff]").val(num);
		reloadProfileProblemPage(false);
	})
	$(".profileRatingGraphDescContent").click(function(){
		var num = $(this).attr("number");
		if($(".profileDiffInput[info=minDiff]").val() == num
		&& $(".profileDiffInput[info=maxDiff]").val() == num)
			$(".profileDiffInput[info=minDiff]").val(""),
			$(".profileDiffInput[info=maxDiff]").val("");
		else
			$(".profileDiffInput[info=minDiff]").val(num),
			$(".profileDiffInput[info=maxDiff]").val(num);
		reloadProfileProblemPage(false);
	})
}
function reloadProfileProblemPage(fir){
	var d  = profileInfoDatas[2];
	var mn = $(".profileDiffInput[info=minDiff]").val();
	var mx = $(".profileDiffInput[info=maxDiff]").val();
	var ft = $(".profileTagsInput").val();
	var st = 0;
	if($(".profileSelectSortID").hasClass("selected"))
		st = 1;
	else if($(".profileSelectSortRating").hasClass("selected"))
		st = 2;
	else
		st = 3;
	var dir = 0;
	if($(".profileSelectSortDirection i").hasClass("fa-caret-down"))
		dir = 1;
	var D = getProblemsIf(d);
	D = profileProblemFilter(D, Number(mn), Number(mx), ft);
	D = profileProblemSort(D, st, dir);
	renderProfileProblemsPage(D, fir);
}
initProfileRatingGraph();

$(".profileGoBack").click(function(){
	$(".infoContent > .contentRowInfo").css("left", "-920px");
})
$(".profileSortId").click(function(){
	$(".profileSortId.selected").removeClass("selected");
	$(this).addClass("selected");
	reloadProfileProblemPage(false);
})
$(".profileSelectSortDirection").click(function(){
	if($(this).find("i").hasClass("fa-caret-down"))
		$(this).find("i").attr("class", "fas fa-caret-up red");
	else
		$(this).find("i").attr("class", "fas fa-caret-down green");
	reloadProfileProblemPage(false);
})
$(".profileDiffInput").bind('input propertychange', function(){
	reloadProfileProblemPage(false);
})
$(".profileTagsInput").bind('input propertychange', function(){
	reloadProfileProblemPage(false);
})

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
		zoomType: 'x',
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
		plotLines: ratingRanges
	};
	var tooltip = {
		borderRadius: 5,
		formatter: function () {
			if(profileInfoDatas[3] == undefined || profileInfoDatas[3][this.x] == undefined)
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
	if(!DarkMode)
		json.colors = ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
         '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'];
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
			profileInfoLoaders[i].abort();
	var hCode = (new Date()).getTime();
	profileInfoCurrentAsked = un + '#' + hCode;
	delete(profileInfoDatas[0]);
	delete(profileInfoDatas[1]);
	delete(profileInfoDatas[2]);
	delete(profileInfoDatas[3]);
	delete(profileInfoDatas[4]);
	profileInfoDatas = [{}, [], [], {}, []];
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
		$(".infoUserRanksValue").html(`<div style='display: inline-block' class='${ratingToClass(d.rating)}'>${ratingToSmalln(d.rating)} ${d.rating == undefined ? "0" : d.rating}</div> (max. <div style='display: inline-block' class='${ratingToClass(d.maxRating)}'>${ratingToSmalln(d.maxRating)} ${d.maxRating == undefined ? "0" : d.maxRating}</div>)`);
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
		profileDrawGraph(profileInfoDatas[4] = D);
	});
	infoLoadData(2, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.status', {handle: un}), function(d){
		profileInfoDatas[2] = d;
		$(".infoShowProblems").removeClass("disabled");
		// $(".infoShowSubmissions").removeClass("disabled");
		$(".infoProblemSubmitted span").html(d.length);
		$(".infoProblemAccept span").html(getACCounts(d));
		function dec(x){
			return x.substring(0, x.length-3) + `<span style="font-size: 24px">${x.substring(x.length-3)}</span>`;
		}
		$(".infoProblemContestPP span").html(dec(getPP(d, true)));
		$(".infoProblemPracticePP span").html(dec(getPP(d, false)));
		delete(profileChosenTags);
		profileChosenTags = [];
		$(".profileTagsInput").val(":ac :contest");
		reloadProfileProblemPage(true);
	});
}
$(".infoShowProblems").click(function(){
	if($(this).hasClass("disabled"))
		return;
	$(".infoContent > .contentRowInfo").css("left", "0px");
})
$(".infoShowSubmissions").click(function(){
	if($(this).hasClass("disabled"))
		return;
	$(".infoContent > .contentRowInfo").css("left", "-1840px");
})
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

