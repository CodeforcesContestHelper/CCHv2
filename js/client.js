var DefaultStyle = JSON.parse(JSON.stringify(Highcharts.getOptions()));
DefaultStyle.chart.style = {};
DefaultStyle.chart.backgroundColor = {color: "#ddd"};
DefaultStyle.chart.style.fontFamily = "var(--font-family)";
DefaultStyle.xAxis = {gridLineColor: "#ccd6eb",labels: {style: {color: '#666'}},lineColor: '#ccd6eb',minorGridLineColor: '#ccd6eb',tickColor: '#ccd6eb',};
DefaultStyle.yAxis = {tickWidth: 1, gridLineColor: "#ccd6eb",labels: {style: {color: '#666'}},lineColor: '#ccd6eb',minorGridLineColor: '#ccd6eb',tickColor: '#ccd6eb',};
DefaultStyle.plotOptions.series = {dataLabels: {color: '#000',style: {fontSize: '13px'}},marker: {lineColor: '#fff'}};
var DarkUnica = {
     colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
         '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
     chart: {
         backgroundColor: {
             color: '#555'
         },
         style: {
             fontFamily: "var(--font-family)",
         	 fontSize: '14px'
         },
         plotBorderColor: '#606063'
     },
     title: {
         style: {
             color: '#E0E0E3',
             textTransform: 'uppercase',
             fontSize: '20px'
         }
     },
     subtitle: {
         style: {
             color: '#E0E0E3',
             textTransform: 'uppercase'
         }
     },
     xAxis: {
         gridLineColor: '#707073',
         labels: {
             style: {
                 color: '#E0E0E3'
             }
         },
         lineColor: '#707073',
         minorGridLineColor: '#505053',
         tickColor: '#707073',
         title: {
             style: {
                 color: '#A0A0A3'
             }
         }
     },
     yAxis: {
         gridLineColor: '#707073',
         labels: {
             style: {
                 color: '#E0E0E3'
             }
         },
         lineColor: '#707073',
         minorGridLineColor: '#505053',
         tickColor: '#707073',
         tickWidth: 1,
         title: {
             style: {
                 color: '#A0A0A3'
             }
         }
     },
     tooltip: {
         backgroundColor: 'rgba(0, 0, 0, 0.85)',
         style: {
             color: '#F0F0F0'
         }
     },
     plotOptions: {
         series: {
             dataLabels: {
                 color: '#F0F0F3',
                 style: {
                     fontSize: '13px'
                 }
             },
             marker: {
                 lineColor: '#333'
             }
         },
         boxplot: {
             fillColor: '#505053'
         },
         candlestick: {
             lineColor: 'white'
         },
         errorbar: {
             color: 'white'
         }
     },
     legend: {
         backgroundColor: 'rgba(0, 0, 0, 0.5)',
         itemStyle: {
             color: '#E0E0E3'
         },
         itemHoverStyle: {
             color: '#FFF'
         },
         itemHiddenStyle: {
             color: '#606063'
         },
         title: {
             style: {
                 color: '#C0C0C0'
             }
         }
     },
     credits: {
         style: {
             color: '#666'
         }
     },
     labels: {
         style: {
             color: '#707073'
         }
     },
     drilldown: {
         activeAxisLabelStyle: {
             color: '#F0F0F3'
         },
         activeDataLabelStyle: {
             color: '#F0F0F3'
         }
     },
     navigation: {
         buttonOptions: {
             symbolStroke: '#DDDDDD',
             theme: {
                 fill: '#505053'
             }
         }
     },
     // scroll charts
     rangeSelector: {
         buttonTheme: {
             fill: '#505053',
             stroke: '#000000',
             style: {
                 color: '#CCC'
             },
             states: {
                 hover: {
                     fill: '#707073',
                     stroke: '#000000',
                     style: {
                         color: 'white'
                     }
                 },
                 select: {
                     fill: '#000003',
                     stroke: '#000000',
                     style: {
                         color: 'white'
                     }
                 }
             }
         },
         inputBoxBorderColor: '#505053',
         inputStyle: {
             backgroundColor: '#333',
             color: 'silver'
         },
         labelStyle: {
             color: 'silver'
         }
     },
     navigator: {
         handles: {
             backgroundColor: '#666',
             borderColor: '#AAA'
         },
         outlineColor: '#CCC',
         maskFill: 'rgba(255,255,255,0.1)',
         series: {
             color: '#7798BF',
             lineColor: '#A6C7ED'
         },
         xAxis: {
             gridLineColor: '#505053'
         }
     },
     scrollbar: {
         barBackgroundColor: '#808083',
         barBorderColor: '#808083',
         buttonArrowColor: '#CCC',
         buttonBackgroundColor: '#606063',
         buttonBorderColor: '#606063',
         rifleColor: '#FFF',
         trackBackgroundColor: '#404043',
         trackBorderColor: '#404043'
     }
 };
var commitInfo = [];
function openURL(x){
	if(RunInNwjs)
		nw.Shell.openExternal(x);
	else
		window.open(x);
}


function killSingleTrack(){

}

var rankChart = null, rankChartMini = null;
function generateRankGraph(rankData){
	if(rankChart != null){
		rankChart.destroy();
		rankChart = null;
	}
	if(rankChartMini != null){
		rankChartMini.destroy();
		rankChartMini = null;
	}
	Highcharts.setOptions((DarkMode) ? DarkUnica : DefaultStyle);
	var chart = {
		type: 'spline',
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
		}
	};
	var yAxis = {
		reversed: true,
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
	};
	var tooltip = {
		borderRadius: 5,
		formatter: function () {
		return `<b><span info="Rank">${languageOption.general.Rank}</span>: ` + this.y + '</b><br/>' +
			Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x);
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
		}
	};
	var legend = {
		enabled: false
	};
	var exporting = {
		enabled: false
	};
	var series= [{
		name: 'rankData',
		data: rankData
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
	rankChart = Highcharts.chart("singleRankGraphContainer", json);
	chart = {
		type: 'spline',
		animation: Highcharts.svg, // don't animate in IE < IE 10.
	};
	xAxis = {
		lineWidth: 0,
        tickWidth: 0,
		labels: {
			enabled: false
		},
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
		}
	};
	yAxis = {
		lineWidth: 0,
		gridLineWidth: 0,
		tickWidth: 0,
		labels: {
			enabled: false
		},
		reversed: true,
		title: {
			text: null
		},
		plotLines: [],
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
	};

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

	if(rankData.length <= 1)
		$("#singleRankGraphContainerMini").css("display", "none");
	else{
		$("#singleRankGraphContainerMini").css("display", "block");
		rankChartMini = Highcharts.chart("singleRankGraphContainerMini", json);
	}
}

var singleLastTimeUpdate = new Date(0);
var singleMemoryUsed = 0, singleLoadTypeLast;
var singleLoadType;
var contestUsername, contestContestId;
var singleFirstTimeLoaded = true;
var loadTypeReaction = [
	"",
	" <i class='fas fa-spin fa-sync-alt'></i>",
	" <i class='fas fa-clock red'></i>",
	" <i class='fas fa-unlink red'></i>",
	" <i class='fas fa-check green'></i>",
];

function reloadSingleMemoryUsed(){
	if(singleLoadType == singleLoadTypeLast)
		$(".singleMemoryUsed > span > span").html(toMemoryInfo(singleMemoryUsed / 8));
	else
		$(".singleMemoryUsed").html(`<span><span>`+ toMemoryInfo(singleMemoryUsed / 8) + '</span>' + loadTypeReaction[singleLoadType]+`</span>`);
	singleLoadTypeLast = singleLoadType;
}

function initContestNewWinPage(){
	if(settings.fontFamily != "")
		contestNewWin.window.document.documentElement.style.setProperty("--font-family", settings.fontFamily);
	else
		contestNewWin.window.document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono',monospace, sans-serif");
	contestNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/dark.css" : "./css/default.css");
	function loadAvatar(){
		$.ajax({
			url: generateAuthorizeURL(settings.codeforcesApiUrl + "/user.info", {handles: contestUsername}),
			type: "GET",
			success: function(json){
				contestNewWinJQ.find(".singleUserAvatar").attr("src", json.result[0].titlePhoto);
			},
			error: function(){
				setTimeout(loadAvatar, 10000);
			}
		});
	}
	loadAvatar();
	if(contestStartTime.getTime() == 0)	return;
	if(contestStartTime.getTime() >= (new Date()).getTime())
		contestNewWinJQ.find(".singleContestRunningType").html(`<span info="errorContestNotStarted">${languageOption.error.errorContestNotStarted}</span>`);
	else{
		contestNewWinJQ.find(".singleContestRunningType").html($(".singleContestProgressRatingChangesDisplayer > span:first-child").prop("outerHTML"));
		if(contestJsonProblems.length != 0){
			contestNewWinJQ.find(".problemDisplayer").html("");
			for(var i=0; i<contestJsonProblems.length; i++){
				var q = "";
				if(contestProblemResult.length == 0)
					q = "idleColor";
				else{
					if(contestProblemResult[i].points != 0)	q = "successColor";
					else if(contestProblemResult[i].rejectedAttemptCount)	q = "dangerColor";
					else q = "idleColor";
				}
				contestNewWinJQ.find(".problemDisplayer").append(`<div class="smallSubmissionInfo ${q}"><span>${contestJsonProblems[i].index}</span></div>`)
			}
		}
		contestNewWinJQ.find(".currentRank").html('#' + (contestRanks[contestRankChosen] == 0 ? '?' : contestRanks[contestRankChosen]));
		if(contestRankLast[contestRankChosen] != 0){
			var q = contestRankLast[contestRankChosen] - contestRanks[contestRankChosen];
			var ic = "fa-sort", col = "";
			if(q > 0)	ic = "fa-caret-up", col = "red";
			if(q < 0)	ic = "fa-caret-down", col = "green";
			contestNewWinJQ.find(".currentRank").append(`<span class="currentRankDelta ${col}"><i class="fas ${ic}"></i>${Math.abs(q)}</span>`);
		}
		contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
		contestNewWinJQ.find(".singleContestProgressBarDisplayer").html($(".singleContestProgressBarDisplayer").html());
		contestNewWinJQ.find(".singleContestProgressBarDisplayer > .singleContestPoptip").remove();
	}
}

