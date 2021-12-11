var contestAllList = [];
var contestInSecondPage = false;
var contestPerPage = 20;
var contestListCurrentPage = 1;
var contestListFilterResult = [], contestListSortResult = [];
var contestListFormatString = `<div class="contestInfoCard {7}"><div class="contestCardRealInfo"><div class="contestCardNameContainer"><div class="contestCardName" title="{0}">{0}</div><div class="contestCardTags">{1}</div></div><div class="contestPassedCount"><span class="contestCardPassedCount green">{2}</span><div class="contestCardOverall"><div class="contestCardUACCount red">{3}</div><div class="contestCardOverallCount">{4}</div></div></div></div><div class="contestCardTime"><span class="contestCardTimeSE">{5}</span><span class="contestCardTimeRunningType">{6}</span></div></div>`;
// [contestName, contestTags, solvedProblem, uacProblem, totalProblem, contestTime, contestRunning, highlightType]

// :type=...
// :time=...
// :id=...
// :ac=...
// :uac=...
// :pcnt=...

var contestListFilterRegex = [/^:type(=)([a-zA-Z]+)$/, /^:mode(=)(.+)$/, /^:time(>|=|<|>=|<=|!=)([0-9]+)$/, /^:id(>|=|<|>=|<=|!=)([0-9]+)$/, /^:ac(>|=|<|>=|<=|!=)([0-9]+)$/, /^:pcnt(>|=|<|>=|<=|!=)([0-9]+)$/];
var contestListFilterFuncs = [
function(args, info, op){
	return args.toLowerCase() == info[2].toLowerCase();
}, function(args, info, op){
	return args.toLowerCase() == getLimitedContestType(info[0]).toLowerCase();
}, function(args, info, op){
	var p = info[3];
	p = (new Date(p * 1000)).pattern("yyyyMMddhhmm");
	p = p.substring(0, args.length);
	if(p.length < args.length)	p += "0".repeat(args.length - p.length);
	return getOpResult(op, p, args);
}, function(args, info, op){
	return getOpResult(op, info[1], Number(args));
}, function(args, info, op){
	var q = getSolvedProblemsByContest.solvedProblemCountsByContestId[info[1]];
	if(q == undefined)	q = 0;
	return getOpResult(op, q, Number(args));
}, function(args, info, op){
	var q = getSolvedProblemsByContest.problemCountsByContestId[info[1]];
	if(q == undefined)	q = 0;
	return getOpResult(op, q, Number(args));
}];
function contestListFilter(args){
	args = args.split(" ");
	var contentFilter = [], tagFilter = [];
	for(var x in args){
		x = args[x].toLowerCase();
		if(x == "")	continue;
		var isContentMatch = true;
		for(var i=0; i<contestListFilterRegex.length; i++)
			if(contestListFilterRegex[i].test(x))	isContentMatch = false;
		if(isContentMatch)
			contentFilter.push(x);
		else
			tagFilter.push(x);
	}
	delete contestListFilterResult;
	contestListFilterResult = [];
	for(var x in contestAllList){
		x = contestAllList[x];
		var passAllFilter = true;
		for(var v in contentFilter)
			if(x[0].toLowerCase().indexOf(contentFilter[v].toLowerCase()) == -1)
				passAllFilter = false;
		if(!passAllFilter)	continue;
		for(var v in tagFilter){
			v = tagFilter[v];
			for(var q in contestListFilterRegex)
				if(contestListFilterRegex[q].test(v))
					passAllFilter &= contestListFilterFuncs[q](contestListFilterRegex[q].exec(v)[2], x, contestListFilterRegex[q].exec(v)[1]);
		}
		if(!passAllFilter)	continue;
		contestListFilterResult.push(x);
	}
}
function contestListSort(useTime, incIf){
	delete contestListSortResult;
	contestListSortResult = JSON.parse(JSON.stringify(contestListFilterResult));
	function compareFunc(a, b){
		var inc = 0;
		if(useTime)
			inc = (a[3] < b[3]) ? -1 : ((a[3] == b[3]) ? 0 : 1);
		else{
			var p = getSolvedProblemsByContest.solvedProblemCountsByContestId[a[1]];
			var q = getSolvedProblemsByContest.solvedProblemCountsByContestId[b[1]];
			if(p == undefined)	p = 0;
			if(q == undefined)	q = 0;
			inc = (p < q) ? -1 : ((p == q) ? 0 : 1);
		}
		return incIf ? inc : -1 * inc;
	}
	contestListSortResult.sort(compareFunc);
}

