
var submissionLastOperated = new Date(0);
var submissionDataStorage = [];
function openSubmission(c, u){
	if(!RunInNwjs){
		openURL(settings.mainURL + `/${c >= 100000 ? "gym" : "contest"}/` + c + '/submission/' + u);
		return;
	}
	submissionLastOperated = new Date();
	var T = submissionLastOperated;
	$(".submissionContainer").css("display", "grid");
	$(".submissionContainer > div:first-child").css("display", "block");
	$(".submissionContainer > div:last-child").css("display", "none");
	setTimeout(function(){$(".submissionContainer").css("opacity", 1);}, 100);
	$(".submissionContainer > div:first-child > i").attr("class", 'fas fa-spin fa-sync-alt');
	var data, P;
	var submissionAjax;
	function loader(callback){
		submissionAjax = $.ajax({
			url: settings.mainURL + `/${c >= 100000 ? "gym" : "contest"}/` + c + '/submission/' + u,
			success: function(j){
				submissionAjax = null;
				if(T.getTime() != submissionLastOperated.getTime())	return;
				data = $(j); P = j;
				if(j.indexOf(`SubmissionDetailsFrameRoundBox-${u}"`) == -1)
					data = $("<body></body>");
				setTimeout(callback, 100);
			},
			error: function(){
				submissionAjax = null;
				if(T.getTime() != submissionLastOperated.getTime())	return;
				$(".submissionContainer > div:first-child > i").css("opacity", 0);
				setTimeout(function(){
					$(".submissionContainer > div:first-child > i").attr("class", 'fas fa-unlink');
					setTimeout(function(){
						$(".submissionContainer > div:first-child > i").css("opacity", 1);
					}, 100)
				}, 500);
				setTimeout(function(){
					$(".submissionContainer > div:first-child > i").css("opacity", 0);
					setTimeout(function(){
						$(".submissionContainer > div:first-child > i").attr("class", 'fas fa-spin fa-sync-alt');
						setTimeout(function(){
							$(".submissionContainer > div:first-child > i").css("opacity", 1);
						}, 100)
						loader(callback);
					}, 500);
				}, 9500);
			}
		})
	}
	function getF(x){
		for(var i=0; i<x.length; i++){
			var p = x[i];
			if(Number(p) != undefined && Number(p) != 0)
				return Number(p);
		}
		return 0;
	}
	var queryCsrf = new RegExp(`<meta name="X-Csrf-Token" content="([0-9a-f]*)"`);
	var csrf = "";
	function req(){
		csrf = queryCsrf.exec(P); delete(P);
		if(csrf != null)
			csrf = csrf[1];
		var ctN = data.find("table").eq(0).find("tr").eq(0);
		var ctL = data.find("table").eq(0).find("tr").eq(1);
		$(".submissionContainer").css("display", "block");
		$(".submissionContainer > div:last-child").css("display", "block");
		$(".submissionContainer > div:first-child").css("display", "none");
		$(".submissionDisplayer > div:first-child").css("display", "flex");
		$(".submissionDisplayer > div:last-child").css("display", "none");

		$(".submissionUsername").html();
		$(".submissionProblem").html(ctL.children().eq(2).find("a").text());
		$(".submissionLanguage").html(ctL.children().eq(3).text());
		var pwp = ctL.children().eq(4);
		var vdl = "";
		pwp.contents().each(function(){
			if(($(this).attr("class") != undefined && $(this).attr("class").indexOf("verdict") != -1) || $.trim($(this).text()) == "Compilation error" || $.trim($(this).text()) == "Skipped")
				vdl += $(this).text();
		})
		$(".submissionVerdict").html(vdl);
		$(".submissionVerdict").attr("class", "submissionVerdict");
		if(ctL.children().eq(4).children().eq(0).hasClass("verdict-accepted"))
			$(".submissionVerdict").addClass("green");
		if(ctL.children().eq(4).children().eq(0).hasClass("verdict-failed"))
			$(".submissionVerdict").addClass("red");
		if(ctN.children().eq(5).text() == "Time")
			$(".submissionTime").html(ctL.children().eq(5).text().replace(/\s+/g,""));
		else $(".submissionTime").html("?");
		if(ctN.children().eq(6).text() == "Memory")
			$(".submissionMemory").html(ctL.children().eq(6).text().replace(/\s+/g,""));
		else $(".submissionMemory").html("?");
		$(".submissionCode > code").html(allHtmlSpecialChars(data.find("#program-source-text").text()));
		$(".submissionCode").html("<code></code>");
		$(".jumpToSubmission").attr("onclick", `openURL('${settings.mainURL + `/${c >= 100000 ? 'gym' : 'contest'}/` + c + '/submission/' + u}')`);
		var nL = [];
		var curr = ctL.children().eq(1).find("a");
		curr.each(function(){
			if($(this).text() == '#')	return;
			var j = $("<div style='display:inline-block'></div>");
			if($(this).hasClass("user-gray"))			j.attr("class", "user-newbie");
			else if($(this).hasClass("user-green"))	j.attr("class", "user-pupil");
			else if($(this).hasClass("user-cyan"))	j.attr("class", "user-specialist");
			else if($(this).hasClass("user-blue"))	j.attr("class", "user-expert");
			else if($(this).hasClass("user-violet"))	j.attr("class", "user-cmaster");
			else if($(this).hasClass("user-orange"))	j.attr("class", "user-master");
			else if($(this).hasClass("user-yellow"))	j.attr("class", "user-imaster");
			else if($(this).hasClass("user-red"))		j.attr("class", "user-grandmaster");
			else if($(this).hasClass("user-fire"))	j.attr("class", "user-igrandmaster");
			else if($(this).hasClass("user-legendary"))	j.attr("class", "user-legendary");
			else j.attr("class", "");
			j.html($(this).text());
			nL.push(j);
		});

		$(".submissionUsername").html("");
		if(nL.length == 1)	$(".submissionUsername").append(nL[0]);
		else{
			$(".submissionUsername").append(nL[0]);
			$(".submissionUsername").append(": ");
			for(var i=1; i<nL.length; i++){
				if(i != 1)	$(".submissionUsername").append(", ");
				$(".submissionUsername").append(nL[i]);
			}
		}
		if(data.find("#program-source-text").length == 0){
			$(".submissionCode").html(`<div style='position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center'><span info="errorCannotGetCode">${languageOption.error.errorCannotGetCode}</span></div>`);
			$(".submissionDataLister").css("display", "none");
		}
		else{
			$(".submissionDataLister").css("display", "inline");
			$(".submissionCode").html(`<code>${allHtmlSpecialChars(data.find("#program-source-text").text())}</code>`);
			var q = data.find("#program-source-text").attr("class").split(" ");
			var lang = "plaintext";
			for(var p=0; p<q.length; p++){
				var i = q[p];
				if(i.substring(0, 4) == "lang")	lang = i.substring(5);
			}
			$(".submissionCode > code").attr("class", "hljs language-" + lang);
			hljs.highlightElement($(".submissionCode > code")[0]);
			hljs.lineNumbersBlock($(".submissionCode > code")[0]);
		}
		$(".submissionDataList").html("");
		$(".submissionDataDetail").html("");
		delete(data);
	}
	function submissionAddList(id){
		var S = submissionDataStorage[id-1];
		$(".submissionDataDetail").append(`<div style="width: calc(100% - 10px); font-size: 20px; padding: 5px; margin-bottom: 5px; position: sticky; top: 0px; background: var(--pop-out-block-background-color)">${localize("testcase")} #${id} <span style='font-size: 16px'>/ ${S[4]}ms / ${Math.floor(Number(S[5]) / 1024)}KB</span><span style='float: right'>${getSubmissionIcon(S[6])} ${toColoredSubmissionInfo(S[6])}</span></div>`);
		$(".submissionDataDetail").append(`<div style="margin-left: 5px; margin-bottom: 10px; font-size: 18px; font-weight: bold">${localize("input")}</div>`);
		if(S[0] != undefined)
			$(".submissionDataDetail").append(`<div style='width: calc(100% - 20px); white-space: pre; padding: 5px; margin-bottom: 10px; margin-left: 5px; margin-right: 5px; font-family: var(--editor-font-family); font-size: var(--editor-font-size); overflow: auto; background: var(--pop-out-block-background-color-1); border-radius: 5px;'>${$.trim(S[0]).replace("\r\n", "<br/>")}</div>`);
		$(".submissionDataDetail").append(`<div style="margin-left: 5px; margin-bottom: 10px; font-size: 18px; font-weight: bold">${localize("output")}</div>`);
		if(S[1] != undefined)
			$(".submissionDataDetail").append(`<div style='width: calc(100% - 20px); white-space: pre; padding: 5px; margin-bottom: 10px; margin-left: 5px; margin-right: 5px; font-family: var(--editor-font-family); font-size: var(--editor-font-size); overflow: auto; background: var(--pop-out-block-background-color-1); border-radius: 5px;'>${$.trim(S[1]).replace("\r\n", "<br/>")}</div>`);
		$(".submissionDataDetail").append(`<div style="margin-left: 5px; margin-bottom: 10px; font-size: 18px; font-weight: bold">${localize("answer")}</div>`);
		if(S[2] != undefined)
			$(".submissionDataDetail").append(`<div style='width: calc(100% - 20px); white-space: pre; padding: 5px; margin-bottom: 10px; margin-left: 5px; margin-right: 5px; font-family: var(--editor-font-family); font-size: var(--editor-font-size); overflow: auto; background: var(--pop-out-block-background-color-1); border-radius: 5px;'>${$.trim(S[2]).replace("\r\n", "<br/>")}</div>`);
		$(".submissionDataDetail").append(`<div style="margin-left: 5px; margin-bottom: 10px; font-size: 18px; font-weight: bold">${localize("result")}</div>`);
		if(S[3] != undefined)
			$(".submissionDataDetail").append(`<div style='width: calc(100% - 20px); white-space: pre; padding: 5px; margin-bottom: 10px; margin-left: 5px; margin-right: 5px; font-family: var(--editor-font-family); font-size: var(--editor-font-size); overflow: auto; background: var(--pop-out-block-background-color-1); border-radius: 5px;'>${$.trim(S[3]).replace("\r\n", "<br/>")}</div>`);
	}
	function submissionInitData(){
		$(".submissionDataDetail").html(`<div style='display: grid; place-items: center; height: 100%; width: 100%'><i class='fas fa-sync-alt fa-spin fa-3x'></i></div>`);
		$.ajax({
			url: settings.mainURL + "/data/submitSource",
			type: "POST",
			data: {
				csrf_token: csrf,
				submissionId: u,
			},
			success: function(d){
				var l = Number(d.testCount);
				submissionDataStorage = [];
				var tl = 0, ml = 0;
				for(var i=1; i<=l; i++)
					tl = Math.max(tl, Number(d["timeConsumed#" + i])),
					ml = Math.max(ml, Number(d["memoryConsumed#" + i]));
				ml = Math.floor(ml / 1024);
				$(".submissionDataList").append(`<div class="submissionDataListItem" id="0" style='height: 40px; padding: 5px; width: calc(100% - 10px); display: flex; flex-direction: row;'><div style='width: 32px; margin-right: 5px; display: grid; place-items: center; font-size: 24px'><i class='fas fa-list-ul'></i></div><div style="display: grid; place-items: center; flex: 1; height: 40px; font-size: 14px"><div style="width: 100%">${localize("allTestcase")}<span style="float: right">${tl}ms</span></div><div style="width: 100%">${localize("count")}: ${l}<span style="float: right">${ml}KB</span></div></div></div>`);
				for(var i=1; i<=l; i++){
					$(".submissionDataList").append(`<div class="submissionDataListItem" id="${i}" style='height: 40px; padding: 5px; width: calc(100% - 10px); display: flex; flex-direction: row;'><div style='width: 32px; margin-right: 5px; display: grid; place-items: center; font-size: 24px'>${getSubmissionIcon(d["verdict#" + i])}</div><div style="display: grid; place-items: center; flex: 1; height: 40px; font-size: 14px"><div style="width: 100%">${localize("testcase")} #${i}<span style="float: right">${d["timeConsumed#" + i]}ms</span></div><div style="width: 100%">${toColoredSubmissionInfo(d["verdict#" + i])}<span style="float: right">${Math.floor(Number(d["memoryConsumed#" + i]) / 1024)}KB</span></div></div></div>`);
					submissionDataStorage.push([d["input#" + i], d["output#" + i], d["answer#" + i], d["checkerStdoutAndStderr#" + i], d["timeConsumed#" + i], d["memoryConsumed#" + i], d["verdict#" + i]]);
				}
				$(".submissionDataDetail").html(`<div style='text-align: center; display: grid; place-items: center; height: 100%; width: 100%'><div><i class='fas fa-info-circle fa-2x'></i><br/><div style="font-size: 20px; margin-top: 10px">${localize("selectToShow")}</div></div></div>`);
				$(".submissionDataListItem").unbind("click").click(function(){
					$(".submissionDataListItem.selected").removeClass("selected");
					$(this).addClass("selected");
					var id = Number($(this).attr("id"));
					$(".submissionDataDetail").html("");
					if(id == 0){
						for(var i=1; i<=l; i++)
							submissionAddList(i);
						return;
					}
					else
						submissionAddList(id);
				})
			},
			error: function(){
				$(".submissionDataDetail").html(`<div style='display: grid; place-items: center; height: 100%; width: 100%'><i class='fas fa-unlink red fa-3x'></i></div>`)
			}
		});
	}
	$(".submissionCloser").unbind("click").click(function(){
		delete(submissionDataStorage);
		submissionDataStorage = [];
		submissionLastOperated = new Date();
		if(submissionAjax != null)
			submissionAjax.abort();
		$(".submissionContainer").css("opacity", 0);
		setTimeout(function(){
			$(".submissionContainer").css("display", "none");
			$(".submissionDataList").html("");
			$(".submissionDataDetail").html("");
		}, 500);
	})
	$(".submissionCodeLister").unbind("click").click(function(){
		$(".submissionDisplayer > div:first-child").css("display", "flex");
		$(".submissionDisplayer > div:last-child").css("display", "none");
	})
	var dataLoadingIf = false;
	$(".submissionDataLister").unbind("click").click(function(){
		$(".submissionDisplayer > div:first-child").css("display", "none");
		$(".submissionDisplayer > div:last-child").css("display", "flex");
		if(!dataLoadingIf){
			dataLoadingIf = true;
			submissionInitData();
		}
	})
	loader(req);
}
function getIdFromProblemName(x){
	var ret = "";
	
	for(var i=1; i<x.length; i++){
		if(x[i] == ")")	break;
		ret += x[i];
	}
	return ret;
}