function initSinglePage(){
	$(".forceLoadStandings").css("display", "inline");
	$(".singleUserAvatar").attr("src", "");
	$(".singleUsernameDisplayer").attr("class", "").addClass("singleUsernameDisplayer").html("");
	$(".singleRatingDisplayer > div:first-child").attr("class", "setInlineBlock").html("");
	$(".currRating").html(""); $(".maxRating").html("");
	$(".singleContestTags").html("");
	$(".singleContestProgressInfo").html("");
	$(".singleContestName").html("");
	$(".singleContestProgressRatingChangesDisplayer > span").html("");
	$(".singleRankLetters").html("");
	$(".singleRankChangesDisplayer").html("");
	$("#singleRankGraphContainer").html("");
	$(".singleContent > div > div > .loadingInterface").css("display", "grid").css("opacity", 1);
	$(".singleContent > div > div > .loadingInterface > div").html('<i class="fas fa-spin fa-sync-alt"></i>');
	$(".singleContestProgressBackground").css("width", 0);
	$(".singleProblemlistlistDisplayGrid").html("");
	$(".singleProblemlistDisplayList").html("");
	$(".singleProblemlistDisplayEvent").html("");
	$(".singleProblemlistBottom").html("");
	if(rankChart != null){
		rankChart.destroy();
		rankChart = null;
	}
	if(rankChartMini != null){
		rankChartMini.destroy();
		rankChartMini = null;
	}
}
function flushsingleProblemlistDisplayGrid(json, prob){
	if(json.length == 0)	return;
	$(".singleProblemlistlistDisplayGrid").html("");
	for(var i=0; i<json.length; i++){
		var q = $("<div class='singleProblemlistDisplayerGridItem'></div>");
		q.append(`<div class="singleProblemlistDisplayerGridItemIndex">${prob[i].index}</div>`);
		var typ = "";
		if(json[i].points != 0)	typ = "green";
		else if(json[i].rejectedAttemptCount)	typ = "red";
		q.append(`<div class="singleProblemlistDisplayerGridItemVerdict ${typ}">${typ==""?"-":(typ=="green"?'+':'-')+(json[i].rejectedAttemptCount?json[i].rejectedAttemptCount:'')}</div>`);
		if(json[i].bestSubmissionTimeSeconds != undefined)
			q.append(`<div>${getTimeLength(json[i].bestSubmissionTimeSeconds * 1000)}</div>`);
		else
			q.append(`<div>${'--:--'}</div>`);
		$(".singleProblemlistlistDisplayGrid").append(q);
	}
}
function flushsingleProblemlistBottom(json){
	if(JSON.stringify(json) == "[]"){
		$(".singleProblemlistBottom").html(
			`<div><span class="green">${0}</span> | <span class="red">${0}</span> | ${contestJsonProblems.length}</div>`+
			`<div><i class="fas fa-plus-square green"></i> ${0} <i class="fas fa-minus-square red"></i> ${0}</div>`+
			`<div><span class="green">${0}</span>(<span class="red">${0}</span>)</div>`
		)
		return;
	}
	var a=0, b=0, c=0;
	for(var i=0; i<json.problemResults.length; i++){
		if(json.problemResults[i].points != 0)	++a;
		else if(json.problemResults[i].rejectedAttemptCount)	++b;
		else ++c;
	}
	$(".singleProblemlistBottom").html(
		`<div><span class="green">${a}</span> | <span class="red">${b}</span> | ${c}</div>`+
		`<div><i class="fas fa-plus-square green"></i> ${json.successfulHackCount} <i class="fas fa-minus-square red"></i> ${json.unsuccessfulHackCount}</div>`+
		`<div><span class="green">${json.points}</span>(<span class="red">${json.penalty}</span>)</div>`
	)
}
function flushsingleProblemlistDisplayList(sub, prob, pb){
	if(pb == undefined || sub == undefined || prob == undefined || pb.length == 0)
		return;
	var indexToId = {}, sz = pb.length;
	if(prob.length == 0){
		prob = [];
		for(var i=0; i<sz; i++)
			prob.push({points: 0, rejectedAttemptCount: 0});
	}
	$(".singleProblemlistDisplayList").html("");
	$(".singleProblemlistDisplayEvent").html("");
	for(var i=0; i<sz; i++)
		indexToId[pb[i].index] = i;
	var jq = [], len = [];
	for(var i=0; i<sz; i++){
		var typ = "";
		if(prob[i].points != 0)	typ = "green";
		else if(prob[i].rejectedAttemptCount)	typ = "red";
		var q = $(`<div class="singleProblemlistDisplayListItem closed"><div class="singleProblemlistDisplayListItemInfo"><div class="singleProblemlistDisplayListItemInfoIndex">${pb[i].index}</div><div class="singleProblemlistDisplayListItemInfoVerdict"><div class="${typ}">${typ==""?"-":(typ=="green"?'+':'-')+(prob[i].rejectedAttemptCount?prob[i].rejectedAttemptCount:'')} (${prob[i].points})</div></div><div class="singleProblemlistDisplayListItemInfoTime"><i class="fa fa-clock"></i> ${prob[i].bestSubmissionTimeSeconds==undefined?"--:--":getTimeLength(prob[i].bestSubmissionTimeSeconds*1000)}</div><div class="singleProblemlistDisplayListItemInfoTimeAttempt"><div class="singleProblemlistVerdictBlock loadingColor">NAN</div></div></div><div class="singleProblemlistDisplayListItemProgress"></div><div class="singleProblemlistDisplayListItemStatus"></div></div>`);
		if(typ == "green")	q.children(".singleProblemlistDisplayListItemProgress").append(`<span class="successColor" style="width:100%"></span>`);
		if(typ == "red")	q.children(".singleProblemlistDisplayListItemProgress").append(`<span class="dangerColor" style="width:100%"></span>`);
		$(".singleProblemlistDisplayList").append(q);
		jq.push(q); len.push(0);
	}
	var l = contestEndTime.getTime() - contestStartTime.getTime();
	for(var i=0; i<sub.length; i++){
		var q = sub[i];
		var qT = (q.creationTimeSeconds * 1000 - contestStartTime.getTime());
		var qM = q.memoryConsumedBytes;
		var qR = q.timeConsumedMillis;
		var t = $(`<div class="singleProblemlistDisplayListItemStatusInfo"><div class="singleProblemlistDisplayListItemInfoIndex">${q.problem.index}</div><div class="singleProblemlistDisplayListItemInfoVerdictBlock"><div subId="${q.id}" subContestId="${q.contestId}" subLink="true" class="singleProblemlistVerdictBlock ${judgeToClass(q.verdict)}">${toSmallInfo(q.verdict)}</div></div><div class="singleProblemlistDisplayListItemInfoRuntime">${qR}ms</div><div class="singleProblemlistDisplayListItemInfoMemory">${toMemoryInfo(qM)}</div><div class="singleProblemlistDisplayListItemInfoTimeLarge">${getTimeLength2(qT)}</div></div>`);
		if(settings.problemSubmissionDirection == "Ascending")
			jq[indexToId[q.problem.index]].children(".singleProblemlistDisplayListItemStatus").prepend(t);
		else
			jq[indexToId[q.problem.index]].children(".singleProblemlistDisplayListItemStatus").append(t);
		if(!len[indexToId[q.problem.index]])
			jq[indexToId[q.problem.index]].children(".singleProblemlistDisplayListItemInfo").children(".singleProblemlistDisplayListItemInfoTimeAttempt").html(`<div subId="${q.id}" subContestId="${q.contestId}" subLink="true" class="singleProblemlistVerdictBlock ${judgeToClass(q.verdict)}">${toSmallInfo(q.verdict)}</div>`);
		++ len[indexToId[q.problem.index]];
		if(settings.problemEventDirection == "Ascending")
			$(".singleProblemlistDisplayEvent").prepend(`<div class="singleProblemlistDisplayEventItem"><div class="singleProblemlistDisplayEventItemInfoDetailedTime">${getTimeLength2(qT)}</div><div class="singleProblemlistDisplayEventItemInfoIndex">${q.problem.index}</div><div class="singleProblemlistDisplayEventItemInfoVerdictBlock"><div subId="${q.id}" subLink="true" subContestId="${q.contestId}" class="singleProblemlistVerdictBlock ${judgeToClass(q.verdict)}">${toSmallInfo(q.verdict)} ${toSmallInfo(q.verdict)=="AC"?("("+q.passedTestCount+")"):("on "+(q.passedTestCount+1))}</div></div><div class="singleProblemlistDisplayEventItemInfoTestType">${toSmallTestset(q.testset)}</div></div>`)
		else
			$(".singleProblemlistDisplayEvent").append(`<div class="singleProblemlistDisplayEventItem"><div class="singleProblemlistDisplayEventItemInfoDetailedTime">${getTimeLength2(qT)}</div><div class="singleProblemlistDisplayEventItemInfoIndex">${q.problem.index}</div><div class="singleProblemlistDisplayEventItemInfoVerdictBlock"><div subId="${q.id}" subLink="true" subContestId="${q.contestId}" class="singleProblemlistVerdictBlock ${judgeToClass(q.verdict)}">${toSmallInfo(q.verdict)} ${toSmallInfo(q.verdict)=="AC"?("("+q.passedTestCount+")"):("on "+(q.passedTestCount+1))}</div></div><div class="singleProblemlistDisplayEventItemInfoTestType">${toSmallTestset(q.testset)}</div></div>`)
	}
	for(var i=0; i<sz; i++) if(!len[i])
		jq[i].children(".singleProblemlistDisplayListItemStatus").append($(`<div class="singleProblemlistDisplayListItemStatusInfo"><div class="singleProblemlistDisplayListItemInfoMessage" info="tipNoSubmissionFound">${languageOption.tip.tipNoSubmissionFound}</div></div>`));
	$(".singleProblemlistDisplayListItemInfo").unbind("click").click(function(){
		var q = $(this).parent();
		if(q.hasClass("closed"))	q.removeClass("closed");
		else q.addClass("closed");
	});
	$("[subLink='true']").unbind("click").click(function(){
		event.stopPropagation();
		openSubmission($(this).attr("subContestId"), $(this).attr("subId"));
	})
}


function getSingleRatingChanges(currSingleLastTimeUpdate, un, ci){
	if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
	if(problemNewWinLoaded){
		$.ajax({
			url: settings.mainURL + `/${ci >= 100000 ? "gym" : "contest"}/` + ci,
			success: function(d){
				var q = $(d).find(".question-response");
				if(singleAnnouncementLength == -1)
					singleAnnouncementLength = q.length;
				if(singleAnnouncementLength != q.length && q.length != 0){
					for(var dis = q.length - singleAnnouncementLength - 1; dis >= 0; dis --){
						var t = q.eq(dis);
						var alt = "";
						t.contents().each(function(){
							if($(this).prop("outerHTML") == "<br>")
								alt += '\n';
							else
								alt += $(this).text();
						});
						t = $('<div>' + alt + '</div>').text();
						problemNewWinJQ.append(`<script>announcementDisplay(\`${t}\`)</script>`);
						if(settings.openNotification)
							new Notification(`Notification of CF #${ci}`, {body: t, icon: '../favicon.png'});
					}
					singleAnnouncementLength = q.length;
				}
			}
		})
	}
	if(singleContestUnrated == "Unrated"){
		$(".singleContestProgressRatingChangesDisplayer > span:last-child").html(localize("Unrated"));
		if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
		return;
	}
	var reloadIf = function(url, callbacks, ID){
		if(!contestEnterInPage)
			return;
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		
		contestRatingChangesHook = $.ajax({
			url: generateAuthorizeURL(url, {contestId: ci, handles: un}),
			type: "GET",
			timeout : settings.largeTimeLimit,
			success: function(json){
				if(typeof(json) == "string")
					json = JSON.parse(json);
				singleLoadType = 4;
				reloadSingleMemoryUsed();
				json = json.result;
				if(json.length == 0 && ID == 0){
					callbacks();
					return;
				}
				for(var i=0; i<json.length; i++) if(json[i].handle.toLowerCase() == un.toLowerCase()){
					$(".singleContestProgressRatingChangesDisplayer > span:last-child")
						.html(`<span class="${ratingToClass(json[i].oldRating)}">${json[i].oldRating}</span> <span class="${json[i].newRating>=json[i].oldRating?"green":"red"}">${json[i].newRating>=json[i].oldRating?'+':'-'}${Math.abs(Number(json[i].newRating)-Number(json[i].oldRating))}</span> <i class="fas fa-angle-double-right"></i> <span class="${ratingToClass(json[i].newRating)}">${json[i].newRating}</span>`)
					if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
					return;
				}
				$(".singleContestProgressRatingChangesDisplayer > span:last-child").html(localize("Unrated"));
				if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
			},
			error: function(jqXHR, status, errorThrown){
				if(status == "timeout"){
					//Network Timeout
					singleLoadType = 2;
					reloadSingleMemoryUsed();
					callbacks();
					return;
				}
				if(jqXHR.readyState != 4){
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					callbacks();
					return;
				}
				var e = jqXHR.responseJSON.comment;
				if(e == "contestId: Rating changes are unavailable for this contest"){
					singleLoadType = 4;
					reloadSingleMemoryUsed();
					$(".singleContestProgressRatingChangesDisplayer > span:last-child").html(localize("Unrated"));
					if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
					return;
				}
				//Network Error
				singleLoadType = 3;
				reloadSingleMemoryUsed();
				callbacks();
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				var q = 0;
				singleLoadType = 1; reloadSingleMemoryUsed();
				xhr.addEventListener('progress', function (e) {
					 singleMemoryUsed += (e.loaded - q);
					 singleLoadType = 1;
					 reloadSingleMemoryUsed();
					 q = e.loaded;
				});
				return xhr;
			},
			xhrFields:
      			{'Access-Control-Allow-Origin': '*'}
		});
	}
	reloadIf(settings.codeforcesApiUrl + "/contest.ratingChanges", function(){
		reloadIf(settings.predictorURL, function(){
			$(".singleContestProgressRatingChangesDisplayer > span:last-child").html("<i class='fas fa-unlink red'></i>");
			if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
		}, 1);
	}, 0)
}
var bigIsComing = [null, null, null, null, null, null, null];
var singleSavedUserInfo = "";
function getAllSingleContestantInfo(currSingleLastTimeUpdate, un, ci, success, error, S, E, loadStandings){
	var s = 0, e = 0, c = 4;
	var Q = 0;
	function loadInfo(u, q, id, er){
		if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		if(id == 2 && singleSavedUserInfo != ""){
			var j = JSON.parse(singleSavedUserInfo);
			for(var i=0; i<q.length; i++)
				j = j[q[i]];
			success[id](un, ci, j, Q);
			if(id <= 3){
				++s;
				if(s + e == c)	(s == c) ? S() : E();
			}
			return;
		}
		bigIsComing[id] = $.ajax({
			url: u,
			type: "GET",
			timeout : id == 5 ? settings.largeTimeLimit : settings.smallTimeLimit,
			success: function(json){
				if(id == 2)
					singleSavedUserInfo = JSON.stringify(json);
				singleLoadType = 4;
				reloadSingleMemoryUsed();
				for(var i=0; i<q.length; i++)
					json = json[q[i]];
				success[id](un, ci, json, Q);
				if(id <= 3){
					++s;
					if(s + e == c)	(s == c) ? S() : E();
				}
			},
			error: function(jqXHR, status, errorThrown){
				if(status == "timeout"){
					//Network Timeout
					singleLoadType = 2;
					reloadSingleMemoryUsed();
					if(er == true){
						success[id](un, ci, undefined, Q);
						if(id <= 3){
							++s;
							if(s + e == c)	(s == c) ? S() : E();
						}
						return;
					}
					error[id](un, ci);
					if(id <= 3){
						++e; if(s + e == c)	(s == c) ? S() : E();
					}
					return;
				}
				if(jqXHR.readyState != 4){
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					if(er == true){
						success[id](un, ci, undefined, Q);
						if(id <= 3){
							++s; if(s + e == c)	(s == c) ? S() : E();
						}
						return;
					}
					error[id](un, ci);
					if(id <= 3){
						++e; if(s + e == c)	(s == c) ? S() : E();
					}
					return;
				}
				//Network Error
				singleLoadType = 3;
				reloadSingleMemoryUsed();
				if(er == true){
					success[id](un, ci, undefined, Q);
					if(id <= 3){
						++s; if(s + e == c)	(s == c) ? S() : E();
					}
					return;
				}
				error[id](un, ci);
				if(id <= 3){
					++e;
					if(s + e == c)	(s == c) ? S() : E();
				}
				reloadOption = true;
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				var q = 0;
				singleLoadType = 1; reloadSingleMemoryUsed();
				xhr.addEventListener('progress', function (e) {
					 singleMemoryUsed += (e.loaded - q);
					 singleLoadType = 1;
					 reloadSingleMemoryUsed();
					 q = e.loaded;
				});
				return xhr;
			}
		});
	}
	loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, handles: un, showUnofficial: false}), ["result"], 0, false);
	loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, handles: un, showUnofficial: true}), ["result"], 1, false);
	loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/user.info", {handles: un}), ["result", "0"], 2, false);
	loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.status", {contestId: ci, handle: un}), ["result"], 3, false);
	if(success.length != 4)
		setTimeout(function(){
			getSingleRatingChanges(currSingleLastTimeUpdate, un, ci);
		}, 2000);
	else{
		$(".singleContestProgressRatingChangesDisplayer > span:last-child").html(localize("Unrated"));
		if(contestNewWinLoaded) contestNewWinJQ.find(".ratingChanges").html($(".singleContestProgressRatingChangesDisplayer > span:last-child").html());
	}
	setTimeout(function(){
		loadStandings = loadStandings || (settings.openStandings == 2 || (settings.openStandings == 1 && getContestType($(".singleContestName").html()) == "Div. 1"));
		if(success.length == 4)	loadStandings = false;
		if(loadStandings && contestStandingLoadTime.getTime() < (new Date()).getTime() - settings.standingsLoadingGap){
			Q = ++contestStandingsIndex;
			contestStandingLoader = 0;
			contestStandingLoadTime = new Date();
			loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.hacks", {contestId: ci}), ["result"], 4, true);
			if((inContest == 2 && settings.openRankPredict >= 1) || (inContest >= 1 && settings.openRankPredict == 2))
				setTimeout(function(){loadInfo(generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, showUnofficial: settings.openRankPredict == 2}), ["result"], 5, false);}, 500);
	}}, 3000);
}
var singleContestType, singleContestUnrated;
var contestEndTime, contestStartTime;
var contestHacks, contestStandingList;
var contestStandingsIndex = 0, contestStandingLoader = 0;
var contestStandingLoadTime = new Date(0);
var contestRunningStatus, contestRunningType;
var contestSubmissionList = [];
var inContest;
var contestProblemResult;