$(".contestInsertTimeInputArea > input").bind('keydown', function(event){
	if(event.keyCode == "13")
		$(".contestInsertTimeInputArea > button").click();
})
function contestStartVirtualIf(x){
	$(".contestInsertTimeWindow").css("display", "grid");
	setTimeout(function(){
		$(".contestInsertTimeWindow").css("opacity", 1);
	}, 50);
	$(".contestInsertTimeInputArea > input").val("");
	$(".contestInsertTimeInputArea > button").unbind("click").click(function(){
		if(!$(this).find("i").hasClass("fa-paper-plane"))
			return;
		var q1 = $(".contestInsertTimeInputArea > input").val();
		q1 = queryTime.exec(q1);
		if(q1 == null){
			$(".contestInsertTimeInputArea > button").html(`<i class='fas fa-clock'></i>`);
			$(".contestInsertTimeInputArea > button").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
			setTimeout(function(){
				$(".contestInsertTimeInputArea > button").html(`<i class="fas fa-paper-plane"></i>`);
				$(".contestInsertTimeInputArea > button").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
			}, 1000);
			return;
		}
		var q = [parseInt(q1[1], 10), parseInt(q1[2], 10), parseInt(q1[3], 10), parseInt(q1[4], 10), parseInt(q1[5], 10)];
		var d = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(isLoopYear(q[0]))	++d[2];
		var flg = true;
		if(q[1] < 1 || q[1] > 12 || d[q[1]] < q[2] || q[2] < 1)
			flg = false;
		if(q[3] == 24 && q[4] != 0)	flg = false;
		if(q[3] != 24 && (q[3] < 0 || q[4] < 0 || q[4] >= 60))	flg = false;
		if(!flg){
			$(".contestInsertTimeInputArea > button").html(`<i class='fas fa-clock'></i>`);
			$(".contestInsertTimeInputArea > button").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
			setTimeout(function(){
				$(".contestInsertTimeInputArea > button").html(`<i class="fas fa-paper-plane"></i>`);
				$(".contestInsertTimeInputArea > button").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
			}, 1000);
			return;
		}
		$(".contestInsertTimeInputArea > button").html(`<i class='fas fa-sync-alt fa-spin'></i>`);
		$(".contestInsertTimeInputArea > button").attr("disabled", true);
		registerVirtualRound(x, new Date(q[0], q[1]-1, q[2], q[3], q[4]), function(){
			$(".closeContestInsertTime").click();
			$("[for=singleContent]").click();
			loadSingleInformation(true, currentLoginHandle, x, new Date(q[0], q[1]-1, q[2], q[3], q[4]), (new Date(q[0], q[1]-1, q[2], q[3], q[4])).getTime() <= (new Date()).getTime());
			$(".contestInsertTimeInputArea > button").html(`<i class="fas fa-paper-plane"></i>`);
			$(".contestInsertTimeInputArea > button").attr("disabled", false);
		}, function(x){
			$(".contestInsertTimeInputArea > button").html(`<i class='fas ${x}'></i>`);
			$(".contestInsertTimeInputArea > button").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
			setTimeout(function(){
				$(".contestInsertTimeInputArea > button").html(`<i class="fas fa-paper-plane"></i>`);
				$(".contestInsertTimeInputArea > button").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
			}, 1000);
		});
	})
}

