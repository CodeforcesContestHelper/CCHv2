// Network management

// Main management
var problemCurrentPageList = [];
var problemFocusOn = 0;
var problemLoadQueue = [];
var problemLoadRunning = 0;
var problemLoadID = 0;
var problemGroupRange = {};

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
function initProblemPageInfo(page, data, id){
	page.html("");
	page.append(`<div class="problemTitle">${data.find(".title").html()}</div>`);
	problemCurrentPageList[id][4].title = data.find(".title").html();
	page.append(`<div class="problemOrigin">${localize("origin")} → ${problemCurrentPageList[id][4].contestName}</div>`)
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
			var pqp = $(`<div class="blockManager"><div class="blockManagerTitle">${l}<span class='copyInfo'><span info='copyInfo'>${languageOption.general.copyInfo}</span></span></div><div class="blockManagerContent" id="${rnd}">${qq.eq(i).html().replace(/\$\$\$/g, "$")}</div></div>`);
			pqp.attr("statement-info", $('<div>' + qq.eq(i).html().replace(/\$\$\$/g, "$") + "</div>").text());
			page.append(pqp);
			renderMathInElement(problemNewWin.window.document.getElementById(rnd), katex_config);
			problemNewWinJQ.find("#"+rnd).find("a").click(function(){
				event.stopPropagation();
				openURL($(this).attr("href"));
				return false;
			})
			problemNewWinJQ.find("#"+rnd).find(".spoiler").each(function(){
				var tit = $(this).find(".spoiler-title").html();
				var con = $(this).find('.spoiler-content').html();
				$(this).html(`<details><summary>` + tit + `</summary>` + con + '</details>');
			})
		}
		else if(qq.eq(i).attr("class") == "sample-tests"){
			var inp = [], oup = [];
			qq.eq(i).find(".input pre").each(function(){inp.push($(this).html().replace(/<br>/g, '\n'));});
			qq.eq(i).find(".output pre").each(function(){oup.push($(this).html().replace(/<br>/g, '\n'));});
			for(var O=0; O<inp.length; O++){
				inp[O] = $(`<span>${inp[O]}</span>`).text();
				oup[O] = $(`<span>${oup[O]}</span>`).text();
			}
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
									<span style="font-weight: bold; font-size: 100% - 2px"><span info='input'>${languageOption.general.input}</span></span>
									<span class='copyCode' style="float: right"><span info='copy'>${languageOption.general.copy}</span></span>
								</div>
								<div style="flex: 1"><div class="codeDisplayer"></div></div>
							</div>
							<div>
								<div style="width: calc(100% - 10px); position: relative; margin: 5px">
									<span style="font-weight: bold; font-size: 100%"><span info='output'>${languageOption.general.output}</span></span>
									<span class='copyCode' style="float: right"><span info='copy'>${languageOption.general.copy}</span></span>
								</div>
								<div style="flex: 1"><div class="codeDisplayer"></div></div>
							</div>
						</div>`);
				pp.find(".codeDisplayer").eq(0).text(inp[j]);
				pp.find(".codeDisplayer").eq(1).text(oup[j]);
				o.append(pp);
			}
			var oo = $(`<div class="blockManager"><div class="blockManagerTitle">Samples</div></div>`);
			oo.append(o);
			page.append(oo);
		}
		problemNewWinJQ.append(`<script>loadCopyOption()</script>`)
	}
}
function loadProblem(x, info){
	if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
	var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
	problemNewWinJQ.find(`.innerContent > [problem-id=${x}]`).html(`<div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div>`)
	problemCurrentPageList[p][2] = 1;
	problemNewWinJQ.find(".sideBarItem").eq(p).html(`${loadType[problemCurrentPageList[p][2]](x)}${problemCurrentPageList[p][0]}<div class="closeCurrentProblemPage" id=${p}><i class="fas fa-times"></i></div>`);
	problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Number($(this).attr("id"));
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
	})
	problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
		event.stopPropagation();
		killProblemListItem($(this).attr("id"));
		flushProblemNewWin();
	})
	if(info != undefined){
		problemCurrentPageList[p][2] = 0;
		problemCurrentPageList[p][4].contestName = $(info).find(".caption").html();
		initProblemPageInfo(problemNewWinJQ.find(`.innerContent > [problem-id=${x}]`), $(info).find(`.problemindexholder[problemindex=${getProblemIndexes(x)[1]}] .problem-statement`), p);
		return;
	}
	problemCurrentPageList[p][1] = $.ajax({
		url: settings.mainURL + `/${getProblemIndexes(x)[0] >= 100000 ? "gym" : "contest"}/` + getProblemIndexes(x)[0] + '/problem/' + getProblemIndexes(x)[1] + '?locale=en',
		success: function(data){
			if(data.indexOf(`data-entityId="${getProblemIndexes(x)[0]}"`) == -1){
				if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
				var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
				problemCurrentPageList[p][2] = 3;
				problemNewWinJQ.find(".sideBarItem").eq(p).html(`${loadType[problemCurrentPageList[p][2]](x)}${problemCurrentPageList[p][0]}<div class="closeCurrentProblemPage" id=${p}><i class="fas fa-times"></i></div>`);
				problemNewWinJQ.find(`.innerContent > [problem-id=${x}]`).html(`<div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-unlink red fa-3x"></i></div>`);
				problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
					problemFocusOn = Number($(this).attr("id"));
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
					problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
					problemNewWinJQ.find(".innerContent > div").css("display", "none");
					problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
				})
				problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
					event.stopPropagation();
					killProblemListItem($(this).attr("id"));
					flushProblemNewWin();
				})
				return;
			}
			if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
			var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
			problemCurrentPageList[p][4].contestName = $(data).find("#sidebar").eq(0).find("a").eq(0).html();
			initProblemPageInfo(problemNewWinJQ.find(`.innerContent > [problem-id=${x}]`), $(data).find(".ttypography > .problem-statement"), p);
			problemCurrentPageList[p][2] = 0;
			problemNewWinJQ.find(".sideBarItem").eq(p).html(`${loadType[problemCurrentPageList[p][2]](x)}${problemCurrentPageList[p][0]}<div class="closeCurrentProblemPage" id=${p}><i class="fas fa-times"></i></div>`);
			problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
				problemFocusOn = Number($(this).attr("id"));
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
				problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
				problemNewWinJQ.find(".innerContent > div").css("display", "none");
				problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
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
			problemNewWinJQ.find(".sideBarItem").eq(p).html(`${loadType[problemCurrentPageList[p][2]](x)}${problemCurrentPageList[p][0]}<div class="closeCurrentProblemPage" id=${p}><i class="fas fa-times"></i></div>`);
			problemNewWinJQ.find(`.innerContent > [problem-id=${x}]`).html(`<div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-unlink red fa-3x"></i></div>`);
			problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
				problemFocusOn = Number($(this).attr("id"));
				problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
				problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
				problemNewWinJQ.find(".innerContent > div").css("display", "none");
				problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
			})
			problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
				event.stopPropagation();
				killProblemListItem($(this).attr("id"));
				flushProblemNewWin();
			})
		},
		xhr: function() {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('progress', function (e) {
				if(problemCurrentPageList.find(function(q){return q[0] == x}) == undefined)	return;
				var p = problemCurrentPageList.findIndex(function(q){return q[0] == x});
				problemCurrentPageList[p][2] = 2;
				problemNewWinJQ.find(".sideBarItem").eq(p).html(`${loadType[problemCurrentPageList[p][2]](x)}${problemCurrentPageList[p][0]}<div class="closeCurrentProblemPage" id=${p}><i class="fas fa-times"></i></div>`);
				problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
					problemFocusOn = Number($(this).attr("id"));
					problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
					problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
					problemNewWinJQ.find(".innerContent > div").css("display", "none");
					problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
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
	if(problemCurrentPageList[p][2] == 1 || problemCurrentPageList[p][2] == 2)
		problemCurrentPageList[p][1].abort();
	problemCurrentPageList[p][2] = 0;
	loadProblem(x);
}
function addProblems(x, gid, info){
	if(gid == undefined){
		for(var i=0; i<x.length; i++){
			if(getProblemIndexes(x[i])[0] == -1)	continue;
			if(problemCurrentPageList.find(function(q){return q[0] == x[i]}) != undefined)	continue;
			problemFocusOn = problemCurrentPageList.length;
			problemCurrentPageList.push([x[i], null, 1, [[], []], {}]);
			problemNewWinJQ.find(".innerContent").append(`<div class="innerContentPage" problem-id="${x[i]}" style="display: none"><div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div></div>`)
			loadProblem(x[i], info);
		}
		flushProblemNewWin();
	}
	else if(problemGroupRange[gid] == undefined){
		var dL = [];
		for(var i=0; i<problemCurrentPageList.length; i++)
			if(getProblemIndexes(problemCurrentPageList[i][0])[0] == gid)
				dL.push(i);
		while(dL.length != 0)
			killProblemListItem(dL.pop());
		problemGroupRange[gid] = [problemCurrentPageList.length, x.length, true];
		problemFocusOn = problemGroupRange[gid][0];
		for(var i=0; i<x.length; i++){
			problemCurrentPageList.push([x[i], null, 1, [[], []], {}]);
			problemNewWinJQ.find(".innerContent").append(`<div class="innerContentPage" problem-id="${x[i]}" style="display: none"><div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div></div>`)
			loadProblem(x[i], info);
		}
		flushProblemNewWin();
	}
	else{
		problemCurrentPageList.splice(problemGroupRange[gid][0], problemGroupRange[gid][1]);
		var delta = x.length - problemGroupRange[gid][1];
		for(var t in problemGroupRange)
			if(problemGroupRange.hasOwnProperty(t))
				if(problemGroupRange[t][0] > problemGroupRange[gid][0])
					problemGroupRange[t][0] += delta;
		problemGroupRange[gid] = [problemGroupRange[gid][0], x.length, true];
		problemFocusOn = problemGroupRange[gid][0];
		for(var i=0; i<x.length; i++){
			problemCurrentPageList.splice(problemGroupRange[gid][0] + i, 0, [x[i], null, 1, [[], []], {}]);
			problemNewWinJQ.find(`.innerContent > [problem-id=${x[i]}]`).remove();
			problemNewWinJQ.find(".innerContent").append(`<div class="innerContentPage" problem-id="${x[i]}" style="display: none"><div style="display: grid; place-items: center; width: 100%; height: 100%"><i class="fas fa-sync-alt fa-spin fa-3x"></i></div></div>`)
			loadProblem(x[i], info);
		}
		flushProblemNewWin();
	}
}
function killProblemListItem(x){
	x = Number(x);
	var q = getProblemIndexes(problemCurrentPageList[x][0])[0];
	problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[x][0]}]`).remove();
	if(problemCurrentPageList[x][1] != null)
		problemCurrentPageList[x][1].abort();
	if(problemCurrentPageList.length - 1 == x)
		problemCurrentPageList.pop();
	else
		problemCurrentPageList.splice(x, 1);
	if(problemFocusOn >= x)	--problemFocusOn;
	if(problemFocusOn < 0)	problemFocusOn = 0;
	for(var t in problemGroupRange)
		if(problemGroupRange.hasOwnProperty(t))
			if(problemGroupRange[t][0] > x)
				problemGroupRange[t][0] --;
	if(problemGroupRange[q] != undefined){
		var u = problemGroupRange[q];
		if(u[0] <= x && u[0] + u[1] >= x){
			-- problemGroupRange[q][1];
			if(problemGroupRange[q][1] == 0)
				delete problemGroupRange[q];
		}
	}
}
var loadTypes = ["fa-circle", "fa-hourglass-half", "fa-spin fa-sync-alt", "fa-unlink red"];
var loadType = [
function(x){ return `<span>${getProblemIndexes(x)[1]}</span>` }
, function(){ return `<i class="fas ${loadTypes[1]}"></i>`; }
, function(){ return `<i class="fas ${loadTypes[2]}"></i>`; }
, function(){ return `<i class="fas ${loadTypes[3]}"></i>`; }
];

function loadContestProblemset(cid, chk, S, E){
	if(! /^\d+$/.test(cid)){
		E(); return;
	}
	cid = Number(cid);
	if(!chk)
		$.ajax({
			url: settings.mainURL + `/${cid >= 100000 ? "gym" : "contest"}/` + cid + '/problems',
			success: function(data){
				if(data.indexOf(`class="problem-statement"`) == -1){
					E(); return;
				}
				var q = $(data);
				var ret = [];
				q.find(".problemindexholder").each(function(){
					ret.push(String(cid) + $.trim($(this).attr("problemindex")));
				})
				S(ret, data);
			},
			error: function(){
				E();
			}
		})
	else
		$.ajax({
			url: settings.mainURL + `/${cid >= 100000 ? "gym" : "contest"}/` + cid + '/',
			success: function(data){
				q = $(data).find("#sidebar").find(".rtable").find("a").attr("href");
				if(q != `/${cid >= 100000 ? "gym" : "contest"}/${cid}`){
					E(); return;
				}
				$.ajax({
					url: settings.mainURL + `/${cid >= 100000 ? "gym" : "contest"}/` + cid + '/problems',
					success: function(data){
						if(data.indexOf(`class="problem-statement"`) == -1){
							E(); return;
						}
						var q = $(data);
						var ret = [];
						q.find(".problemindexholder").each(function(){
							ret.push(String(cid) + $.trim($(this).attr("problemindex")));
						})
						S(ret, data);
					},
					error: function(){
						E();
					}
				})
			},
			error: function(){
				E();
			}
		})
}

function flushProblemNewWin(){
	if(problemCurrentPageList.length == 0)
		problemNewWinJQ.find(".innerContent").css("display", "none"),
		problemNewWinJQ.find(".progressBar").css("display", "none");
	else
		problemNewWinJQ.find(".innerContent").css("display", "block"),
		problemNewWinJQ.find(".progressBar").css("display", "flex");
	problemNewWinJQ.find(".sideBar > div").html("");
	var lastContestFolder = false;
	for(var i=0; i<problemCurrentPageList.length; i++){
		var cid = getProblemIndexes(problemCurrentPageList[i][0])[0];
		if(problemGroupRange[cid] != undefined && problemGroupRange[cid][0] == i){
			var curr = $("<div class='sideBarGroupContents'></div>");
			if(problemGroupRange[cid][2])
				curr.css("padding-bottom", "10px");
			if(lastContestFolder)
				curr.css("margin-top", "10px");
			var T = $(`<div class="sideBarGroup" id="${cid}">${problemGroupRange[cid][2] ? "<i class='fas fa-folder-open'></i>" : "<i class='fas fa-folder'></i>"}${cid}<div class="closeCurrentGroup" id=${cid}><i class="fas fa-times"></i></div></div>`)
			curr.append(T);
			for(var j=0; j<problemGroupRange[cid][1]; j++, i++){
				curr.append(`<div class="sideBarItem" id="${i}" ${problemGroupRange[cid][2] ? "" : " style='display: none'"}>${loadType[problemCurrentPageList[i][2]](problemCurrentPageList[i][0])}${problemCurrentPageList[i][0]}<div class="closeCurrentProblemPage" id=${i}><i class="fas fa-times"></i></div></div>`);
			}
			--i;
			lastContestFolder = true;
			problemNewWinJQ.find(".sideBar > div").append(curr);
			continue;
		}
		lastContestFolder = false;
		problemNewWinJQ.find(".sideBar > div").append(`<div class="sideBarItem" id="${i}">${loadType[problemCurrentPageList[i][2]](problemCurrentPageList[i][0])}${problemCurrentPageList[i][0]}<div class="closeCurrentProblemPage" id=${i}><i class="fas fa-times"></i></div></div>`);
	}
	problemNewWinJQ.find(".sideBar > div").append(`<div class="addProblemSidebar"><i class='fas fa-add'></i><span info='add'>${languageOption.general.add}</span></div>`);
	if(problemFocusOn < problemCurrentPageList.length && problemFocusOn >= 0)
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen"),
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
	problemNewWinJQ.find(".innerContent > div").css("display", "none");
	if(problemFocusOn < problemCurrentPageList.length)
		problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
	problemNewWinJQ.find(".sideBarGroup").unbind("click").click(function(){
		r = Number($(this).attr("id"));
		problemGroupRange[r][2] ^= 1;
		flushProblemNewWin();
	})
	problemNewWinJQ.find(".sideBarItem").unbind("click").click(function(){
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).removeClass("chosen");
		problemFocusOn = Number($(this).attr("id"));
		problemNewWinJQ.find(".sideBarItem").eq(problemFocusOn).addClass("chosen");
		problemNewWinJQ.find(".problemName").html(problemCurrentPageList[problemFocusOn][0]);
		problemNewWinJQ.find(".innerContent > div").css("display", "none");
		problemNewWinJQ.find(`.innerContent > [problem-id=${problemCurrentPageList[problemFocusOn][0]}]`).css("display", "block");
	})
	problemNewWinJQ.find(".closeCurrentProblemPage").unbind("click").click(function(){
		event.stopPropagation();
		killProblemListItem($(this).attr("id"));
		flushProblemNewWin();
	})
	problemNewWinJQ.find(".closeCurrentGroup").unbind("click").click(function(){
		event.stopPropagation();
		var cid = Number($(this).attr("id"));
		var T = problemGroupRange[cid][1]
		for(var i=0; i<T; i++)
			killProblemListItem(problemGroupRange[cid][0]);
		delete problemGroupRange[cid];
		flushProblemNewWin();
	})
	problemNewWinJQ.find(".closeAddProblemPage").unbind("click").click(function(){
		problemNewWinJQ.find(".addProblemWindow").css("opacity", "0");
		setTimeout(function(){
			problemNewWinJQ.find(".addProblemWindow").css("display", "none");
		}, 500);
	})
	problemNewWinJQ.find(".addProblemSidebar").unbind("click").click(function(){
		problemNewWinJQ.find(".addProblemWindow").css("display", "grid");
		problemNewWinJQ.find(".problemInfoInputArea input").val("");
		problemNewWinJQ.find(".contestInfoInputArea input").val("");
		setTimeout(function(){ problemNewWinJQ.find(".addProblemWindow").css("opacity", "1"); }, 50);
	})
	problemNewWinJQ.find(".problemInfoInputArea button").unbind('click').click(function(){
		if(typeof($(this).attr("disabled")) != "undefined")
			return;
		problemNewWinJQ.find(".problemInfoInputArea button").attr("disabled", "true");
		problemNewWinJQ.find(".contestInfoInputArea button").attr("disabled", "true");
		problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-sync fa-spin"></i>`);
		problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-sync fa-spin"></i>`);
		var R = problemNewWinJQ.find(".problemInfoInputArea input").val();
		if(getProblemIndexes(R)[0] != -1 && R.length <= 9){
			problemNewWinJQ.find(".problemInfoInputArea button").removeAttr("disabled");
			problemNewWinJQ.find(".contestInfoInputArea button").removeAttr("disabled");
			problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
			problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
			problemNewWinJQ.find(".addProblemWindow").css("opacity", "0");
			setTimeout(function(){
				problemNewWinJQ.find(".addProblemWindow").css("display", "none");
			}, 500);
			addProblems([R]);
		}
		else{
			problemNewWinJQ.find(".problemInfoInputArea button").removeClass("primaryColor").addClass("dangerColor");
			problemNewWinJQ.find(".contestInfoInputArea button").removeClass("primaryColor").addClass("dangerColor");
			problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-exclamation-triangle"></i>`);
			problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-exclamation-triangle"></i>`);
			setTimeout(function(){
				problemNewWinJQ.find(".problemInfoInputArea button").addClass("primaryColor").removeClass("dangerColor");
				problemNewWinJQ.find(".contestInfoInputArea button").addClass("primaryColor").removeClass("dangerColor");
				problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
				problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
				problemNewWinJQ.find(".problemInfoInputArea button").removeAttr("disabled");
				problemNewWinJQ.find(".contestInfoInputArea button").removeAttr("disabled");
			}, 1000)
		}
	})
	problemNewWinJQ.find(".problemInfoInputArea input")
		.bind('keydown',function(event){
	    if(event.keyCode == "13"){
	    	problemNewWinJQ.find(".problemInfoInputArea button").click();
	    }
	});
	problemNewWinJQ.find(".contestInfoInputArea button").unbind('click').click(function(){
		if(typeof($(this).attr("disabled")) != "undefined")
			return;
		problemNewWinJQ.find(".problemInfoInputArea button").attr("disabled", "true");
		problemNewWinJQ.find(".contestInfoInputArea button").attr("disabled", "true");
		problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-sync fa-spin"></i>`);
		problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-sync fa-spin"></i>`);
		var R = problemNewWinJQ.find(".contestInfoInputArea input").val();
		loadContestProblemset(R, true, function(data, info){
			problemNewWinJQ.find(".problemInfoInputArea button").removeAttr("disabled");
			problemNewWinJQ.find(".contestInfoInputArea button").removeAttr("disabled");
			problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
			problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
			problemNewWinJQ.find(".addProblemWindow").css("opacity", "0");
			setTimeout(function(){
				problemNewWinJQ.find(".addProblemWindow").css("display", "none");
			}, 500);
			addProblems(data, R, info);
		}, function(){
			problemNewWinJQ.find(".problemInfoInputArea button").removeClass("primaryColor").addClass("dangerColor");
			problemNewWinJQ.find(".contestInfoInputArea button").removeClass("primaryColor").addClass("dangerColor");
			problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-exclamation-triangle"></i>`);
			problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-exclamation-triangle"></i>`);
			setTimeout(function(){
				problemNewWinJQ.find(".problemInfoInputArea button").addClass("primaryColor").removeClass("dangerColor");
				problemNewWinJQ.find(".contestInfoInputArea button").addClass("primaryColor").removeClass("dangerColor");
				problemNewWinJQ.find(".problemInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
				problemNewWinJQ.find(".contestInfoInputArea button").html(`<i class="fas fa-paper-plane"></i>`);
				problemNewWinJQ.find(".problemInfoInputArea button").removeAttr("disabled");
				problemNewWinJQ.find(".contestInfoInputArea button").removeAttr("disabled");
			}, 1000)
		});
	})
	problemNewWinJQ.find(".contestInfoInputArea input")
		.bind('keydown',function(event){
	    if(event.keyCode == "13"){
	    	problemNewWinJQ.find(".contestInfoInputArea button").click();
	    }
	});
}
function sampleWrapper(x, y){
	var ret = [];
	for(var i=0; i<x.length; i++)
		ret.push({"input": x[i], "output": y[i]});
	return ret;
}
function initProblemNewWin(){
	problemNewWinJQ.find(".ToolListTitle").html("Codeforces Problems");
	problemNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/dark.css" : "./css/default.css");
	if(currentLoginHandle == ""){
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
		problemNewWinJQ.find(".submitLanguageChoser").html("");
		for(var name in submissionLangs)
			if(submissionLangs.hasOwnProperty(name))
				problemNewWinJQ.find(".submitLanguageChoser").append(`<option value=${name}>${submissionLangs[name]}</option>`)
		problemNewWinJQ.find(".submitLanguageChoser").val(settings.statementDefaultLanguage);
		problemNewWinJQ.find("#submitCodeArea").val("");
		problemNewWinJQ.find(".submitWindow").css("display", "grid");
		setTimeout(function(){problemNewWinJQ.find(".submitWindow").css("opacity", "1");}, 100);
		
		// problemNewWinJQ.find(".submitUsername").html(currentLoginHandle);
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
				    "url": `https://codeforces.com/${getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[0] >= 100000 ? "gym" : "contest"}/${getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[0]}/problem/${getProblemIndexes(problemCurrentPageList[problemFocusOn][0])[1]}`,
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
			var info = JSON.stringify({
				"name": problemCurrentPageList[i][4].title,
			    "group": problemCurrentPageList[i][4].contestName,
			    "url": `https://codeforces.com/${getProblemIndexes(problemCurrentPageList[i][0])[0] >= 100000 ? "gym" : "contest"}/${getProblemIndexes(problemCurrentPageList[i][0])[0]}/problem/${getProblemIndexes(problemCurrentPageList[i][0])[1]}`,
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
					 , problemNewWinJQ.find("#submitCodeArea").val()
					 , problemNewWinJQ.find(".submitLanguageChoser").val()
					 , function(id, cid, gc){
					 	problemNewWinJQ.find(".submitButton > button").removeClass("primaryColor").addClass("successColor");
					 	problemNewWinJQ.find(".submitButton > button").html(`<span info="submitSuccess">${languageOption.general.submitSuccess}</span>`);
					 	setTimeout(function(){
					 		problemNewWinJQ.find(".submitButton > button").addClass("primaryColor").removeClass("successColor");
					 		problemNewWinJQ.find(".submitButton > button").html(`<i class="fas fa-paper-plane"></i><span info="sendAnswer">${languageOption.general.sendAnswer}</span>`);
					 		problemNewWinJQ.find(".submitButton > button").removeAttr("disabled");
					 		problemNewWinJQ.find(".submitWindow").css("opacity", "0");
							setTimeout(function(){
								problemNewWinJQ.find(".submitWindow").css("display", "none");
							}, 500);
					 		if(id != undefined)
					 			problemNewWinJQ.append(`<script>addWatcher('${id}', '${cid}', '${gc}')</script>`)
					 	}, 1000);
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
function openProblemWin(xx, gid){
	if(!RunInNwjs)	return;
	if(problemNewWinOpened){
		problemNewWin.setAlwaysOnTop(true);
		problemNewWin.setAlwaysOnTop(false);
		addProblems(xx, gid);
		return;
	}
	problemNewWinOpened = true;
	nw.Window.open("problem.html",{
	    "title": "Codeforces Problems", 
	    "icon": "favicon.png",
	    "width": 800,
	    "height": 570, 
	    "position": "center",
	    "resizable": true,
	    "min_width": 450,
	    "min_height": 290,
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
			problemGroupRange = {};
			problemLoadID = 0;
			// problemNewWin.showDevTools();
			addProblems(xx, gid);
			problemNewWinLoaded = true;
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
function addContest(ci){
	loadContestProblemset(ci, false, function(data, info){
		addProblems(data, ci, info);
	}, function(){});
}
function openContestProblems(xx){
	if(!RunInNwjs)	return;
	if(problemNewWinOpened){
		problemNewWin.setAlwaysOnTop(true);
		problemNewWin.setAlwaysOnTop(false);
		addContest(xx);
		return;
	}
	problemNewWinOpened = true;
	nw.Window.open("problem.html",{
	    "title": "Codeforces Problems", 
	    "icon": "favicon.png",
	    "width": 800,
	    "height": 570, 
	    "position": "center",
	    "resizable": true,
	    "min_width": 450,
	    "min_height": 290,
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
			problemGroupRange = {};
			problemLoadID = 0;
			// problemNewWin.showDevTools();
			addContest(xx);
			addContest(xx);
			problemNewWinLoaded = true;
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