var contesRealStartTime, contestRealEndTime, virtualProvidedStartTime;
var contestProblemStatusBarInfo = [[], []];

function flushProblemStatusBar(){
	var curr = contestProblemStatusBarInfo[contestRankChosen];
	if(curr.length == 0)	return;
	$(".singleProblemlistDisplayListItemProgress").each(function(index){
		$(this).html("");
		var g = curr[index][0], r = curr[index][1], m = curr[index][2];
		$(this).append(`<span class="successColor" style="width:${g / (g + r + m) * 100}%"></span>`);
		$(this).append(`<span class="dangerColor" style="width:${r / (g + r + m) * 100}%"></span>`);
		$(this).append(`<span style="width:${m / (g + r + m) * 100}%"></span>`);
	})
}

function flushRankDisplayer(){
	$(".singleRankLetters").html(contestRanks[contestRankChosen] == 0 ? "?" : contestRanks[contestRankChosen]);
	if(contestRanks[contestRankChosen] == 0)
		$(".singleRankChangesDisplayer").html("<span>-</span>");
	else if(contestRankLast[contestRankChosen] == 0)
		$(".singleRankChangesDisplayer").html("<span>-</span>");
	else if(contestRankLast[contestRankChosen] == contestRanks[contestRankChosen])
		$(".singleRankChangesDisplayer").html("<i class='fas fa-sort'></i><span>-</span>");
	else if(contestRankLast[contestRankChosen] > contestRanks[contestRankChosen])
		$(".singleRankChangesDisplayer").html
			(`<i class='fas fa-caret-up red'></i><span>${contestRankLast[contestRankChosen] - contestRanks[contestRankChosen]}</span>`);
	else
		$(".singleRankChangesDisplayer").html
			(`<i class='fas fa-caret-down green'></i><span>${contestRanks[contestRankChosen] - contestRankLast[contestRankChosen]}</span>`);
	if(contestCalculatingRank[contestRankChosen])
		$("#singleRankGraphContainer").html(`<div class="loadingInterface"><div><i class="fas fa-calculator"></i><span class="popTip" info="tipCalculatingRankGraph">${languageOption.tip.tipCalculatingRankGraph}</span></div></div>`);
	else generateRankGraph(contestRankInfo[contestRankChosen]);
	if(contestNewWinLoaded){
		contestNewWinJQ.find(".currentRank").html('#' + (contestRanks[contestRankChosen] == 0 ? '?' : contestRanks[contestRankChosen]));
		if(contestRankLast[contestRankChosen] != 0){
			var q = contestRankLast[contestRankChosen] - contestRanks[contestRankChosen];
			var ic = "fa-sort", col = "";
			if(q > 0)	ic = "fa-caret-up", col = "red";
			if(q < 0)	ic = "fa-caret-down", col = "green";
			contestNewWinJQ.find(".currentRank").append(`<span class="currentRankDelta ${col}"><i class="fas ${ic}"></i>${Math.abs(q)}</span>`);
		}
	}
	flushProblemStatusBar();
}
function flushContestantProgressBarInner(){
	$(".singleContestProgressInfo").html("");
	var l = contestEndTime.getTime() - contestStartTime.getTime();
	for(var i=0; i<contestSubmissionList.length; i++){
		var q = contestSubmissionList[i];
		var r = $(`<div class="singleContestProgressPart ${judgeToClass(q.verdict)}"></div>`);
		r.css("left", (q.creationTimeSeconds * 1000 - contestStartTime.getTime()) / l * 100 + "%");
		r.attr("sinfo", JSON.stringify([(q.creationTimeSeconds * 1000 - contestStartTime.getTime()) / l
			, q.problem.index, q.verdict, q.memoryConsumedBytes, q.timeConsumedMillis]));
		$(".singleContestProgressInfo").append(r);
	}
	$(".singleContestProgressPart").unbind("mouseover").mouseover(function(){
		$(".singleContestPoptip").removeClass("closed");
		var argv = JSON.parse($(this).attr("sinfo"));
		$(".singleContestPoptip").css("left", 50 * argv[0] + '%');
		$(".singleContestPoptipTail").css("left", `calc(${5 + 90 * argv[0]}% - 10px)`);
		$(".singlePoptipIndex").html(argv[1]);
		$(".singlePoptipVerdictBlock").attr("class", "singlePoptipVerdictBlock " + judgeToClass(argv[2])).html(toSmallInfo(argv[2]));
		$(".singlePoptipTime").html(''+argv[4]+"ms");
		$(".singlePoptipMemory").html(''+toSubmissionMemoryInfo(argv[3]));
	});
	$(".singleContestProgressPart").unbind("mouseout").mouseout(function(){
		$(".singleContestPoptip").addClass("closed");
	});
	if(contestNewWinLoaded){
		contestNewWinJQ.find(".singleContestProgressBarDisplayer").html($(".singleContestProgressBarDisplayer").html());
		contestNewWinJQ.find(".singleContestProgressBarDisplayer > .singleContestPoptip").remove();
	}
}