function displayContestListPage(){
	$(".contestListMatchedCount").html(String(contestListSortResult.length) + ' / ' + String(contestAllList.length));
	if(contestListSortResult.length == 0){
		$(".contestSearch .searchPageBottom").html(`<div style="width: 100%; height: 100%; display: grid; place-items: center; text-align: center"><div><span style="display: inline-block" class="fas fa-exclamation-triangle fa-4x"></span><br/><div class="popTip">${localize('noMatchedContest')}</div></div></div>`)
		$(".contestSearch .searchPageCurrentPage").html("1");
		$(".contestSearch .searchPageOverallPage").html("/1");
		return;
	}
	var l = (contestListCurrentPage - 1) * contestPerPage;
	var r = l + contestPerPage - 1;
	r = Math.min(r, contestListSortResult.length - 1);
	$(".contestSearch .searchPageCurrentPage").html(contestListCurrentPage);
	$(".contestSearch .searchPageOverallPage").html("/" + Math.ceil(contestListSortResult.length / contestPerPage));
	$(".contestSearch .searchPageBottom").html('');
	for(var i=l; i<=r; i++){
		var x = contestListSortResult[i];
		var rep = [0, 0, 0, 0, 0, 0, 0, (i - l) % 2 == 0 ? "" : "highlightedContestList"];
		rep[0] = x[0];
		rep[1] = "";
		var tgList = [];
		tgList.push("#" + x[1]);
		tgList.push(x[2]);
		if(getContestType(x[0]) != undefined)
			tgList.push(getContestType(x[0]));
		for(var j in tgList){
			j = tgList[j];
			rep[1] += `<span class='contestCardTag'>${j}</span>`;
		}
		if(getSolvedProblemsByContest.problemCountsByContestId[x[1]] == undefined){
			rep[2] = "";
			rep[3] = "";
			rep[4] = "n/a";
		}
		else{
			rep[4] = getSolvedProblemsByContest.problemCountsByContestId[x[1]];
			rep[2] = getSolvedProblemsByContest.solvedProblemCountsByContestId[x[1]];
			rep[3] = "";
			rep[4] = '/' + rep[4];
		}
		rep[5] = `<span class="fas fa-clock"></span> ${(new Date(x[3] * 1000)).pattern("yyyy-MM-dd hh:mm")} >>> ${(new Date((x[3] + x[4]) * 1000)).pattern("yyyy-MM-dd hh:mm")}`;
		var rtList = [`<span><span class="fas fa-clock"></span> ${localize('contestListStart')}</span>`
					, `<span class="red"><span class="fas fa-running"></span> ${localize('contestListRun')}</span>`
					, `<span class="green"><span class="fas fa-check"></span> ${localize('contestListEnd')}</span> | <span style="cursor: pointer; color: grey" onclick='contestStartVirtualIf(${x[1]})'><span class="fas fa-user-secret"></span> ${localize('contestListVirtual')}</span>`];
		if((new Date()).getTime() <= x[3] * 1000)
			rep[6] = 0, rep[5] += ` | <span class='dangerColor' style="padding: 0px 5px">${localize('contestPageBeforeStart')}<span class="contestPageCountdown" time="${x[3] * 1000}" style="padding-left: 10px"></span></span>`;
		else if((new Date()).getTime() <= (x[3] + x[4]) * 1000)
			rep[6] = 1, rep[5] += ` | <span class='warningColor' style="padding: 0px 5px">${localize('contestPageRunning')}<span class="contestPageCountdown" time="${(x[3] + x[4]) * 1000}" style="padding-left: 10px"></span></span>`;
		else
			rep[6] = 2;
		rep[6] = rtList[rep[6]];
		$(".contestSearch .searchPageBottom").append(contestListFormatString.format(rep));
	}
	$(".contestPageCountdown").each(function(){
		var t = Number($(this).attr("time"));
		var q = (new Date()).getTime();
		if(q > t)
			q = t;
		$(this).html(getTimeLength2(t - q));
	})
}

