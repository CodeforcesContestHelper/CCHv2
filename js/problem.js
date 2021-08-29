// Network management

// Main management
var problemCurrentPageList = [];
var problemFocusOn = 0;
var problemLoadQueue = [];
var problemLoadRunning = 0;

function getProblemIndexes(x){
	var p = x.length - 1;
	while(p >= 0 && !(/[A-Za-z]/.test(x[p])))	--p;
	if(p < 0){
		if(x.length <= 2)	return [-1, -1];
		return [x.substring(0, x.length - 2), x.substring(x.length - 2)];
	}
	var q = p;
	while(q >= 0 && (/[A-Za-z]/.test(x[q])))	--q;
	if(q < 0)	return [-1, -1];
	++q;
	for(var i=0; i<x.length; i++)
		if((x < q || x > p) && !(/0-9/.test(x[i])))
			return [-1, -1];
	return [x.substring(0, q), x.substring(q)];
}
function getRealTimeLimit(x){
	x = x.split(" ");
	if(x[1] == 'minute' || x[1] == 'minutes' || x[1] == 'm')
		return x[0] + 'm';
	if(x[1] == "second" || x[1] == "seconds" || x[1] == 's')
		return x[0] + 's';
	return x[0] + 'ms';
}
function getRealTimeLimitNumber(x){
	x = x.split(" ");
	if(x[1] == 'minute' || x[1] == 'minutes' || x[1] == 'm')
		return Number(x[0]) * 60 * 1000;
	if(x[1] == "second" || x[1] == "seconds" || x[1] == 's')
		return Number(x[0]) * 1000;
	return Number(x[0]);
}
function getRealmemoryLimit(x){
	x = x.split(" ");
	if(x[1] == "megabytes" || x[1] == "megabyte")
		return x[0] + "MB";
	if(x[1] == "gigabytes" || x[1] == "gigabyte")
		return x[0] + "GB";
	return x[0] + "KB";
}
function getRealmemoryLimitNumber(x){
	x = x.split(" ");
	if(x[1] == "megabytes" || x[1] == "megabyte")
		return Number(x[0]);
	if(x[1] == "gigabytes" || x[1] == "gigabyte")
		return Number(x[0]) * 1024;
	return Number(x[0]) / 1024;
}
function getRealInputFile(x){
	if(x == "standard input")
		return "stdin";
	return x;
}
function getRealOutputFile(x){
	if(x == "standard output")
		return "stdout";
	return x;
}
function getInputFileType(x){
	if(x == "stdin")
		return {type: x};
	return {type: "file", fileName: x};
}
function getOutputFileType(x){
	if(x == "stdout")
		return {type: x};
	return {type: "file", fileName: x};
}
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
		problemNewWinJQ.find(".watchDisplayer").append(p);
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
			url: settings.mainURL + '/contest/' + getProblemIndexes(idx)[0] + '/submission/' + id,
			success: function(data){
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
				|| lastJudgement == "In queue")
					setTimeout(loadWatchType, 1000);
			},
			error: function(){
				setTimeout(loadWatchType, 1000);
			}
		})
	}
	setTimeout(function(){loadWatchType()}, 200);
}
function initProblemPageInfo(page, data, id){
	page.html("");
	page.append(`<div class="problemTitle">${data.find(".title").html()}</div>`);
	problemCurrentPageList[id][4].title = data.find(".title").html();
	var tg = $(`<div class="problemTags"></div>`);
	if(data.find(".time-limit").length != 0)
		tg.append(`<div class='problemTag primaryColor'><i class='fas fa-clock'></i>${getRealTimeLimit(data.find(".time-limit").contents().eq(1).text())}</div>`),
		problemCurrentPageList[id][4].timelimit = getRealTimeLimitNumber(data.find(".time-limit").contents().eq(1).text())
	if(data.find(".memory-limit").length != 0)
		tg.append(`<div class='problemTag warningColor'><i class='fas fa-microchip'></i>${getRealmemoryLimit(data.find(".memory-limit").contents().eq(1).text())}</div>`),
		problemCurrentPageList[id][4].memoryLimit = getRealmemoryLimitNumber(data.find(".memory-limit").contents().eq(1).text())
	if(data.find(".input-file").length != 0)
		tg.append(`<div class='problemTag successColor'><i class='fas fa-sign-in-alt'></i>${getRealInputFile(data.find(".input-file").contents().eq(1).text())}</div>`),
		problemCurrentPageList[id][4].input = getInputFileType(getRealInputFile(data.find(".input-file").contents().eq(1).text()));
	if(data.find(".output-file").length != 0)
		tg.append(`<div class='problemTag dangerColor'><i class='fas fa-sign-out-alt'></i>${getRealOutputFile(data.find(".output-file").contents().eq(1).text())}</div>`),
		problemCurrentPageList[id][4].output = getOutputFileType(getRealOutputFile(data.find(".output-file").contents().eq(1).text()));
	page.append(tg);
	var qq = data.children();
	console.log(qq);
	for(var i=0; i<qq.length; i++){
		if(qq.eq(i).attr("class") != "header" && qq.eq(i).attr("class") != "sample-tests"){
			var l = "Description";
			if(qq.eq(i).find(".section-title").length != 0){
				l = qq.eq(i).find(".section-title").html();
				qq.eq(i).find(".section-title").remove();
			}
			var rnd = "";
			var str = "0123456789qwertyuiopasdfghjklzxcvbnm";
			for(var j=0; j<18; j++)
				rnd += str[Math.floor(Math.random()*str.length)];
			page.append(`<div class="blockManager"><div class="blockManagerTitle">${l}</div><div class="blockManagerContent" id="${rnd}">${qq.eq(i).html().replace(/\$\$\$/g, "$")}</div></div>`);
			renderMathInElement(problemNewWin.window.document.getElementById(rnd), katex_config);
			problemNewWinJQ.find("#"+rnd).find("a").click(function(){
				event.stopPropagation();
				openURL($(this).attr("href"));
				return false;
			})
			problemNewWinJQ.find("#"+rnd).find(".spoiler").each(function(){
				var tit = $(this).find(".spoiler-title").html();
				var con = $(this).find('.spoiler-content').html();
				$(this).html(`<span class='fas fa-question'></span>` + tit + `<br/>` + `<span class='fas fa-exclamation'></span>` + con);
			})
		}
		else if(qq.eq(i).attr("class") == "sample-tests"){
			var inp = [], oup = [];
			qq.eq(i).find(".input pre").each(function(){inp.push($(this).text());});
			qq.eq(i).find(".output pre").each(function(){oup.push($(this).text());});
			console.log(inp, oup);
			problemCurrentPageList[id][3] = [inp, oup];
			var rnd = "";
			var str = "0123456789qwertyuiopasdfghjklzxcvbnm";
			for(var j=0; j<18; j++)
				rnd += str[Math.floor(Math.random()*str.length)];
			var o = $(`<div class="blockManagerContent" id="${rnd}"></div>`);
			for(var j=0; j<inp.length; j++){
				var pp = $(`<div class="sampleBlock">
							<div>
								<div style="width: calc(100% - 10px); position: relative; margin: 5px">
									<span style="font-weight: bold; font-size: 16px"><span info='input'>${languageOption.general.input}</span></span>
									<span class='copyCode' style="float: right"><span info='copy'>${languageOption.general.copy}</span></span>
								</div>
								<div style="flex: 1"><div class="codeDisplayer"></div></div>
							</div>
							<div>
								<div style="width: calc(100% - 10px); position: relative; margin: 5px">
									<span style="font-weight: bold; font-size: 16px"><span info='output'>${languageOption.general.output}</span></span>
									<span class='copyCode' style="float: right"><span info='copy'>${languageOption.general.copy}</span></span>
								</div>
								<div style="flex: 1"><div class="codeDisplayer"></div></div>
							</div>
						</div>`);
				pp.find(".codeDisplayer").eq(0).text(inp[j]);
				pp.find(".codeDisplayer").eq(1).text(oup[j]);
				console.log(inp[j], oup[j]);
				o.append(pp);
			}
			var oo = $(`<div class="blockManager"><div class="blockManagerTitle">Samples</div></div>`);
			oo.append(o);
			page.append(oo);
		}
		problemNewWinJQ.append(`<script>loadCopyOption()</script>`)
	}
}
function loadProblem(x){
	if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
	var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
	problemNewWinJQ.find(".innerContent > div").eq(p).html(`<div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div>`)
	problemCurrentPageList[p][2] = 1;
	problemNewWinJQ.find(".sideBarItem").eq(p).html(`<i class="fas ${loadType[problemCurrentPageList[p][2]]}"></i>${problemCurrentPageList[p][0]}<div><i class="fas fa-times closeCurrentProblemPage" id=${problemCurrentPageList[p][0]}></i></div>`);
	problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Number($(this).attr("id"));
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
	})
	problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
		event.stopPropagation();
		killProblemListItem($(this).attr("id"));
		flushProblemNewWin();
	})
	problemCurrentPageList[p][1] = $.ajax({
		url: settings.mainURL + '/contest/' + getProblemIndexes(x)[0] + '/problem/' + getProblemIndexes(x)[1] + '?locale=en',
		success: function(data){
			if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
			var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
			problemCurrentPageList[p][4].contestName = $(data).find("#sidebar").eq(0).find("a").eq(0).html();
			initProblemPageInfo(problemNewWinJQ.find(".innerContent > div").eq(p), $(data).find(".ttypography > .problem-statement"), p);
			problemCurrentPageList[p][2] = 0;
			problemNewWinJQ.find(".sideBarItem").eq(p).html(`<i class="fas ${loadType[problemCurrentPageList[p][2]]}"></i>${problemCurrentPageList[p][0]}<div><i class="fas fa-times closeCurrentProblemPage" id=${problemCurrentPageList[p][0]}></i>`);
			problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
				problemFocusOn = Number($(this).attr("id"));
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
				problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
				problemNewWinJQ.find(".innerContent > div").css("display", "none");
				problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
			})
			problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
				event.stopPropagation();
				killProblemListItem($(this).attr("id"));
				flushProblemNewWin();
			})
		},
		error: function(){
			if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
			var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
			problemCurrentPageList[p][2] = 3;
			problemNewWinJQ.find(".sideBarItem").eq(p).html(`<i class="fas ${loadType[problemCurrentPageList[p][2]]}"></i>${problemCurrentPageList[p][0]}<div><i class="fas fa-times closeCurrentProblemPage" id=${problemCurrentPageList[p][0]}></i></div></div>`);
			problemNewWinJQ.find(".innerContent > div").eq(p).html(`<div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-unlink red"></i></div>`);
			problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
				problemFocusOn = Number($(this).attr("id"));
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
				problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
				problemNewWinJQ.find(".innerContent > div").css("display", "none");
				problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
			})
			problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
				event.stopPropagation();
				killProblemListItem($(this).attr("id"));
				flushProblemNewWin();
			})
			setTimeout(function(){loadProblem(x)}, 10000);
		},
		xhr: function() {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('progress', function (e) {
				if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
				var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
				problemCurrentPageList[p][2] = 2;
				problemNewWinJQ.find(".sideBarItem").eq(p).html(`<i class="fas ${loadType[problemCurrentPageList[p][2]]}"></i>${problemCurrentPageList[p][0]}<div><i class="fas fa-times closeCurrentProblemPage" id=${problemCurrentPageList[p][0]}></i></div></div>`);
				problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
					problemFocusOn = Number($(this).attr("id"));
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
					problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
					problemNewWinJQ.find(".innerContent > div").css("display", "none");
					problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
				})
				problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
					event.stopPropagation();
					killProblemListItem($(this).attr("id"));
					flushProblemNewWin();
				})
			});
			return xhr;
		},
	});
}
function reloadProblem(x){
	if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
	var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
	if(problemCurrentPageList[p][2] == 2)
		problemCurrentPageList[p][1].abort();
	problemCurrentPageList[p][2] = 0;
	loadProblem(x);
}
function addProblems(x){
	for(var i=0; i<x.length; i++){
		if(getProblemIndexes(x[i])[0] == -1)	continue;
		if(problemCurrentPageList.find(function(q){return q[0] == x[i]}) != undefined)	continue;
		problemCurrentPageList.push([x[i], null, 1, [[], []], {}]);
		problemNewWinJQ.find(".innerContent").append(`<div class="innerContentPage" style="display: none"><div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div></div>`)
		loadProblem(x[i]);
		flushProblemNewWin();
	}
}
function killProblemListItem(x){
	if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
	x = problemCurrentPageList.findIndex(function(q){return q[0] == x});
	x = Number(x);
	problemNewWinJQ.find(".innerContent > div").eq(x).remove();
	console.log(x);
	if(problemCurrentPageList[x][1] != null)
		problemCurrentPageList[x][1].abort();
	if(problemCurrentPageList.length - 1 == x)
		problemCurrentPageList.pop();
	else
		problemCurrentPageList.splice(x, 1);
	if(problemFocusOn >= x)	--problemFocusOn;
	if(problemFocusOn < 0)	problemFocusOn = 0;
}
var loadType = ["fa-circle", "fa-hourglass-half", "fa-spin fa-sync-alt", "fa-unlink red"];
function flushProblemNewWin(){
	if(problemCurrentPageList.length == 0)
		problemNewWinJQ.find(".problemPageRightContent").css("display", "none");
	else
		problemNewWinJQ.find(".problemPageRightContent").css("display", "flex");
	problemNewWinJQ.find(".sideBar > div").html("");
	for(var i=0; i<problemCurrentPageList.length; i++)
		problemNewWinJQ.find(".sideBar > div").append(`<div class="sideBarItem" id="${i}"><i class="fas ${loadType[problemCurrentPageList[i][2]]}"></i>${problemCurrentPageList[i][0]}<div><i class="fas fa-times closeCurrentProblemPage"id=${problemCurrentPageList[i][0]}></i></div></div>`);
	if(problemFocusOn < problemCurrentPageList.length && problemFocusOn >= 0)
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen"),
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
	problemNewWinJQ.find(".innerContent > div").css("display", "none");
	problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
	problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Number($(this).attr("id"));
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
	})
	problemNewWinJQ.find(".prevProblem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Math.max(problemFocusOn - 1, 0);
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
	})
	problemNewWinJQ.find(".nextProblem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Math.min(problemFocusOn + 1, problemCurrentPageList.length - 1);
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(".innerContent > div").eq(problemFocusOn).css("display", "block");
	})
	problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
		event.stopPropagation();
		killProblemListItem($(this).attr("id"));
		flushProblemNewWin();
	})
}
function sampleWrapper(x, y){
	var ret = [];
	for(var i=0; i<x.length; i++)
		ret.push({"input": x[i], "output": y[i]});
	return ret;
}
function initProblemNewWin(){
	problemNewWinJQ.find(".ToolListTitle").html("Codeforces Problems");
	if(currentLoginHandle == ""){
		problemNewWinJQ.find(".submitCode").css("display", "none");
		if(problemNewWinJQ.find(".submitWindow").css("opacity") != 0){
			problemNewWinJQ.find(".submitWindow").css("opacity", "0");
			setTimeout(function(){
				problemNewWinJQ.find(".submitWindow").css("display", "none");
			}, 500);
		}
	}
	else
		problemNewWinJQ.find(".submitCode").css("display", "inline");
	problemNewWinJQ.find(".reloadStatement").unbind("click").click(function(){
		reloadProblem(problemCurrentPageList[problemFocusOn][0]);
	});
	problemNewWinJQ.find(".submitCode").unbind("click").click(function(){
		problemNewWinJQ.find(".submitWindow").css("display", "grid");
		problemNewWinJQ.find(".submitWindow").css("opacity", "1");
		submitCodeAreaController.refresh();
		problemNewWinJQ.find(".submitUsername").html(currentLoginHandle);
		problemNewWinJQ.find(".submitProblemID").html(problemCurrentPageList[problemFocusOn][0]);
	})
	problemNewWinJQ.find(".sendCurrData").unbind("click").click(function(){
		if(problemCurrentPageList.length <= problemFocusOn
		|| problemCurrentPageList[problemFocusOn][2] != 0)	return;
		console.log("Posting...");
		var CompetitiveCompanionPort = settings.transformPort.split(',');
		for(var pr in CompetitiveCompanionPort)
			$.ajax({
				url: 'http://localhost:' + $.trim(CompetitiveCompanionPort[pr]) + '/',
				type: "POST",
				dataType: 'JSON',
				contentType: 'application/json',
				data: JSON.stringify({
					"name": problemCurrentPageList[problemFocusOn][4].title,
				    "group": problemCurrentPageList[problemFocusOn][4].contestName,
				    "url": `https://codeforces.com/contest/${getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[0]}/problem/${getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[1]}`,
				    "interactive": false,
				    "memoryLimit": problemCurrentPageList[problemFocusOn][4].memoryLimit,
				    "timeLimit": problemCurrentPageList[problemFocusOn][4].timelimit,
				    "tests": sampleWrapper(problemCurrentPageList[problemFocusOn][3][0], problemCurrentPageList[problemFocusOn][3][1]),
				    "input": problemCurrentPageList[problemFocusOn][4].input,
				    "output": problemCurrentPageList[problemFocusOn][4].output,
				})
			})
	})
	problemNewWinJQ.find(".sendAllData").unbind("click").click(function(){
		console.log("Posting...");
		var curr = 0;
		var CompetitiveCompanionPort = settings.transformPort.split(',');
		function sender(pp, prr, cc){
			setTimeout(function(){
				$.ajax({
					url: 'http://localhost:' + $.trim(CompetitiveCompanionPort[prr]) + '/',
					type: "POST",
					dataType: 'JSON',
					contentType: 'application/json',
					data: pp
				})
			}, cc);
		}
		for(var i=0; i<problemCurrentPageList.length; i++){
			if(problemCurrentPageList[i][2] != 0)	continue;
			console.log(i);
			var info = JSON.stringify({
							"name": problemCurrentPageList[i][4].title,
						    "group": problemCurrentPageList[i][4].contestName,
						    "url": `https://codeforces.com/contest/${getProblemIndexes(problemCurrentPageList[i][0])[0]}/problem/${getProblemIndexes(problemCurrentPageList[i][0])[1]}`,
						    "interactive": false,
						    "memoryLimit": problemCurrentPageList[i][4].memoryLimit,
						    "timeLimit": problemCurrentPageList[i][4].timelimit,
						    "tests": sampleWrapper(problemCurrentPageList[i][3][0], problemCurrentPageList[i][3][1]),
						    "input": problemCurrentPageList[i][4].input,
						    "output": problemCurrentPageList[i][4].output,
						});
			for(var pr in CompetitiveCompanionPort)
				sender(info, pr, curr * 1000);
			++curr;
		}
	})
	problemNewWinJQ.find(".submitButton > button").click(function(){
		problemNewWinJQ.find(".submitButton > button").html("<i class='fas fa-spin fa-spinner'></i>");
		problemNewWinJQ.find(".submitButton > button").attr("disabled", "true");
		submitSolution(getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[0]
					 , getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[1]
					 , submitCodeAreaController.getValue()
					 , problemNewWinJQ.find(".submitLanguageChoser").val()
					 , function(id){
					 	problemNewWinJQ.find(".submitButton > button").removeClass("primaryColor").addClass("successColor");
					 	problemNewWinJQ.find(".submitButton > button").html(`<span info="submitSuccess">${languageOption.general.submitSuccess}</span>`);
					 	setTimeout(function(){
					 		problemNewWinJQ.find(".submitButton > button").addClass("primaryColor").removeClass("successColor");
					 		problemNewWinJQ.find(".submitButton > button").html(`<i class="fas fa-paper-plane"></i><span info="sendAnswer">${languageOption.general.sendAnswer}</span>`);
					 		problemNewWinJQ.find(".submitButton > button").removeAttr("disabled");
					 		problemNewWinJQ.find(".closeSubmitPage").click();
					 	}, 1000);
					 	addWatcher(id, problemCurrentPageList[problemFocusOn][0]);
					 }
					 , function(x, y){
					 	problemNewWinJQ.find(".submitButton > button").removeClass("primaryColor").addClass("dangerColor");
					 	problemNewWinJQ.find(".submitButton > button").html(`<span info="${x}">${y}</span>`);
					 	setTimeout(function(){
					 		problemNewWinJQ.find(".submitButton > button").addClass("primaryColor").removeClass("dangerColor");
					 		problemNewWinJQ.find(".submitButton > button").html(`<i class="fas fa-paper-plane"></i><span info="sendAnswer">${languageOption.general.sendAnswer}</span>`);
					 		problemNewWinJQ.find(".submitButton > button").removeAttr("disabled");
					 	}, 1000)
					 })
	})
}
function openProblemWin(xx){
	if(!RunInNwjs)	return;
	if(problemNewWinOpened){
		addProblems(xx);
		return;
	}
	problemNewWinOpened = true;
	nw.Window.open("problem.html",{
	    "title": "Codeforces Problems", 
	    "icon": "favicon.png",
	    "width": 600,
	    "height": 420, 
	    "position": "center",
	    "resizable": true,
	    "min_width": 500,
	    "min_height": 420,
	    "fullscreen":false,
	    "show_in_taskbar":true,
	    "show":true, 
	    "kiosk":false,
	    "always_on_top":false,
	    "frame":false,
	    "transparent":true,
	}, function(x){
		problemNewWin = x;
		problemNewWin.on("loaded", function(){
			problemNewWinJQ = $(problemNewWin.window.document.body);
			initProblemNewWin();
			problemCurrentPageList = [];
			problemFocusOn = 0;
			problemLoadQueue = [];
			problemLoadRunning = 0;
			// problemNewWin.showDevTools();
			addProblems(xx);
			problemNewWinLoaded = true;
			submitCodeAreaController = CodeMirror.fromTextArea(problemNewWin.window.document.getElementById("submitCodeArea"), {
				mode: "null",
				lineNumbers: true,
				theme: DarkMode ? "dracula" : "eclipse",
				indentUnit: 4,
				indentWithTabs: true,
				smartIndent: true,
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers"],
				matchBrackets: true
			});
			submitCodeAreaController.setSize("400px", "190px");
			flushProblemNewWin();
		})
		problemNewWin.on("closed", function(){
			problemNewWinOpened = false;
			problemNewWinLoaded = false;
			for(var i=0; i<problemCurrentPageList.length; i++)
				if(problemCurrentPageList[i][1] != null)
					problemCurrentPageList[i][1].abort();
		})
	});
}