var singleContestantTimeCountdownTimeCnt = 0;
function singleContestantTimeCountdown(tc){
	tc = Number(tc);
	if(singleContestantTimeCountdownTimeCnt != tc)	return;
	var d = contestEndTime.getTime() - (new Date()).getTime();
	if(d < 0)	return;
	setTimeout(`singleContestantTimeCountdown(${tc})`, 1000);
	d = getTimeLength2(d);
	$(".singleContestProgressRatingChangesDisplayer > span:first-child")
		.attr("info", "contestRunning").attr("argv", `["${d}"]`)
		.html(languageOption.general.contestRunning.format([d]));
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".singleContestRunningType")
		.attr("info", "contestRunning").attr("argv", `["${d}"]`)
		.html(languageOption.general.contestRunning.format([d]));
	var p = (new Date()).getTime() - contestStartTime.getTime();
	var q = contestEndTime.getTime() - contestStartTime.getTime();
	$(".singleContestProgressBackground").css("width", `${p/q*100}%`);
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".singleContestProgressBackground").css("width", `${p/q*100}%`);
}
function resetProblemPointInfo(json){
	return json;
}
function singleContestantSyncOfficialSettings(un, ci, json, p){
	json = resetProblemPointInfo(json);
	$(".singleContestTags").html("");
	var nam = $(`<div class="singleContestTag primaryColor"><i class="fas fa-calendar"></i>#${ci}</div>`);
	$(".singleContestTags").append(nam);
	var dur = $(`<div class="singleContestTag warningColor"><i class="fas fa-clock"></i>${getTimeLength3(json.contest.durationSeconds*1000)}</div>`);
	$(".singleContestTags").append(dur);
	singleContestType = getContestType(json.contest.name);
	$(".singleContestName").html(json.contest.name);
	if(json.rows.length != 0)
		contestProblemResult = json.rows[0].problemResults;
	contestStartTime = new Date(json.contest.startTimeSeconds * 1000);
	contestEndTime = new Date((json.contest.startTimeSeconds + json.contest.durationSeconds) * 1000);
	contestRunningStatus = json.contest.phase;
	contestRunningType = json.contest.type;
	contestJsonProblems = json.problems;
	flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
	if(json.rows.length != 0){
		contestRankLast[0] = contestRanks[0];
		contestRanks[0] = json.rows[0].rank;
		if(json.contest.phase == "CODING" || contestRankInfo[0].length == 0)
			contestRankInfo[0].push([(new Date()).getTime(), json.rows[0].rank]);
		flushsingleProblemlistDisplayGrid(json.rows[0].problemResults, json.problems);
		flushsingleProblemlistBottom(json.rows[0]);
	}
	else{
		flushsingleProblemlistDisplayGrid([], json.problems);
	}
	flushRankDisplayer();
	if(json.contest.phase == "CODING"){singleContestantTimeCountdown(++ singleContestantTimeCountdownTimeCnt);}
	else if(json.contest.phase == "PENDING_SYSTEM_TEST")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestPendingSystemTest")
			.html(languageOption.general.contestPendingSystemTest),
		$(".singleContestProgressBackground").css("width", "100%");
	else if(json.contest.phase == "SYSTEM_TEST")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestSystemTest")
			.html(languageOption.general.contestSystemTest),
		$(".singleContestProgressBackground").css("width", "100%");
	else if(json.contest.phase == "FINISHED")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestFinished")
			.html(languageOption.general.contestFinished),
		$(".singleContestProgressBackground").css("width", "100%");
	if(singleContestType != undefined){
		var sct = $(`<div class="singleContestTag successColor"><i class="fas fa-book"></i>${singleContestType}</div>`);
		$(".singleContestTags").append(sct);
	}
	if(singleContestUnrated != undefined){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-user-secret"></i>${localize("tag"+singleContestUnrated)}</div>`);
		$(".singleContestTags").append(unk);
	}
	if(json.rows.length > 0 && json.rows[0].party.teamName != undefined){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-users"></i>${localize("tagTeam")}${json.rows[0].party.teamId == -1 ? "" : " #" + json.rows[0].party.teamId}</div>`);
		unk.attr("title", json.rows[0].party.teamName);
		$(".singleContestTags").append(unk);
	}
	if(json.rows.length > 0 && json.rows[0].party.room != undefined){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-house-user"></i>${localize("tagRoom")} #${json.rows[0].party.room}</div>`);
		$(".singleContestTags").append(unk);
	}
	if(contestNewWinLoaded)
		if(contestJsonProblems.length != 0){
			contestNewWinJQ.find(".problemDisplayer").html("");
			for(var i=0; i<contestJsonProblems.length; i++){
				var q = "";
				if(contestProblemResult.length == 0)
					q = "idleColor";
				else{
					if(contestProblemResult[i].points != 0)	q = "successColor";
					else if(contestProblemResult[i].rejectedAttemptCount)	q = "dangerColor";
					else q = "idleColor";
				}
				contestNewWinJQ.find(".problemDisplayer").append(`<div class="smallSubmissionInfo ${q}"><span>${contestJsonProblems[i].index}</span></div>`)
			}
		}
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".singleContestRunningType").html($(".singleContestProgressRatingChangesDisplayer > span:first-child").prop("outerHTML"));
	if(settings.openProblems && $(".singleContestProgressRatingChangesDisplayer > span:first-child").attr("info") != "contestFinished"){
		if(singleFirstTimeLoaded){
			singleFirstTimeLoaded = false;
			openContestProblems(contestContestId);
		}
	}
}
function singleContestantSyncUnofficialSettings(un, ci, json, p){
	json = resetProblemPointInfo(json);
	$(".singleContestTags").html("");
	var nam = $(`<div class="singleContestTag primaryColor"><i class="fas fa-calendar"></i>#${ci}</div>`);
	$(".singleContestTags").append(nam);
	var dur = $(`<div class="singleContestTag warningColor"><i class="fas fa-clock"></i>${getTimeLength3(json.contest.durationSeconds*1000)}</div>`);
	$(".singleContestTags").append(dur);
	singleContestType = getContestType(json.contest.name);
	$(".singleContestName").html(json.contest.name);
	contestStartTime = new Date(json.contest.startTimeSeconds * 1000);
	contestEndTime = new Date((json.contest.startTimeSeconds + json.contest.durationSeconds) * 1000);
	contestRunningStatus = json.contest.phase;
	contestRunningType = json.contest.type;
	contestJsonProblems = json.problems;
	if(json.contest.phase == "CODING"){singleContestantTimeCountdown(++ singleContestantTimeCountdownTimeCnt);}
	else if(json.contest.phase == "PENDING_SYSTEM_TEST")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestPendingSystemTest")
			.html(languageOption.general.contestPendingSystemTest),
		$(".singleContestProgressBackground").css("width", "100%");
	else if(json.contest.phase == "SYSTEM_TEST")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestSystemTest")
			.html(languageOption.general.contestSystemTest),
		$(".singleContestProgressBackground").css("width", "100%");
	else if(json.contest.phase == "FINISHED")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestFinished")
			.html(languageOption.general.contestFinished),
		$(".singleContestProgressBackground").css("width", "100%");
	if(singleContestType != undefined){
		var sct = $(`<div class="singleContestTag successColor"><i class="fas fa-book"></i>${singleContestType}</div>`);
		$(".singleContestTags").append(sct);
	}
	singleContestUnrated = "Unranked";
	inContes = false;
	var inTeam = false;
	var roomId = -1, teamId = -1, teamName;
	for(var i=0; i<json.rows.length; i++)
		if(json.rows[i].party.participantType == "CONTESTANT"){
			contestProblemResult = json.rows[i].problemResults;
			flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
			contestRankLast[1] = contestRanks[1];
			contestRanks[1] = json.rows[i].rank;
			singleContestUnrated = "Contestant";
			if(json.contest.phase == "CODING" || contestRankInfo[1].length == 0)
				contestRankInfo[1].push([(new Date()).getTime(), json.rows[i].rank]);
			inContest = 2;
			flushsingleProblemlistBottom(json.rows[i]);
			flushsingleProblemlistDisplayGrid(json.rows[i].problemResults, json.problems);
			inTeam |= (json.rows[i].party.teamName != undefined);
			if(json.rows[i].party.teamName != undefined)
				teamName = json.rows[i].party.teamName;
			if(json.rows[i].party.teamId != undefined)
				teamId = json.rows[i].party.teamId;
			if(json.rows[i].party.room != undefined)
				roomId = json.rows[i].party.room;
		}
		else if(json.rows[i].party.participantType == "OUT_OF_COMPETITION"){
			contestProblemResult = json.rows[i].problemResults;
			flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
			contestRankLast[1] = contestRanks[1];
			contestRanks[1] = json.rows[i].rank;
			singleContestUnrated = "Unrated";
			if(json.contest.phase == "CODING" || contestRankInfo[1].length == 0)
				contestRankInfo[1].push([(new Date()).getTime(), json.rows[i].rank]);
			inContest = 1;
			flushsingleProblemlistBottom(json.rows[i]);
			flushsingleProblemlistDisplayGrid(json.rows[i].problemResults, json.problems);
			inTeam |= (json.rows[i].party.teamName != undefined);
			if(json.rows[i].party.teamName != undefined)
				teamName = json.rows[i].party.teamName;
			if(json.rows[i].party.teamId != undefined)
				teamId = json.rows[i].party.teamId;
			if(json.rows[i].party.room != undefined)
				roomId = json.rows[i].party.room;
		}
	if(!inContest){
		flushsingleProblemlistDisplayList(contestSubmissionList, [], contestJsonProblems);
		flushsingleProblemlistDisplayGrid([], json.problems);
		flushsingleProblemlistBottom([]);
	}
	flushRankDisplayer();
	if(singleContestUnrated != undefined){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-user-secret"></i>${localize("tag"+singleContestUnrated)}</div>`);
		$(".singleContestTags").append(unk);
	}
	teamId = Number(teamId);
	if(inContest && inTeam){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-users"></i>${localize("tagTeam")}${teamId == -1 ? "" : ` #` + teamId}</div>`);
		unk.attr("title", teamName);
		$(".singleContestTags").append(unk);
	}
	if(roomId != -1){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-house-user"></i>${localize("tagRoom")} #${roomId}</div>`);
		$(".singleContestTags").append(unk);
	}
	if(contestNewWinLoaded)
		if(contestJsonProblems.length != 0){
			contestNewWinJQ.find(".problemDisplayer").html("");
			for(var i=0; i<contestJsonProblems.length; i++){
				var q = "";
				if(contestProblemResult.length == 0)
					q = "idleColor";
				else{
					if(contestProblemResult[i].points != 0)	q = "successColor";
					else if(contestProblemResult[i].rejectedAttemptCount)	q = "dangerColor";
					else q = "idleColor";
				}
				if(json.contest.phase == "SYSTEM_TEST"){
					var aced = false, inq = false, waed = false;
					for(var j=0; j<contestSubmissionList.length; j++){
						if(contestSubmissionList[j].problem.index != contestJsonProblems[i].index)
							continue;
						if(contestSubmissionList[j].verdict == undefined
						|| contestSubmissionList[j].verdict == "TESTING")
							inq = true;
						else if(contestSubmissionList[j].verdict == "OK")
							aced = true;
						else waed = true;
					}
					if(aced)	q = "successColor";
					else if(inq)	q = "idleColor";
					else if(waed)	q = "dangerColor";
					else	q = "";
				}
				contestNewWinJQ.find(".problemDisplayer").append(`<div class="smallSubmissionInfo ${q}"><span>${contestJsonProblems[i].index}</span></div>`)
			}
		}
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".singleContestRunningType").html($(".singleContestProgressRatingChangesDisplayer > span:first-child").prop("outerHTML"));
	if(settings.openProblems && $(".singleContestProgressRatingChangesDisplayer > span:first-child").attr("info") != "contestFinished"){
		if(singleFirstTimeLoaded){
			singleFirstTimeLoaded = false;
			openContestProblems(contestContestId);
		}
	}
}
function singleVirtualSyncUnofficialSettings(un, ci, json, p){
	json = resetProblemPointInfo(json);
	$(".singleContestTags").html("");
	var nam = $(`<div class="singleContestTag primaryColor"><i class="fas fa-calendar"></i>#${ci}</div>`);
	$(".singleContestTags").append(nam);
	var dur = $(`<div class="singleContestTag warningColor"><i class="fas fa-clock"></i>${getTimeLength3(json.contest.durationSeconds*1000)}</div>`);
	$(".singleContestTags").append(dur);
	singleContestType = getContestType(json.contest.name);
	$(".singleContestName").html(json.contest.name);
	contestStartTime = new Date(virtualProvidedStartTime.getTime());
	contestEndTime = new Date(virtualProvidedStartTime.getTime() + json.contest.durationSeconds * 1000);
	contestRunningStatus = ((new Date()).getTime() <= contestEndTime.getTime()) ? "CODING" : "FINISHED";
	contestRunningType = json.contest.type;
	contestJsonProblems = json.problems;
	contestRealStartTime = new Date(json.contest.startTimeSeconds * 1000);
	contestRealEndTime = new Date((json.contest.startTimeSeconds + json.contest.durationSeconds) * 1000);
	if(contestRunningStatus == "CODING"){singleContestantTimeCountdown(++ singleContestantTimeCountdownTimeCnt);}
	else if(contestRunningStatus == "FINISHED")
		$(".singleContestProgressRatingChangesDisplayer > span:first-child")
			.attr("info", "contestFinished")
			.html(languageOption.general.contestFinished),
		$(".singleContestProgressBackground").css("width", "100%");
	if(singleContestType != undefined){
		var sct = $(`<div class="singleContestTag successColor"><i class="fas fa-book"></i>${singleContestType}</div>`);
		$(".singleContestTags").append(sct);
	}
	singleContestUnrated = "Virtual";
	inContest = false;
	var inTeam = false;
	var teamName = -1, teamId = -1;
	for(var i=0; i<json.rows.length; i++){
		if(json.rows[i].party.participantType == "VIRTUAL" && json.rows[i].party.startTimeSeconds * 1000 == virtualProvidedStartTime.getTime()){
			contestProblemResult = json.rows[i].problemResults;
			flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
			contestRankLast[0] = contestRanks[0];
			contestRankLast[1] = contestRanks[1];
			contestRanks[0] = getPredictedRank(json.rows[i].points, json.rows[i].penalty, ((new Date()).getTime() - contestStartTime.getTime()) / 1000, contestStandingList.rows, contestHacks, false);
			contestRanks[1] = getPredictedRank(json.rows[i].points, json.rows[i].penalty, ((new Date()).getTime() - contestStartTime.getTime()) / 1000, contestStandingList.rows, contestHacks, true);
			if(contestRunningStatus == "CODING" || contestRankInfo[0].length == 0)
				contestRankInfo[0].push([(new Date()).getTime(), contestRanks[0]]),
				contestRankInfo[1].push([(new Date()).getTime(), contestRanks[1]]);
			inContest = 1;
			flushsingleProblemlistBottom(json.rows[i]);
			flushsingleProblemlistDisplayGrid(json.rows[i].problemResults, json.problems);
			inTeam |= (json.rows[i].party.teamName != undefined);
			if(json.rows[i].party.teamName != undefined)
				teamName = json.rows[i].party.teamName;
			if(json.rows[i].party.teamId != undefined)
				teamId = json.rows[i].party.teamId;
		}
	}
	if(!inContest){
		contestRankLast[0] = contestRanks[0];
		contestRankLast[1] = contestRanks[1];
		contestRanks[0] = getPredictedRank(0, 0, ((new Date()).getTime() - contestStartTime.getTime()) / 1000, contestStandingList.rows, contestHacks, false);
		contestRanks[1] = getPredictedRank(0, 0, ((new Date()).getTime() - contestStartTime.getTime()) / 1000, contestStandingList.rows, contestHacks, true);
		if(contestRunningStatus == "CODING" || contestRankInfo[0].length == 0)
			contestRankInfo[0].push([(new Date()).getTime(), contestRanks[0]]),
			contestRankInfo[1].push([(new Date()).getTime(), contestRanks[1]]);
		inContest = 1;
		flushsingleProblemlistDisplayList(contestSubmissionList, [], contestJsonProblems);
		flushsingleProblemlistDisplayGrid([], json.problems);
		flushsingleProblemlistBottom([]);
	}
	flushRankDisplayer();
	if(singleContestUnrated != undefined){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-user-secret"></i>${localize("tag"+singleContestUnrated)}</div>`);
		$(".singleContestTags").append(unk);
	}
	teamId = Number(teamId);
	if(inContest && inTeam){
		var unk = $(`<div class="singleContestTag dangerColor"><i class="fas fa-users"></i>${localize("tagTeam")}${teamId == -1 ? "" : ` #` + teamId}</div>`);
		unk.attr("title", teamName)
		$(".singleContestTags").append(unk);
	}
	if(contestNewWinLoaded)
		if(contestJsonProblems.length != 0){
			contestNewWinJQ.find(".problemDisplayer").html("");
			for(var i=0; i<contestJsonProblems.length; i++){
				var q = "";
				if(contestProblemResult.length == 0)
					q = "idleColor";
				else{
					if(contestProblemResult[i].points != 0)	q = "successColor";
					else if(contestProblemResult[i].rejectedAttemptCount)	q = "dangerColor";
					else q = "idleColor";
				}
				if(json.contest.phase == "SYSTEM_TEST"){
					var aced = false, inq = false, waed = false;
					for(var j=0; j<contestSubmissionList.length; j++){
						if(contestSubmissionList[j].problem.index != contestJsonProblems[i].index)
							continue;
						if(contestSubmissionList[j].verdict == undefined
						|| contestSubmissionList[j].verdict == "TESTING")
							inq = true;
						else if(contestSubmissionList[j].verdict == "OK")
							aced = true;
						else waed = true;
					}
					if(aced)	q = "successColor";
					else if(inq)	q = "idleColor";
					else if(waed)	q = "dangerColor";
					else	q = "";
				}
				contestNewWinJQ.find(".problemDisplayer").append(`<div class="smallSubmissionInfo ${q}"><span>${contestJsonProblems[i].index}</span></div>`)
			}
		}
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".singleContestRunningType").html($(".singleContestProgressRatingChangesDisplayer > span:first-child").prop("outerHTML"));
	if(settings.openProblems && $(".singleContestProgressRatingChangesDisplayer > span:first-child").attr("info") != "contestFinished"){
		if(singleFirstTimeLoaded){
			singleFirstTimeLoaded = false;
			openContestProblems(contestContestId);
		}
	}
}
function singleContestantSyncUserInfo(un, ci, json, p){
	var c = ratingToClass(json.rating);
	$(".singleUserAvatar").attr("src", json.titlePhoto);
	$(".singleUsernameDisplayer").attr("class", "singleUsernameDisplayer");
	$(".singleUsernameDisplayer").addClass(c);
	$(".singleUsernameDisplayer").html(un);
	$(".singleRatingDisplayer > div:first-child").addClass(c).html(ratingToGrade(json.rating));
	$(".currRating").attr("class", "currRating setInlineBlock");
	$(".currRating").addClass(c).html(json.rating == undefined ? 0 : json.rating);
	$(".maxRating").attr("class", "maxRating setInlineBlock");
	$(".maxRating").addClass(ratingToClass(json.maxRating)).html(json.maxRating == undefined ? 0 : json.maxRating);
}
function singleContestantSyncProblemStatus(un, ci, json, p){
	contestSubmissionList = [];
	for(var i=0; i<json.length; i++){
		if(json[i].author.participantType == "CONTESTANT"
		|| json[i].author.participantType == "OUT_OF_COMPETITION")
			contestSubmissionList.push(json[i]);
	}
	flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
}
function singleVirtualSyncProblemStatus(un, ci, json, p){
	contestSubmissionList = [];
	for(var i=0; i<json.length; i++){
		if(json[i].author.participantType == "VIRTUAL"
		&& json[i].author.startTimeSeconds == virtualProvidedStartTime.getTime() / 1000)
			contestSubmissionList.push(json[i]);
	}
	flushsingleProblemlistDisplayList(contestSubmissionList, contestProblemResult, contestJsonProblems);
}