function loadContestList(){
	$(".contestListLoadIf > span").css("cursor", "default");
	$(".contestListLoadIf > span").unbind("click");
	$(".contestListLoadIf > span").html(`<span class='fas fa-hourglass-half'></span> ` + localize("loading"));
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + '/contest.list', {}),
		type: "GET",
		timeout : settings.largeTimeLimit,
		success: function(data){
			var _contestAllList = [];
			data = data.result;
			$(".contestListLoadIf > span").html(`<span class='fas fa-hourglass-half'></span> ` + localize("loadingAcCount"));
			loadContestPassedStatus(function(){
				for(var i=0; i<data.length; i++)
				_contestAllList.push([data[i].name, data[i].id, data[i].type, data[i].startTimeSeconds, data[i].durationSeconds]);
				contestAllList = _contestAllList;
				contestListCurrentPage = 1;
				var q = $(".contestListSearchArea > input").val();
				contestListFilter(q);
				var x = $(".contestSortOption").children().eq(0).hasClass("chosen");
				var y = $(".contestDirectionOption").children().eq(1).hasClass("chosen");
				contestListSort(x, y);
				displayContestListPage();
				$(".contestListLoadIf > span").html(`<span class='fas fa-check green'></span> ` + localize("success"));
				$(".contestListLoadIf > span").css("cursor", "pointer");
				$(".contestListLoadIf > span").unbind("click").click(function(){
					loadContestList();
				})
			}, function(){
				$(".contestListLoadIf > span").html(`<span class='fas fa-times red'></span> ` + localize("failed"));
				$(".contestListLoadIf > span").css("cursor", "pointer");
				$(".contestListLoadIf > span").unbind("click").click(function(){
					loadContestList();
				})
			})
		},
		error: function(){
			$(".contestListLoadIf > span").html(`<span class='fas fa-times red'></span> ` + localize("failed"));
			$(".contestListLoadIf > span").css("cursor", "pointer");
			$(".contestListLoadIf > span").unbind("click").click(function(){
				loadContestList();
			})
		},
		xhr: function() {
			var xhr = new XMLHttpRequest();
			var fr = false;
			xhr.addEventListener('progress', function (e) {
				if(! fr){
					$(".contestListLoadIf > span").append(`<span class='contestLoadedInfo'></span>`);
					fr = true;
				}
				$(".contestLoadedInfo").html(` (${toMemoryInfo(e.loaded / 8)})`);
			});
			return xhr;
		}
	})
}
var ifInitContestPage = false;
$(".NavBarContent").eq(2).click(function(){
	displayContestListPage();
	if(!contestInSecondPage){
		displayContestListPage();
		if(!ifInitContestPage)
			loadContestList();
		ifInitContestPage = true;
		return;
	}
})
$(".contestListSearchArea > input").bind('input propertychange', function(){
	contestListCurrentPage = 1;
	var q = $(this).val();
	contestListFilter(q);
	var x = $(".contestSortOption").children().eq(0).hasClass("chosen");
	var y = $(".contestDirectionOption").children().eq(1).hasClass("chosen");
	contestListSort(x, y);
	displayContestListPage();
})
$(".contestSearch .searchArgumentsItem").click(function(){
	var x = $(".contestSortOption").children().eq(0).hasClass("chosen");
	var y = $(".contestDirectionOption").children().eq(1).hasClass("chosen");
	contestListSort(x, y);
	displayContestListPage();
})
$(".contestSearch .searchPagesButton").eq(0).click(function(){
	var l = 1, r = Math.max(1, Math.ceil(contestListSortResult.length / contestPerPage));
	contestListCurrentPage = 1;
	displayContestListPage();
})
$(".contestSearch .searchPagesButton").eq(1).click(function(){
	var l = 1, r = Math.max(1, Math.ceil(contestListSortResult.length / contestPerPage));
	contestListCurrentPage = Math.max(l, contestListCurrentPage - 1);
	displayContestListPage();
})
$(".contestSearch .searchPagesButton").eq(2).click(function(){
	var l = 1, r = Math.max(1, Math.ceil(contestListSortResult.length / contestPerPage));
	contestListCurrentPage = Math.min(r, contestListCurrentPage + 1);
	displayContestListPage();
})
$(".contestSearch .searchPagesButton").eq(3).click(function(){
	var l = 1, r = Math.max(1, Math.ceil(contestListSortResult.length / contestPerPage));
	contestListCurrentPage = r;
	displayContestListPage();
})
$(".closeContestInsertTime").click(function(){
	$(".contestInsertTimeWindow").css("opacity", 0);
	setTimeout(function(){
		$(".contestInsertTimeWindow").css("display", "none");
	}, 500)
})

function reloadContestPageCountdown(){
	setTimeout(reloadContestPageCountdown, 500);
	$(".contestPageCountdown").each(function(){
		var t = Number($(this).attr("time"));
		var q = (new Date()).getTime();
		if(q > t)
			q = t;
		$(this).html(getTimeLength2(t - q));
	})
}
reloadContestPageCountdown();