function hlMask(hl){
	var ret = {};
	for(var i=0; i<hl.length; i++)
		if(hl[i].creationTimeSeconds * 1000 <= contestEndTime.getTime()
		&& (hl[i].verdict == "HACK_SUCCESSFUL" || hl[i].verdict == "HACK_UNSUCCESSFUL")){
			var from = hl[i].hacker.members[0].handle;
			if(ret[from] == undefined)	ret[from] = [];
			ret[from].push([(hl[i].creationTimeSeconds)-(contestStartTime).getTime()/1000, hl[i].verdict == "HACK_SUCCESSFUL" ? 100 : -50]);
		}
	return ret;
}
function getPredictedRank(points, penalty, time, sl, hl, uno){
	if(penalty==undefined)	penalty = 0;
	var returnValue = 1;
	for(var i=0;i<sl.length;i++){
		var _points = 0, _penalty = 0;
		if(sl[i].party.participantType != "CONTESTANT" &&
			(!uno || sl[i].party.participantType != "OUT_OF_COMPETITION") &&
			(!uno || settings.virtualFilter != false || sl[i].party.participantType != "VIRTUAL"))	continue;
		for(var j=0;j<sl[i].problemResults.length;j++){
			if(sl[i].problemResults[j].bestSubmissionTimeSeconds!=undefined
			&& sl[i].problemResults[j].bestSubmissionTimeSeconds<=time){
				_points += sl[i].problemResults[j].points;
				var _dalta = sl[i].problemResults[j].penalty;
				if(contestRunningType == "ICPC")
					_dalta = Math.floor(sl[i].problemResults[j].bestSubmissionTimeSeconds/60)
						+sl[i].problemResults[j].rejectedAttemptCount*10;
				_penalty += (_dalta == undefined ? 0 : _dalta);
			}
		}
		if(contestRunningType == "CF" && hl[sl[i].party.members[0].handle]!=undefined){
			for(var j=0;j<hl[sl[i].party.members[0].handle].length;j++){
				if(hl[sl[i].party.members[0].handle][j][0]>time)	break;
				_points += hl[sl[i].party.members[0].handle][j][1];
			}
		}
		if(points < _points || (points == _points && penalty > _penalty))
			++ returnValue;
	}
	return returnValue;
}
function getOverallPredictedRank(pr, sl, un, hl, uno){
	var currT = contestStartTime;
	var Step = settings.reloadTime;
	var returnValue = [[(contestStartTime).getTime(), 1]];
	var p = new Date();
	var NoteNumber = (contestEndTime).getTime() - (contestStartTime).getTime();
	NoteNumber = Math.ceil(NoteNumber / Step);
	Step /= 1000;
	var T = 0;
	var eventList = [];
	for(var i=0; i<NoteNumber; i++)
		eventList.push([]);
	var nameToId = {}, curr = -1;
	var scores = [];
	var thisPerson = -1;
	// Load All Person
	for(var i=0;i<sl.length;i++){
		var op = (checkHandles(sl[i].party.members, un) && contestStartTime.getTime() / 1000 == sl[i].party.startTimeSeconds && sl[i].party.participantType != "PRACTICE");
		var _points = 0, _penalty = 0;
		if(sl[i].party.participantType != "CONTESTANT" &&
			(!uno || sl[i].party.participantType != "OUT_OF_COMPETITION") &&
			(!uno || settings.virtualFilter != false || sl[i].party.participantType != "VIRTUAL") && !op)	continue;
		++curr; scores.push([0, 0]);
		if(checkHandles(sl[i].party.members, un) && contestStartTime.getTime() / 1000 == sl[i].party.startTimeSeconds)
			thisPerson = curr;
		for(var j=0;j<sl[i].problemResults.length;j++){
			if(sl[i].problemResults[j].bestSubmissionTimeSeconds != undefined){
				var q = [sl[i].problemResults[j].points, 0];
				if(contestRunningType == "ICPC")
					q[1] = Math.floor(sl[i].problemResults[j].bestSubmissionTimeSeconds / 60)
						+sl[i].problemResults[j].rejectedAttemptCount*10;
				if(Math.floor(sl[i].problemResults[j].bestSubmissionTimeSeconds / Step) < eventList.length)
					eventList[Math.floor(sl[i].problemResults[j].bestSubmissionTimeSeconds / Step)].push([curr, q]);
			}
		}
		if(contestRunningType == "CF" && hl[sl[i].party.members[0].handle]!=undefined){
			for(var j=0;j<hl[sl[i].party.members[0].handle].length;j++)
				if(hl[sl[i].party.members[0].handle][j][0] <= (contestEndTime.getTime()) / 1000)
					eventList[Math.floor(hl[sl[i].party.members[0].handle][j][0] / Step)].push([curr, [hl[sl[i].party.members[0].handle][j][1], 0]]);
		}
	}
	if(thisPerson == -1){
		thisPerson = ++curr;
		scores.push([0, 0]);
	}
	var currentRank = 1;
	var currTime = contestStartTime.getTime();
	function chk(x, y){
		if(x[0] != y[0])	return x[0] > y[0];
		return x[1] < y[1];
	}
	for(var t = 0; t < eventList.length; t++){
		var recalc = false;
		var y = eventList[t];
		for(var i=0; i<y.length; i++){
			if(chk(scores[y[i][0]], scores[thisPerson]))
				--currentRank;
			scores[y[i][0]][0] += y[i][1][0];
			scores[y[i][0]][1] += y[i][1][1];
			if(chk(scores[y[i][0]], scores[thisPerson]))
				++currentRank;
			if(y[i][0] == thisPerson)	recalc = true;
		}
		if(recalc){
			currentRank = 1;
			for(var i=0; i<=curr; i++)
				if(chk(scores[i], scores[thisPerson]))
					++currentRank;
		}
		currTime += Step * 1000;
		currTime = Math.min(currTime, contestEndTime.getTime());
		returnValue.push([currTime, currentRank]);
	}
	return returnValue;
}
function loadProblemStatusBar(uno){
	var jq = $(".singleProblemlistDisplayListItemProgress");
	jq.html("");
	var T = (new Date().getTime() - contestStartTime.getTime()) / 1000;
	var ret = [];
	jq.each(function(index){
		var g = 0, r = 0, m = 0;
		for(var i=0; i<contestStandingList.rows.length; i++){
			if(contestStandingList.rows[i].party.participantType == "VIRTUAL"
			|| contestStandingList.rows[i].party.participantType == "PRACTICE"
			|| (!uno && contestStandingList.rows[i].party.participantType == "OUT_OF_COMPETITION"))	continue;
			if(contestStandingList.rows[i].problemResults[index].bestSubmissionTimeSeconds <= T)
				++g;
			else if((singleContestUnrated != "Virtual" || (new Date().getTime()) >= contestEndTime.getTime())
				&& contestStandingList.rows[i].problemResults[index].rejectedAttemptCount != 0)	++r;
			else ++m;
		}
		ret.push([g, r, m]);
	})
	return ret;
}
function loadStandingsService(un, ci, forced){
	if(forced == true || (settings.openRankPredict >= 1 && (inContest == 2 || singleContestUnrated == "Virtual"))){
		contestCalculatingRank[0] = true;
		flushRankDisplayer();
		var g = function(ret){
			var q = getOverallPredictedRank(contestProblemResult, contestStandingList.rows, un, contestHacks, false);
			ret(q);
		}
		g(function(json){
			contestRankInfo[0] = json;
			contestCalculatingRank[0] = false;
			contestRanks[0] = json[json.length - 1][1];
			flushRankDisplayer();
		});
	}
	if(forced == true || (settings.openRankPredict == 2 && inContest >= 1)){
		contestCalculatingRank[1] = true;
		flushRankDisplayer();
		var g = function(ret){
			var q = getOverallPredictedRank(contestProblemResult, contestStandingList.rows, un, contestHacks, true);
			ret(q);
		}
		g(function(json){
			contestRankInfo[1] = json;
			contestCalculatingRank[1] = false;
			contestRanks[1] = json[json.length - 1][1];
			flushRankDisplayer();
		})
	}
	if(settings.showProblemStatus){
		contestProblemStatusBarInfo[0] = loadProblemStatusBar(false);
		contestProblemStatusBarInfo[1] = loadProblemStatusBar(true);
		setTimeout(function(){flushProblemStatusBar()}, 200);
	}
}
function singleContestantSyncHacks(un, ci, json, p){
	if(p != contestStandingsIndex)	return;
	++contestStandingLoader;
	if(json == undefined)
		contestHacks = {};
	else contestHacks = hlMask(json);
	if(contestStandingLoader == 2)
		loadStandingsService(un, ci, false);
}
function singleContestantSyncStandings(un, ci, json, p){
	json = resetProblemPointInfo(json);
	if(p != contestStandingsIndex)	return;
	contestStandingList = json;
	++contestStandingLoader;
	if(contestStandingLoader == 2)
		loadStandingsService(un, ci, false);
}
function singleContestantMainTrack(currSingleLastTimeUpdate, un, ci){
	contestRanks = [0, 0];
	contestRankLast = [0, 0];
	contestRankInfo = [[], []];
	contestStandingLoadTime = new Date(0);
	contestProblemResult = [];
	contestProblemStatusBarInfo = [[], []];
	contestSubmissionList = [];
	contestJsonProblems = [];
	contestStartTime = contestEndTime = new Date(0);
	singleContestUnrated = undefined;
	singleContestType = "";
	contestHacks = contestStandingList = undefined;
	contestCalculatingRank = [false, false];
	contestStandingsIndex = 0, contestStandingLoader = 0;
	contestStandingLoadTime = new Date(0);
	contestRunningStatus = "", contestRunningType = "";
	contestSubmissionList = [];
	singleAnnouncementLength = -1;
	inContest = false;
	singleSavedUserInfo = "";
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i").css("opacity", 0);
		$(".singleContent > div > div > .loadingInterface > div > .popTip").addClass("closed").css("max-height", 0);
	}, 300);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").remove();
	}, 800);
	var q;
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i")
			.removeClass("fa-spin").addClass("fa-sync-alt").removeClass("fa-clock").addClass("fa-spin").css("opacity", 1);
		q = $(`<div class='popTip closed'></div>`);
		q.html(`<span info="tipLaoding">${languageOption.tip.tipLoading}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(q);
	}, 900);
	setTimeout(function(){
		q.removeClass("closed");
	}, 1100);
	function func(){
		if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
		getAllSingleContestantInfo(currSingleLastTimeUpdate, un, ci, [singleContestantSyncOfficialSettings, singleContestantSyncUnofficialSettings, singleContestantSyncUserInfo, singleContestantSyncProblemStatus, singleContestantSyncHacks, singleContestantSyncStandings], [function(){}, function(){}, function(){}, function(){}, function(){}, function(){}]
			, function(){
				if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
				flushContestantProgressBarInner();
				$(".singleContent > div > div > .loadingInterface").css("opacity", 0);
				setTimeout(function(){
					$(".singleContent > div > div > .loadingInterface").css("display", "none");
				}, 200);
				if(contestRunningStatus != "FINISHED")
					setTimeout(func, settings.reloadTime);
			}, function(){
				if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
				setTimeout(func, settings.smallReloadTime);
			}, false);
	}
	func();
}


function singleVirtualMainTrack(currSingleLastTimeUpdate, un, ci, tm){
	$(".forceLoadStandings").css("display", "none");
	virtualProvidedStartTime = tm;
	contestRanks = [0, 0];
	contestRankLast = [0, 0];
	contestRankInfo = [[], []];
	contestStandingLoadTime = new Date(0);
	contestProblemResult = [];
	contestProblemStatusBarInfo = [[], []];
	contestSubmissionList = [];
	contestJsonProblems = [];
	contestStartTime = contestEndTime = new Date(0);
	singleContestUnrated = undefined;
	singleContestType = "";
	contestCalculatingRank = [false, false];
	contestStandingsIndex = 0, contestStandingLoader = 0;
	contestStandingLoadTime = new Date(0);
	contestRunningStatus = "", contestRunningType = "";
	contestSubmissionList = [];
	inContest = false;
	contestRealEndTime = contestRealEndTime = new Date(0);
	singleSavedUserInfo = "";
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i").css("opacity", 0);
		$(".singleContent > div > div > .loadingInterface > div > .popTip").addClass("closed").css("max-height", 0);
	}, 300);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").remove();
	}, 800);
	var q;
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i")
			.removeClass("fa-spin").addClass("fa-sync-alt").removeClass("fa-clock").addClass("fa-spin").css("opacity", 1);
		q = $(`<div class='popTip closed'></div>`);
		q.html(`<span info="tipLaoding">${languageOption.tip.tipLoading}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(q);
	}, 900);
	setTimeout(function(){
		q.removeClass("closed");
	}, 1100);
	var H = false;
	function func(){
		if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
		getAllSingleContestantInfo(currSingleLastTimeUpdate, un, ci, [function(){}, singleVirtualSyncUnofficialSettings, singleContestantSyncUserInfo, singleVirtualSyncProblemStatus], [function(){}, function(){}, function(){}, function(){}]
			, function(){
				if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
				flushContestantProgressBarInner();
				$(".singleContent > div > div > .loadingInterface").css("opacity", 0);
				setTimeout(function(){
					$(".singleContent > div > div > .loadingInterface").css("display", "none");
				}, 200);
				if(settings.showProblemStatus){
					contestProblemStatusBarInfo[0] = loadProblemStatusBar(false);
					contestProblemStatusBarInfo[1] = loadProblemStatusBar(true);
					setTimeout(function(){flushProblemStatusBar()}, 300);
				}
				if(contestRunningStatus == "FINISHED"){
					if(!H)
						setTimeout(function(){loadStandingsService(un, ci, true);}, 1000);
				}
				if(contestRunningStatus == "CODING")
					setTimeout(func, settings.reloadTime);
				H = true;
			}, function(){
				if(currSingleLastTimeUpdate != singleLastTimeUpdate)	return;
				setTimeout(func, settings.smallReloadTime);
			}, false);
	}
	func();
}

function singleRegisterContest(){
	$(".singleRegisterType").html(`<span info="tipLoading">${languageOption.tip.tipLoading}</span>`);
	var ci = contestContestId;
	registerContest(ci, function(){
		$(".singleRegisterType").css("opacity", 0);
		setTimeout(function(){
			$(".singleRegisterType").html(`<span info="tipHaveARest">${languageOption.tip.tipHaveARest}</span>`);
			$(".singleRegisterType").css("opacity", 1);
		}, 500);
	}, function(){
		$(".singleRegisterType").html(`<span info="errorRegisterFailed">${languageOption.error.errorRegisterFailed}</span>`);
		setTimeout(function(){
			$(".singleRegisterType").html(`<span info="tipNotRegtered">${languageOption.tip.tipNotRegtered}</span>`);
		}, 1000);
	})
}
function singleContestantWaitToStart(currLastTimeUpdate, un, ci){
	if(settings.openProblems)
		openProblemWin([]);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").addClass("closed").css("max-height", 0);
		$(".singleContent > div > div > .loadingInterface > div > i").css("opacity", 0);
	}, 300);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").remove();
	}, 800);
	var q, r;
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i")
			.removeClass("fa-spin").removeClass("fa-sync-alt").addClass("fa-clock").css("opacity", 1);
		q = $(`<div class='popTip closed'></div>`);
		q.html(`<span info="tipContestNotStarted">${languageOption.tip.tipContestNotStarted}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(q);
		r = $(`<div class='popTip closed small singleRegisterType'></div>`);
		r.html(`<span info="tipLoading">${languageOption.tip.tipLoading}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(r);
	}, 900);
	setTimeout(function(){
		q.removeClass("closed");
	}, 1100);
	setTimeout(function(){
		r.removeClass("closed");
	}, 1350);
	var startTime = undefined;
	var u;
	var reloadTimeCount = function(){
		if(currLastTimeUpdate != singleLastTimeUpdate)	return;
		if(startTime <= (new Date()).getTime()){
			if(settings.openProblems){
				singleFirstTimeLoaded = false;
				openContestProblems(ci);
			}
			singleContestantMainTrack(currLastTimeUpdate, un, ci);
			return;
		}
		q.html(`<span info="tipContestStartIn" argv='["${getTimeLength2(startTime - (new Date()).getTime())}"]'>${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
		if(contestNewWinLoaded)
			contestNewWinJQ.find(".singleContestRunningType").html(`<span info="tipContestStartIn" argv='["${getTimeLength2(startTime - (new Date()).getTime())}"]'>${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
		u = setTimeout(reloadTimeCount, 500);
	}
	var reloadMonitor = function(){
		q.css("opacity", 0);
		setTimeout(function(){
			if(u)	killTimeout(u);
			q.html(`<span info="tipContestStartIn">${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
			q.css("opacity", 1); u = reloadTimeCount();
		}, 500)
	}
	var reloadStartTime = function(){
		if(currLastTimeUpdate != singleLastTimeUpdate)	return;
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		if(RunInNwjs)
			$.ajax({
				url: settings.mainURL + `/${ci >= 100000 ? "gym" : "contest"}/` + ci + "/countdown",
				timeout : settings.largeTimeLimit,
				success: function(json){
					singleLoadType = 4;
					setTimeout(reloadStartTime, settings.reloadTime);
					reloadSingleMemoryUsed();
					var q = $(json).find(".countdown").attr("title");
					if(q == undefined || q == "")
						q = $(json).find(".countdown > span").attr("title");
					if(q == undefined || q == "")
						q = $(json).find(".countdown").html();
					if(q == undefined || q == "")
						q = $(json).find(".countdown > span").html();
					q = q.split(":");
					var cd = (new Date()).getTime() + (Number(q[0]) * 60 * 60 + Number(q[1]) * 60 + Number(q[2])) * 1000;
					var hoam = 1000 * 60;
					cd = (Math.floor(cd / hoam + 0.5) * hoam);
					if(startTime == undefined)
						reloadMonitor();
					startTime = cd;
					contestStartTime = new Date(cd);
				},
				error: function(jqXHR, status, errorThrown){
					if(status == "timeout"){
						//Network Timeout
						singleLoadType = 2;
						reloadSingleMemoryUsed();
						setTimeout(reloadStartTime, settings.reloadTime);
						return;
					}
					if(jqXHR.readyState != 4){
						//Network Error
						singleLoadType = 3;
						reloadSingleMemoryUsed();
						setTimeout(reloadStartTime, settings.reloadTime);
						return;
					}
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					setTimeout(reloadStartTime, settings.reloadTime);
					reloadOption = true;
				},
				xhr: function() {
					var xhr = new XMLHttpRequest();
					var q = 0;
					singleLoadType = 1; reloadSingleMemoryUsed();
					xhr.addEventListener('progress', function (e) {
						 singleMemoryUsed += (e.loaded - q);
						 singleLoadType = 1;
						 singleLoadType = 1;
						 reloadSingleMemoryUsed();
						 q = e.loaded;
					});
					return xhr;
				}
			});
		else
			$.ajax({
				url: generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.list", {gym: ci >= 100000}),
				type: "GET",
				timeout : settings.largeTimeLimit,
				success: function(json){
					singleLoadType = 4;
					setTimeout(reloadStartTime, settings.reloadTime);
					reloadSingleMemoryUsed();
					for(var i=0; i<json.result.length; i++)
						if(json.result[i].id == ci){
							if(startTime == undefined)
								reloadMonitor();
							startTime = json.result[i].startTimeSeconds * 1000;
							contestStartTime = (new Date(startTime));
						}
				},
				error: function(jqXHR, status, errorThrown){
					if(status == "timeout"){
						//Network Timeout
						singleLoadType = 2;
						reloadSingleMemoryUsed();
						setTimeout(reloadStartTime, settings.reloadTime);
						return;
					}
					if(jqXHR.readyState != 4){
						//Network Error
						singleLoadType = 3;
						reloadSingleMemoryUsed();
						setTimeout(reloadStartTime, settings.reloadTime);
						return;
					}
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					setTimeout(reloadStartTime, settings.reloadTime);
					reloadOption = true;
				},
				xhr: function() {
					var xhr = new XMLHttpRequest();
					var q = 0;
					singleLoadType = 1; reloadSingleMemoryUsed();
					xhr.addEventListener('progress', function (e) {
						 singleMemoryUsed += (e.loaded - q);
						 singleLoadType = 1;
						 reloadSingleMemoryUsed();
						 q = e.loaded;
					});
					return xhr;
				}
			});
	}
	setTimeout(reloadStartTime, 1500);
	setTimeout(function(){
		checkRegistation(ci, function(t){
			$(".singleRegisterType").css("opacity", 0);
			setTimeout(function(){
				$(".singleRegisterType").html(`<span info="tipHaveARest">${languageOption.tip.tipHaveARest}</span>`);
				$(".singleRegisterType").css("opacity", 1);
			}, 500);
		},
		function(){
			$(".singleRegisterType").css("opacity", 0);
			setTimeout(function(){
				$(".singleRegisterType").html(`<span info="tipNotRegtered">${languageOption.tip.tipNotRegtered}</span>`);
				$(".singleRegisterType").css("opacity", 1);
			}, 500);
		})
	}, 1500);
}
function loadSingleContestantAll(un, ci){
	var currLastTimeUpdate = singleLastTimeUpdate;
	var q = $(`<div class='popTip closed'></div>`);
	q.html(`<span info="tipInitializing">${languageOption.tip.tipInitializing}</span>`);
	$(".singleContent > div > div > .loadingInterface > div").append(q);
	setTimeout(function(){
		q.removeClass("closed");
	}, 300);
	var reloadIf = function(){
		if(currLastTimeUpdate != singleLastTimeUpdate)	return;
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		$.ajax({
			url: generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, from: 1, count: 1, showUnofficial: true}),
			type: "GET",
			timeout : settings.smallTimeLimit,
			success: function(json){
				singleLoadType = 4;
				reloadSingleMemoryUsed();
				singleContestantMainTrack(currLastTimeUpdate, un, ci);
			},
			error: function(jqXHR, status, errorThrown){

				if(status == "timeout"){
					//Network Timeout
					singleLoadType = 2;
					reloadSingleMemoryUsed();
					setTimeout(reloadIf, settings.reloadTime);
					return;
				}
				if(jqXHR.readyState != 4){
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					setTimeout(reloadIf, settings.reloadTime);
					return;
				}
				var ec = jqXHR.responseJSON.comment;
				if(ec == `contestId: Contest with id ${ci} has not started`){
					singleLoadType = 4;
					reloadSingleMemoryUsed();
					singleContestantWaitToStart(currLastTimeUpdate, un, ci);
					return;
				}
				//Network Error
				singleLoadType = 3;
				reloadSingleMemoryUsed();
				setTimeout(reloadIf, settings.reloadTime);
				reloadOption = true;
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				var q = 0;
				singleLoadType = 1; reloadSingleMemoryUsed();
				xhr.addEventListener('progress', function (e) {
					 singleMemoryUsed += (e.loaded - q);
					 singleLoadType = 1;
					 reloadSingleMemoryUsed();
					 q = e.loaded;
				});
				return xhr;
			}
		});
	}
	reloadIf();
}





function singleVirtualWaitToStart(currLastTimeUpdate, un, ci, tm){
	var currLastTimeUpdate = singleLastTimeUpdate;
	if(settings.openProblems)
		openProblemWin([]);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").addClass("closed").css("max-height", 0);
		$(".singleContent > div > div > .loadingInterface > div > i").css("opacity", 0);
	}, 300);
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > .popTip").remove();
	}, 800);
	var q, r;
	setTimeout(function(){
		$(".singleContent > div > div > .loadingInterface > div > i")
			.removeClass("fa-spin").removeClass("fa-sync-alt").addClass("fa-clock").css("opacity", 1);
		q = $(`<div class='popTip closed'></div>`);
		q.html(`<span info="tipContestNotStarted">${languageOption.tip.tipContestNotStarted}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(q);
		r = $(`<div class='popTip closed small'></div>`);
		r.html(`<span info="tipHaveARest">${languageOption.tip.tipHaveARest}</span>`);
		$(".singleContent > div > div > .loadingInterface > div").append(r);
	}, 900);
	setTimeout(function(){
		q.removeClass("closed");
	}, 1100);
	setTimeout(function(){
		r.removeClass("closed");
	}, 1350);
	var startTime = tm;
	var u;
	var reloadTimeCount = function(){
		if(currLastTimeUpdate != singleLastTimeUpdate)	return;
		if(startTime <= (new Date()).getTime()){
			if(settings.openProblems){
				singleFirstTimeLoaded = false;
				openContestProblems(ci);
			}
			singleVirtualMainTrack(currLastTimeUpdate, un, ci, tm);
			return;
		}
		q.html(`<span info="tipContestStartIn" argv='["${getTimeLength2(startTime - (new Date()).getTime())}"]'>${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
		if(contestNewWinLoaded)
			contestNewWinJQ.find(".singleContestRunningType").html(`<span info="tipContestStartIn" argv='["${getTimeLength2(startTime - (new Date()).getTime())}"]'>${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
		u = setTimeout(reloadTimeCount, 500);
	}
	var reloadMonitor = function(){
		q.css("opacity", 0);
		setTimeout(function(){
			if(u)	killTimeout(u);
			q.html(`<span info="tipContestStartIn">${languageOption.tip.tipContestStartIn.format([getTimeLength2(startTime - (new Date()).getTime())])}</span>`);
			q.css("opacity", 1); u = reloadTimeCount();
		}, 500)
	}
	setTimeout(reloadMonitor, 2500);
}

function loadSingleVirtualAll(un, ci, tm){
	var currLastTimeUpdate = singleLastTimeUpdate;
	var q = $(`<div class='popTip closed'></div>`);
	q.html(`<span info="tipInitializing">${languageOption.tip.tipInitializing}</span>`);
	$(".singleContent > div > div > .loadingInterface > div").append(q);
	r = $(`<div class='popTip closed small'></div>`);
	r.html(`<span info="tipFetchingStandings">${languageOption.tip.tipFetchingStandings}</span>`);
	$(".singleContent > div > div > .loadingInterface > div").append(r);
	setTimeout(function(){
		q.removeClass("closed");
	}, 500);
	setTimeout(function(){
		r.removeClass("closed");
	}, 750);
	var reloadIf = function(U, D, C, Q){
		if(currLastTimeUpdate != singleLastTimeUpdate)	return;
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		bigIsComing[6] = $.ajax({
			url: generateAuthorizeURL(U, D),
			type: "GET",
			success: C,
			error: function(jqXHR, status, errorThrown){
				if(status == "timeout"){
					//Network Timeout
					singleLoadType = 2;
					reloadSingleMemoryUsed();
					setTimeout(function(){reloadIf(U, D, C)}, settings.reloadTime);
					return;
				}
				if(Q){ C({result: []}); return; }
				if(jqXHR.readyState != 4){
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					setTimeout(function(){reloadIf(U, D, C)}, settings.reloadTime);
					return;
				}
				//Network Error
				singleLoadType = 3;
				reloadSingleMemoryUsed();
				setTimeout(function(){reloadIf(U, D, C)}, settings.reloadTime);
				reloadOption = true;
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				var q = 0;
				singleLoadType = 1; reloadSingleMemoryUsed();
				xhr.addEventListener('progress', function (e) {
					 singleMemoryUsed += (e.loaded - q);
					 singleLoadType = 1;
					 reloadSingleMemoryUsed();
					 q = e.loaded;
				});
				return xhr;
			}
		});
	}
	reloadIf(settings.codeforcesApiUrl + "/contest.standings"
		, {contestId: ci, showUnofficial: true}, function(json){
		contestStandingList = json.result;
		singleLoadType = 4;
		reloadSingleMemoryUsed();
		r.addClass("closed");
		setTimeout(function(){
			r.html(`<span info="tipFetchingHacks">${languageOption.tip.tipFetchingHacks}</span>`);
			r.removeClass("closed");
			reloadIf(settings.codeforcesApiUrl + "/contest.hacks"
				, {contestId: ci}, function(json){
				singleLoadType = 4;
				reloadSingleMemoryUsed();
				contestHacks = hlMask(json.result);
				if(tm.getTime() <= (new Date()).getTime())
					singleVirtualMainTrack(currLastTimeUpdate, un, ci, tm);
				else
					singleVirtualWaitToStart(currLastTimeUpdate, un, ci, tm);
			}, true);
		}, 500);
	}, false);
}







function loadSingleInformation(type, un, ci, tm, started){
	if(contestNewWinOpened){
		contestNewWinOpened = contestNewWinLoaded = false;
		contestNewWin.close();
		$(".singleOpenSmallWindow").html(`<span info="singleSmallWindow">${languageOption.general.singleSmallWindow}</span> <i class="fas fa-angle-right"></i>`);
	}
	singleFirstTimeLoaded = true;
	contestUsername = un;
	contestContestId = ci;
	singleLastTimeUpdate = new Date();
	contestRanks = [0, 0];
	contestRankLast = [0, 0];
	contestRankInfo = [[], []];
	contestStandingLoadTime = new Date(0);
	contestProblemResult = [];
	contestProblemStatusBarInfo = [[], []];
	contestSubmissionList = [];
	contestJsonProblems = [];
	contestStartTime = contestEndTime = new Date(0);
	singleContestUnrated = undefined;
	singleContestType = "";
	contestHacks = contestStandingList = undefined;
	contestCalculatingRank = [false, false];
	contestStandingsIndex = 0, contestStandingLoader = 0;
	contestStandingLoadTime = new Date(0);
	contestRunningStatus = "", contestRunningType = "";
	contestSubmissionList = [];
	inContest = false;
	contestEnterInPage = true;
	$(".contentRowInfo").eq(0).css("left", "-920px");
	$(".singleTypeChosen").removeClass("singleTypeChosen");
	initSinglePage();
	if(type == 0)	loadSingleContestantAll(un, ci);
	else
		loadSingleVirtualAll(un, ci, tm);
}
function verifySingleInformation(type, un, ci, tm){
	var forButton = "." + (type == 0 ? "singleContestantButton" : "singleVirtualButton");
	$(forButton).html(`<i class="fas fa-spin fa-sync-alt"></i><span info="singleCheckExist">${languageOption.general.singleCheckExist}</span>`);
	$(forButton).attr("disabled", true);
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + "/user.info", {handles: un}),
		type: "GET",
		timeout : settings.smallTimeLimit,
		success: function(json){
			var isGym = Number(ci) >= 100000;
			$.ajax({
				url: generateAuthorizeURL(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, handles: un, showUnofficial: true}),
				type: "GET",
				timeout : settings.smallTimeLimit,
				success: function(json){
					json = json.result;
					if(type == 0){
						if(json.contest.phase == "CODING"){
							$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
							$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
							setTimeout(function(){
								$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
								$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
								loadSingleInformation(type, un, ci, tm, true);
							}, 1000);
							return;
						}
						for(var i=0; i<json.rows.length; i++)
							if(json.rows[i].party.participantType == "CONTESTANT" || json.rows[i].party.participantType == "OUT_OF_COMPETITION"){
								$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
								$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
								setTimeout(function(){
									$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
									$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
									loadSingleInformation(type, un, ci, tm, true);
								}, 1000);
								return;
							}
						$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorNotInTheContest">${languageOption.error.errorNotInTheContest}</span>`);
						$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
						}, 1000);
					}
					if(type == 1){
						if(tm == "auto"){
							for(var i=json.rows.length-1; i>=0; i--)
								if(json.rows[i].party.participantType == "VIRTUAL"){
									$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
									$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
									setTimeout(function(){
										$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
										$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
										loadSingleInformation(type, un, ci, new Date(json.rows[i].party.startTimeSeconds * 1000), true);
									}, 1000);
									return;
								}
							$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorVirtualInfoNotFound">${languageOption.error.errorVirtualInfoNotFound}</span>`);
							$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
							setTimeout(function(){
								$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
								$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
							}, 1000);
							return;
						}
						for(var i=json.rows.length-1; i>=0; i--)
							if(json.rows[i].party.participantType == "VIRTUAL" && tm.getTime() == json.rows[i].party.startTimeSeconds * 1000){
								$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
								$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
								setTimeout(function(){
									$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
									$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
									loadSingleInformation(type, un, ci, new Date(json.rows[i].party.startTimeSeconds * 1000), true);
								}, 1000);
								return;
							}
						if(tm.getTime() + json.contest.durationSeconds * 1000 < (new Date()).getTime()){
							$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorVirtualInfoNotFound">${languageOption.error.errorVirtualInfoNotFound}</span>`);
							$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
							setTimeout(function(){
								$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
								$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
							}, 1000);
							return;
						}
						$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
						$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
							loadSingleInformation(type, un, ci, tm, true);
						}, 1000);
						return;
					}
					return;
				},
				error: function(jqXHR, status, errorThrown){
					if(status == "timeout"){
						$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorLoadTimeout">${languageOption.error.errorLoadTimeout}</span>`);
						$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
						}, 1000);
						return;
					}
					if(jqXHR.readyState != 4){
						$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorNetworkError">${languageOption.error.errorNetworkError}</span>`);
						$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
						}, 1000);
						return;
					}
					var ec = jqXHR.responseJSON.comment;
					if(type == 0 && ec == `contestId: Contest with id ${ci} has not started`){
						$(forButton).html(`<i class="fas fa-check"></i><span info="alertLoadSuccess">${languageOption.general.alertLoadSuccess}</span>`);
						$(forButton).removeClass("primaryColor").addClass("successColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("successColor").attr("disabled", false);
							loadSingleInformation(type, un, ci, tm, false);
						}, 1000);
						return;
					}
					if(type == 0){
						$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorContestNotFound">${languageOption.error.errorContestNotFound}</span>`);
						$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
						}, 1000);
					}
					else{
						$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorContestNotStarted">${languageOption.error.errorContestNotStarted}</span>`);
						$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
						setTimeout(function(){
							$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
							$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
						}, 1000);
					}
				}
			 });
		},
		error: function(jqXHR, status, errorThrown){
			if(status == "timeout"){
				$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorLoadTimeout">${languageOption.error.errorLoadTimeout}</span>`);
				$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
				setTimeout(function(){
					$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
					$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
				}, 1000);
				return;
			}
			if(jqXHR.readyState != 4){
				$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorNetworkError">${languageOption.error.errorNetworkError}</span>`);
				$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
				setTimeout(function(){
					$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
					$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
				}, 1000);
				return;
			}
			$(forButton).html(`<i class="fas fa-exclamation-triangle"></i><span info="errorUserNotFound">${languageOption.error.errorUserNotFound}</span>`);
			$(forButton).removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
			setTimeout(function(){
				$(forButton).html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
				$(forButton).addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
			}, 1000);
		}
	 });
}

var queryUsrename = /^[a-zA-Z0-9_.-]*$/;
var queryNumber = /^[0-9]+$/;
var queryTime = new RegExp("^([0-9]{4,4})/([0-9]{1,2})/([0-9]{1,2})\\s([0-9]{1,2}):([0-9]{1,2})$");
$(".singleContestantButton").click(function(event){
	event.stopPropagation();
	if($(this).attr("disabled"))
		return;
	$(".singleContestantButton").attr("disabled", true);
	singleLastTimeUpdate = new Date();
	var un = $(".singleContestantUsernameInput").val();
	if(un == "")
		un = currentLoginHandle;
	if(un.length < 3 || un.length > 24 || !queryUsrename.test(un)){
		$(".singleContestantButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorUsernameError">${languageOption.error.errorUsernameError}</span>`);
		$(".singleContestantButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleContestantButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleContestantButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
		}, 1000);
		return;
	}
	var ci = $(".singleContestantContestIdInput").val();
	if(!queryNumber.test(ci)){
		$(".singleContestantButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorContestIdError">${languageOption.error.errorContestIdError}</span>`);
		$(".singleContestantButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleContestantButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleContestantButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
		}, 1000);
		return;
	}
	verifySingleInformation(0, un, ci, Date(0));
})
function isLoopYear(x) {
	return (new Date(x, 1, 29).getDate() == 29);
}
$(".singleVirtualButton").click(function(event){
	event.stopPropagation();
	if($(this).attr("disabled"))
		return;
	$(".singleVirtualButton").attr("disabled", true);
	singleLastTimeUpdate = new Date();
	var un = $(".singleVirtualUsernameInput").val();
	if(un == "")
		un = currentLoginHandle;
	if(un.length < 3 || un.length > 24 || !queryUsrename.test(un)){
		$(".singleVirtualButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorUsernameError">${languageOption.error.errorUsernameError}</span>`);
		$(".singleVirtualButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleVirtualButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleVirtualButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
		}, 1000);
		return;
	}
	var ci = $(".singleVirtualContestIdInput").val();
	if(!queryNumber.test(ci)){
		$(".singleVirtualButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorContestIdError">${languageOption.error.errorContestIdError}</span>`);
		$(".singleVirtualButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleVirtualButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleVirtualButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
		}, 1000);
		return;
	}
	var q1 = $(".singleVirtualTimeInput").val();
	if(q1 == "auto"){
		verifySingleInformation(1, un, ci, q1);
		return;
	}
	q1 = queryTime.exec(q1);
	if(q1 == null){
		$(".singleVirtualButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorTimeFormatError">${languageOption.error.errorTimeFormatError}</span>`);
		$(".singleVirtualButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleVirtualButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleVirtualButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
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
		$(".singleVirtualButton").html(`<i class="fas fa-exclamation-triangle"></i><span info="errorTimeFormatError">${languageOption.error.errorTimeFormatError}</span>`);
		$(".singleVirtualButton").removeClass("primaryColor").addClass("dangerColor").attr("disabled", true);
		setTimeout(function(){
			$(".singleVirtualButton").html(`<i class="fas fa-paper-plane"></i><span info="singleContestantButton">${languageOption.general.singleContestantButton}</span>`);
			$(".singleVirtualButton").addClass("primaryColor").removeClass("dangerColor").attr("disabled", false);
		}, 1000);
		return;
	}
	verifySingleInformation(1, un, ci, new Date(q[0], q[1]-1, q[2], q[3], q[4]));
})

var foldSingleRank, foldSingleProblem;
var foldButtonLocker;
$(".singleRankButton").click(function(){
	if(foldButtonLocker)	return;
	foldButtonLocker = true;
	if(foldSingleRank){
		$(".blockManager").css("width", "");
		$(".singleRankButton > i").removeClass("fa-angle-left").addClass("fa-angle-right");
	}
	else{
		$(".singleRankGraphDisplayer").css("width", "calc(100% - 10px)");
		$(".singleProblemDisplayer").css("width", "0px");
		$(".singleRankButton > i").removeClass("fa-angle-right").addClass("fa-angle-left");
	}
	foldSingleRank = !foldSingleRank;
	setTimeout(function(){foldButtonLocker = false;}, 200);
});
$(".singleProblemButton").click(function(){
	if(foldButtonLocker)	return;
	foldButtonLocker = true;
	if(foldSingleProblem){
		$(".blockManager").css("width", "");
		$(".singleProblemButton > i").removeClass("fa-angle-right").addClass("fa-angle-left");
	}
	else{
		$(".singleProblemDisplayer").css("width", "calc(100% - 10px)");
		$(".singleRankGraphDisplayer").css("width", "0px");
		$(".singleProblemButton > i").removeClass("fa-angle-left").addClass("fa-angle-right");
	}
	foldSingleProblem = !foldSingleProblem;
	setTimeout(function(){foldButtonLocker = false;}, 200);
});
$(".singleParticipateTypeContainer > div > div").click(function(){
	$(".singleParticipateTypeContainer > div > .selectButton.selected").removeClass("selected");
	$(this).addClass("selected");
	contestRankChosen = Number($(this).attr("for"));
	flushRankDisplayer();
})
$(".singleProblemlistTypeContainer > div > div").click(function(){
	$(".singleProblemlistTypeContainer > div > .selectButton.selected").removeClass("selected");
	$(this).addClass("selected");
	$(".singleProblemlistDisplayer > div").addClass("closed");
	$(".singleProblemlistDisplayer > div").eq(Number($(this).attr("for"))).removeClass("closed");
})
$(".searchArgumentsItem").click(function(){
	$(this).parent().find(".chosen").removeClass("chosen");
	$(this).addClass("chosen");
})


var timeLoader, ifInObserve;
var singleHeadBackClkd = 0;
function singleButtonMouseUp(){
	 clearInterval(timeLoader);
	 ifInObserve = false;
	 $("body").attr("onmouseup", "");
	 $(".singleHeadBackProgress").removeClass("selected");
	 setTimeout(function(){
		if(!ifInObserve){
			window.onmousemove = function(){}
			$(".singleHeadBackProgress").css("top", -10).css("left", -10);
		}
	}, 300);
}

function reinitSingleButton(){
	if(settings.headBackOption == 0){
		$(".singleHeadBack > span").mousedown(function(e){
			$(".singleHeadBackProgress").addClass("selected");
			timeStart = new Date();
			ifInObserve = true;
			var x = e.clientX;
			var y = e.clientY;
			$(".singleHeadBackProgress").css("top", y).css("left", x);
		 	window.onmousemove = function(evt){
				var x = evt.clientX;
				var y = evt.clientY;
				$(".singleHeadBackProgress").css("top", y).css("left", x);
			}
			timeLoader = setInterval(function(){
				timeEnd = new Date();
				if(timeEnd.getTime() - timeStart.getTime() > 600){
					clearInterval(timeLoader);
					$(".singleContent > div").css("left", "0px");
					$(".singleHeadBackProgress").removeClass("selected");
					$("body").attr("onmouseup", "");
					ifInObserve = false;
					contestEnterInPage = false;
					singleLastTimeUpdate = new Date();
					for(var i=0; i<bigIsComing.length; i++){
						if(bigIsComing[i] != null)	bigIsComing[i].abort();
						bigIsComing[i] = null;
					}
					if(contestRatingChangesHook)	contestRatingChangesHook.abort();
					if(contestNewWinOpened){
						contestNewWinOpened = contestNewWinLoaded = false;
						contestNewWin.close();
						$(".singleOpenSmallWindow").html(`<span info="singleSmallWindow">${languageOption.general.singleSmallWindow}</span> <i class="fas fa-angle-right"></i>`);
					}
					++ singleContestantTimeCountdownTimeCnt;
					setTimeout(function(){
						if(!ifInObserve)	window.onmousemove = function(){}
					}, 300);
				}
			},100);
			$("body").attr("onmouseup", "singleButtonMouseUp()");
		});
		$(".singleHeadBack > span").unbind("click");
	}
	else{
		$(".singleHeadBack > span").click(function(){
			if(settings.headBackOption == 1){
				if(singleHeadBackClkd == 1){
					singleHeadBackClkd = 0;
					$(".singleHeadBack > span").css("font-weight", "normal");
					$(".singleContent > div").css("left", "0px");
					return;
				}
				singleHeadBackClkd = 1;
				$(".singleHeadBack > span").css("font-weight", "bold");
				setTimeout(function(){
					$(".singleHeadBack > span").css("font-weight", "normal");
					singleHeadBackClkd = 0;
				}, 1000);
			}
		})
		$(".singleHeadBack > span").unbind("mousedown");
	}
}
reinitSingleButton();

$(".singleOpenSmallWindow").click(function(){
	if(!RunInNwjs)	return;
	if(contestNewWinOpened && !contestNewWinLoaded)
		return;
	if(!contestNewWinOpened){
		contestNewWinOpened = true;
		nw.Window.open("contest.html",{
		    "title": "Codeforces Contest Helper", 
		    "icon": "favicon.png",
		    "width": 340,
		    "height": 160, 
		    "position": "center",
		    "resizable": false,
		    "fullscreen":false,
		    "show_in_taskbar":false,
		    "show":true, 
		    "kiosk":false,
		    "always_on_top":true,
		    "frame":false,
		    "transparent":true
		}, function(x){
			contestNewWin = x;
			contestNewWin.on("loaded", function(){
				contestNewWinJQ = $(contestNewWin.window.document.body);
				contestNewWinLoaded = true;
				initContestNewWinPage();
			});
		});
		$(".singleOpenSmallWindow").html(`<span info="singleSmallWindowClose">${languageOption.general.singleSmallWindowClose}</span> <i class="fas fa-angle-right"></i>`);
	}
	else{
		contestNewWinOpened = contestNewWinLoaded = false;
		contestNewWin.close();
		$(".singleOpenSmallWindow").html(`<span info="singleSmallWindow">${languageOption.general.singleSmallWindow}</span> <i class="fas fa-angle-right"></i>`);
	}
})
if(RunInNwjs)
	win.on("close", function(){
		this.hide();
		if(contestNewWinOpened){
			contestNewWinOpened = contestNewWinLoaded = false;
			try{contestNewWin.close(true);}
			catch(e){}
		}
		if(problemNewWinOpened){
			problemNewWinOpened = problemNewWinLoaded = false;
			try{problemNewWin.close(true);}
			catch(e){}
		}
		this.close(true);
	})
$(".forceLoadStandings").click(function(){
	var success = [singleContestantSyncHacks, singleContestantSyncStandings],
		error = [function(){}, function(){}],
		un = contestUsername,
		ci = contestContestId,
		Q = 0;
	function loadInfo(u, d, q, id, er){
		singleLoadType = 1;
		reloadSingleMemoryUsed();
		bigIsComing = $.ajax({
			url: generateAuthorizeURL(u, d),
			type: "GET",
			timeout : settings.largeTimeLimit,
			success: function(json){
				singleLoadType = 4;
				reloadSingleMemoryUsed();
				for(var i=0; i<q.length; i++)
					json = json[q[i]];
				success[id](un, ci, json, Q);
			},
			error: function(jqXHR, status, errorThrown){
				if(status == "timeout"){
					//Network Timeout
					singleLoadType = 2;
					reloadSingleMemoryUsed();
					if(er == true){
						success[id](un, ci, undefined, Q);
						return;
					}
					error[id](un, ci);
					return;
				}
				if(jqXHR.readyState != 4){
					//Network Error
					singleLoadType = 3;
					reloadSingleMemoryUsed();
					if(er == true){
						success[id](un, ci, undefined, Q);
						return;
					}
					error[id](un, ci);
					return;
				}
				//Network Error
				singleLoadType = 3;
				reloadSingleMemoryUsed();
				if(er == true){
					success[id](un, ci, undefined, Q);
					return;
				}
				error[id](un, ci);
				reloadOption = true;
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				var q = 0;
				singleLoadType = 1; reloadSingleMemoryUsed();
				xhr.addEventListener('progress', function (e) {
					 singleMemoryUsed += (e.loaded - q);
					 singleLoadType = 1;
					 reloadSingleMemoryUsed();
					 q = e.loaded;
				});
				return xhr;
			}
		});
	}
	Q = ++contestStandingsIndex;
	contestStandingLoader = 0;
	contestStandingLoadTime = new Date();
	loadInfo(settings.codeforcesApiUrl + "/contest.hacks", {contestId: ci}, ["result"], 0, true);
	setTimeout(function(){loadInfo(settings.codeforcesApiUrl + "/contest.standings", {contestId: ci, showUnofficial: settings.openRankPredict == 2}, ["result"], 1, false);}, 500);
})
$(".openProblems").click(function(){
	openContestProblems(contestContestId);
})