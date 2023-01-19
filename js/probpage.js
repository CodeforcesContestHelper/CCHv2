var probpageInfoDatas = [
	[],
	[],
	[]
];
var probpageChosenTags = [];
var probpageInfoLoaders = [null, null];
var probpageIdToTag = {},
	probpageTagToId = {};
var probpageProblemToSubmissions = {};
var probpagePassedPersons = {};
var probpageFilteredInfo = undefined,
	probpagePageID;
const probpagePageCount = 50;
// getProblemStatistics(data) -> [tag info, rating info]
var probpageCalculatedProblemType = {};

function probpageReadySubmissions(d) {
	delete(probpageProblemToSubmissions);
	probpageProblemToSubmissions = {};
	for (var i = 0; i < d.length; i++) {
		var q = d[i];
		var p = q.problem.contestId + q.problem.index;
		if (probpageProblemToSubmissions[p] == undefined)
			probpageProblemToSubmissions[p] = [];
		probpageProblemToSubmissions[p].push(q);
	}
}

function probpageProblemPassedIf(id) {
	if (probpageCalculatedProblemType[id] != undefined)
		return probpageCalculatedProblemType[id];
	var i = probpageProblemToSubmissions[id];
	if (i == undefined)
		return probpageCalculatedProblemType[id] = -1;
	for (var x = 0; x < i.length; x++) {
		var t = i[x];
		if (t.verdict == "OK")
			return probpageCalculatedProblemType[id] = 1;
	}
	return probpageCalculatedProblemType[id] = 2;
}
var probpageListFilterRegex = [/^:ac$/, /^:uac$/, /^:unf$/, /^:cid=([0-9]+)$/, /^:index=([0-9a-zA-Z]+)$/, /^:pid=([0-9a-zA-Z]+)$/];
var probpageListFilterFuncs = [
	function(q, argv) {
		return probpageProblemPassedIf(q.contestId + q.index) == 1;
	},
	function(q, argv) {
		return probpageProblemPassedIf(q.contestId + q.index) == 2;
	},
	function(q, argv) {
		return probpageProblemPassedIf(q.contestId + q.index) == -1;
	},
	function(q, argv) {
		return q.contestId == Number(argv[1]);
	},
	function(q, argv) {
		var t = q.index.toLowerCase();
		var T = argv[1].toLowerCase();
		if (t.length < T.length)
			return false;
		return t.substring(0, T.length) == T;
	},
	function(q, argv) {
		var t = (String(q.contestId) + q.index).toLowerCase();
		var T = argv[1].toLowerCase();
		if (T.length <= String(q.contestId).length)
			return false;
		return t.substring(0, T.length) == T;
	},
]

function probpageProblemFilter(d, mn, mx, ft) {
	var ret = d;
	if (mn != 0) {
		var q = ret;
		ret = [];
		for (var i = 0; i < q.length; i++)
			if (q[i].rating != undefined && q[i].rating >= mn)
				ret.push(q[i]);
	}
	if (mx != 0) {
		var q = ret;
		ret = [];
		for (var i = 0; i < q.length; i++)
			if (q[i].rating != undefined && q[i].rating <= mx)
				ret.push(q[i]);
	}
	for (var j = 0; j < probpageChosenTags.length; j++) {
		var tg = probpageChosenTags[j];
		var q = ret;
		ret = [];
		for (var i = 0; i < q.length; i++)
			if (q[i].tags.indexOf(probpageIdToTag[tg]) != -1)
				ret.push(q[i]);
	}
	ft = ft.split(" ");
	var namT = [],
		tagT = [];
	var rnd = false;
	for (var i = 0; i < ft.length; i++) {
		var q = $.trim(ft[i]).toLowerCase();
		if (q == "")
			continue;
		if (q == ":random") {
			rnd = true;
			continue;
		}
		var flg = false;
		for (var j = 0; j < probpageListFilterRegex.length; j++)
			if (probpageListFilterRegex[j].test(q)) {
				tagT.push([j, probpageListFilterRegex[j].exec(q)]);
				flg = true;
				break;
			}
		if (!flg)
			namT.push(q);
	}
	var q = ret;
	ret = [];
	for (var i = 0; i < q.length; i++) {
		var Q = q[i];
		var flg = true;
		for (var j = 0; j < namT.length; j++)
			flg &= Q.name.toLowerCase().indexOf(namT[j].toLowerCase()) != -1;
		for (var j = 0; j < tagT.length; j++)
			flg &= probpageListFilterFuncs[tagT[j][0]](Q, tagT[j][1]);
		if (flg)
			ret.push(q[i]);
	}
	if (rnd && ret.length != 0)
		ret = [ret[Math.floor(Math.random() * ret.length)]];
	return ret;
}

function probpageProblemSort(d, st, dir) {
	function getVal(q, s) {
		if (s == 1)
			return [q.contestId, q.index];
		if (s == 2)
			return [q.rating == undefined ? 0 : Number(q.rating)];
		if (s == 3)
			return [q.name];
		return [probpagePassedPersons[q.contestId + q.index]];
	}

	function comp(x, y) {
		for (var i = 0; i < x.length; i++)
			if (x[i] != y[i])
				return (x[i] < y[i]) ? -1 : 1;
		return 0;
	}
	d.sort(function(x, y) {
		var X = getVal(x, st),
			Y = getVal(y, st);
		if (comp(X, Y) != 0) {
			var ret = comp(X, Y);
			if (dir)
				ret *= -1;
			return ret;
		}
		X = getVal(x, 1), Y = getVal(y, 1);
		var ret = comp(X, Y);
		if (dir)
			ret *= -1;
		return ret;
	})
	return d;
}

function probpageDisplayAllSubmissions(pid) {
	var useful = probpageProblemToSubmissions[pid];
	if (useful == undefined || useful.length == 0)
		return;
	$(".eventContainer").css("display", "grid");
	setTimeout(function() {
		$(".eventContainer").css("opacity", "1");
	}, 50);
	$(".eventList").html('');
	for (var i = 0; i < useful.length; i++) {
		var tim = "";
		var curr = useful[i];
		tim = (new Date(curr.creationTimeSeconds * 1000).pattern("yyyy/MM/dd hh:mm"));
		var vid = "";
		if (curr.verdict == "OK")
			vid = `<span class="green" style="font-weight: bold">${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if (curr.verdict == undefined)
			vid = `<span>${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if (curr.verdict == "TESTING")
			vid = `<span>${toDetailedInfo(curr.verdict, curr.testset)} on test ${curr.passedTestCount + 1}</span>`
		else if (curr.verdict == "PARTIAL" || curr.verdict == "COMPILATION_ERROR" || curr.verdict == "SKIPPED" || curr.verdict == "REJECTED")
			vid = `<span class="red">${toDetailedInfo(curr.verdict, curr.testset)}</span>`
		else if (curr.verdict == "CHALLENGED")
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

function renderprobpageProblemMain() {
	$(".probpageProblemMain").html("");
	var len = Math.floor((probpageFilteredInfo.length + probpagePageCount - 1) / probpagePageCount);
	len = Math.max(len, 1);
	probpagePageID = Math.max(1, Math.min(len, probpagePageID));
	var l = (probpagePageID - 1) * probpagePageCount;
	var r = l + probpagePageCount;
	r = Math.min(r, probpageFilteredInfo.length);
	$(".probpageProblemPages").html(`${probpagePageID}/${len}`);
	for (var i = l; i < r; i++) {
		var tgs = "";
		for (var j = 0; j < probpageFilteredInfo[i].tags.length; j++)
			tgs += `<span class="probpageTagBox" force="true" tagId="${probpageTagToId[probpageFilteredInfo[i].tags[j]]}" style='background: ${problemTagsToColor[probpageFilteredInfo[i].tags[j]][1]};'>${probpageFilteredInfo[i].tags[j]}</span>`;
		if (tgs == "")
			tgs = `<span class="probpageTagBox" style='background: rgba(127, 127, 127, 0.5);'>-</span>`;
		$(".probpageProblemMain").append(`<div class='probpageProblemBlock'><div style='width: 20px; text-align: center'><i class='${probpageProblemPassedIf(probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index) == -1 ? 'fas fa-minus' : (probpageProblemPassedIf(probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index) == 1 ? "fas fa-check green" : "fas fa-times red")}' style="cursor: pointer" onclick="probpageDisplayAllSubmissions('${probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index}')"></i></div><div style="width: 100px">${probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index}</div><div style="flex: 1"><span onclick="openProblemWin(['${probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index}'])" style="cursor: pointer">${probpageFilteredInfo[i].name}</span><span style='color: grey; font-size: 12px' class='probpageProblemRating'> *${probpageFilteredInfo[i].rating == undefined ? "?" : probpageFilteredInfo[i].rating}</span></div><div style="font-size: 14px"><i class='fas fa-user-check'></i> ${probpagePassedPersons[probpageFilteredInfo[i].contestId + probpageFilteredInfo[i].index]}</div></div>`)
		$(".probpageProblemMain").append(`<div class='probpageProblemTags'>${tgs}</div>`);
	}
	delete(passedPersons);
}
$(".probpagePageLeft").click(function() {
	if (probpageFilteredInfo == undefined)
		return;
	--probpagePageID;
	renderprobpageProblemMain();
})
$(".probpagePageRight").click(function() {
	if (probpageFilteredInfo == undefined)
		return;
	++probpagePageID;
	renderprobpageProblemMain();
})

function renderprobpageProblemsPage(d, fir) {
	var D = getProblemStatistics(d);
	$(".probpageTagsDisplayer").html("");
	if (fir) {
		delete(probpageIdToTag);
		probpageIdToTag = {};
		delete(probpageTagToId);
		probpageTagToId = {};
	}
	var passedQuestions = {};
	for (var i = 0; i < D[0].length; i++)
		passedQuestions[D[0][i][0]] = D[0][i][1];
	var Sm = 0;
	for (var i = 0; i < D[0].length; i++)
		Sm += D[0][i][1];
	$(".probpageTagsDisplayer").append(`<span class="probpageTagBox" style='background: rgba(127, 127, 127, 0.5);'>all: ${d.length}</span>`);
	for (var i = 0; i < probpageChosenTags.length; i++) {
		var tg = probpageIdToTag[probpageChosenTags[i]];
		var ps = passedQuestions[tg];
		if (ps == undefined)
			ps = 0;
		$(".probpageTagsBar").append(`<div class='problemTagsBarContent' style="background-color: ${problemTagsToColor[tg][0]}; width: ${Sm == 0 ? 0 : D[0][i][1] / Sm * 100}%" title='${tg}: ${ps}'></span>`);
		$(".probpageTagsDisplayer").append(`<span class="probpageTagBox" tagId="${probpageTagToId[tg]}" style='background: ${problemTagsToColor[tg][1]};'><i class='fas fa-circle' style="color: ${problemTagsToColor[tg][0]}"></i> ${tg}: ${ps}</span>`)
	}
	if (D[0].length) {
		for (var i = 0; i < D[0].length; i++)
			if (probpageChosenTags.indexOf(probpageTagToId[D[0][i][0]]) == -1) {
				if (problemTagsToColor[D[0][i][0]] == undefined)
					problemTagsToColor[D[0][i][0]] = getRandomColor();
				if (fir)
					probpageIdToTag[i] = D[0][i][0],
					probpageTagToId[D[0][i][0]] = i;
				$(".probpageTagsBar").append(`<div class='problemTagsBarContent' style="background-color: ${problemTagsToColor[D[0][i][0]][0]}; width: ${D[0][i][1] / Sm * 100}%" title='${D[0][i][0]}: ${D[0][i][1]}'></span>`);
				$(".probpageTagsDisplayer").append(`<span class="probpageTagBox" tagId="${probpageTagToId[D[0][i][0]]}" style='background: ${problemTagsToColor[D[0][i][0]][1]};'><i class='far fa-circle' style="color: ${problemTagsToColor[D[0][i][0]][0]}"></i> ${D[0][i][0]}: ${D[0][i][1]}</span>`)
			}
	}
	var mx = 0;
	for (var i = 0; i < D[1].length; i++)
		mx = Math.max(mx, D[1][i]);
	for (var i = 0; i < D[1].length; i++) {
		var currRating = i * 100 + 800;
		var currPassed = D[1][i];
		var prob = 0;
		if (mx != 0)
			prob = currPassed / mx;
		$(".probpageRatingGraphBar" + currRating).css("height", 60 * prob);
		$(".probpageRatingGraphDesc" + currRating).css("bottom", 60 * prob + 30).html(currPassed);
	}
	// cssController2
	probpagePageID = 1;
	delete(probpageFilteredInfo);
	probpageFilteredInfo = d;
	renderprobpageProblemMain();
	$(".probpageTagBox").unbind("click").click(function() {
		var q = $(this).attr("tagId");
		if (q == undefined || q == "")
			return;
		q = Number(q);
		if (probpageChosenTags.indexOf(q) != -1 && !($(this).attr("force") == "true"))
			probpageChosenTags.splice(probpageChosenTags.indexOf(q), 1);
		else if (probpageChosenTags.indexOf(q) == -1)
			probpageChosenTags.push(q);
		else
			return;
		reloadprobpageProblemPage(false);
	})
	delete(D);
	delete(passedQuestions);
}
$(".probpageTagsDisplayIf").click(function() {
	if ($(this).hasClass("selected")) {
		$(this).removeClass("selected");
		$(".cssController3").html(".probpageProblemTags, .probpageTagBox[tagId]{display: none;} .probpageTagsDisplayer{height: 30px;} .probpageProblemBlock{margin: 15px 0px}");
	} else {
		$(this).addClass("selected");
		$(".cssController3").html(".probpageProblemTags{display: block;} .probpageTagBox[tagId]{display: inline-block;}");
	}
})

$(".probpageRatingDisplayIf").click(function() {
	if ($(this).hasClass("selected")) {
		$(this).removeClass("selected");
		$(".cssController5").html(".probpageProblemRating{display: none} .probpageRatingGraph{display: none} .probpageProblemMain{margin-top: 10px}");
	} else {
		$(this).addClass("selected");
		$(".cssController5").html(".probpageProblemRating{display: inline} .probpageRatingGraph{display: block}");
	}
})

function initprobpageRatingGraph() {
	function getColorByRating(x) {
		for (var i = 0; i < ratingRanges.length; i++)
			if (x >= ratingRanges[i].from && x < ratingRanges[i].to)
				return ratingRanges[i].color;
	}
	var wd = $(".probpageRatingGraph").width();
	for (var i = 800; i <= 3500; i += 100) {
		var currRating = i;
		var currPassed = 0;
		var prob = 0;
		var col = getColorByRating(currRating);
		if ((i - 800) % 3 == 0)
			$(".probpageRatingGraph").append(`<span style='transform: translate(-50%, 0); position: absolute; bottom: 10px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; color: grey; font-size: 12px'>${currRating}</span>`)
		$(".probpageRatingGraph").append(`<div number=${i} class="probpageRatingGraphBarContent probpageRatingGraphBar${i}" style='cursor: pointer; transition: 0.3s; border-radius: 5px; transform: translate(-50%, 0); position: absolute; bottom: 30px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; background-color: ${col}; width: 10px; height: ${60 * prob}px'></div>`)
		$(".probpageRatingGraph").append(`<span number=${i} class="probpageRatingGraphDescContent probpageRatingGraphDesc${i}" style='cursor: pointer; transition: 0.3s; transform: translate(-50%, 0); position: absolute; bottom: ${60 * prob + 30}px; left: ${((i-800)/100+0.5) / 28 * wd + 10}px; color: grey; font-size: 12px'>${0}</span>`)
	}
	$(".probpageRatingGraphBarContent").click(function() {
		if (probpageFilteredInfo == undefined)
			return;
		var num = $(this).attr("number");
		if ($(".probpageDiffInput[info=minDiff]").val() == num &&
			$(".probpageDiffInput[info=maxDiff]").val() == num)
			$(".probpageDiffInput[info=minDiff]").val(""),
			$(".probpageDiffInput[info=maxDiff]").val("");
		else
			$(".probpageDiffInput[info=minDiff]").val(num),
			$(".probpageDiffInput[info=maxDiff]").val(num);
		reloadprobpageProblemPage(false);
	})
	$(".probpageRatingGraphDescContent").click(function() {
		if (probpageFilteredInfo == undefined)
			return;
		var num = $(this).attr("number");
		if ($(".probpageDiffInput[info=minDiff]").val() == num &&
			$(".probpageDiffInput[info=maxDiff]").val() == num)
			$(".probpageDiffInput[info=minDiff]").val(""),
			$(".probpageDiffInput[info=maxDiff]").val("");
		else
			$(".probpageDiffInput[info=minDiff]").val(num),
			$(".probpageDiffInput[info=maxDiff]").val(num);
		reloadprobpageProblemPage(false);
	})
}

function reloadprobpageProblemPage(fir) {
	var d = probpageInfoDatas[0];
	var mn = $(".probpageDiffInput[info=minDiff]").val();
	var mx = $(".probpageDiffInput[info=maxDiff]").val();
	var ft = $(".probpageTagsInput").val();
	var st = 0;
	if ($(".probpageSelectSortID").hasClass("selected"))
		st = 1;
	else if ($(".probpageSelectSortRating").hasClass("selected"))
		st = 2;
	else if ($(".probpageSelectSortName").hasClass("selected"))
		st = 3;
	else
		st = 4;
	var dir = 0;
	if ($(".probpageSelectSortDirection i").hasClass("fa-caret-down"))
		dir = 1;
	if (fir)
		probpageReadySubmissions(probpageInfoDatas[2]);
	d = probpageProblemFilter(d, Number(mn), Number(mx), ft);
	d = probpageProblemSort(d, st, dir);
	renderprobpageProblemsPage(d, fir);
}
initprobpageRatingGraph();
$(".probpageSortId").click(function() {
	$(".probpageSortId.selected").removeClass("selected");
	$(this).addClass("selected");
	if (probpageFilteredInfo == undefined)
		return;
	reloadprobpageProblemPage(false);
})
$(".probpageSelectSortDirection").click(function() {
	if ($(this).find("i").hasClass("fa-caret-down"))
		$(this).find("i").attr("class", "fas fa-caret-up red");
	else
		$(this).find("i").attr("class", "fas fa-caret-down green");
	reloadprobpageProblemPage(false);
})
$(".probpageDiffInput").bind('input propertychange', function() {
	if (probpageFilteredInfo == undefined)
		return;
	reloadprobpageProblemPage(false);
})
$(".probpageTagsInput").bind('input propertychange', function() {
	if (probpageFilteredInfo == undefined)
		return;
	reloadprobpageProblemPage(false);
})

function probpageLoad(reList) {
	for (var i = 0; i < 2; i++)
		if (probpageInfoLoaders[i] != null && (reList == undefined || reList[i]))
			probpageInfoLoaders[i].abort(), probpageInfoLoaders[i] = null;

	function setLoaderById(id, url, S) {
		$(".probpageLoader" + id).html(`<i class='fas fa-hourglass-half'></i>`);
		probpageInfoLoaders[id] = $.ajax({
			url: url,
			success: function(d) {
				probpageInfoLoaders[id] = null;
				if (d.status != "OK")
					$(".probpageLoader" + id).html(`<i class='fas fa-times red'></i>`);
				else {
					$(".probpageLoader" + id).html(`<i class='fas fa-check green'></i>`);
					S(d.result);
				}
			},
			error: function() {
				probpageInfoLoaders[id] = null;
				$(".probpageLoader" + id).html(`<i class='fas fa-times red'></i>`);
			},
			xhr: function() {
				var xhr = new XMLHttpRequest();
				xhr.addEventListener('progress', function(e) {
					$(".probpageLoader" + id).html(`<span>${toMemoryInfo(e.loaded / 8)}</span>`);
				});
				return xhr;
			}
		})
	}
	if (reList == undefined) {
		setLoaderById(0, generateAuthorizeURL(settings.codeforcesApiUrl + '/problemset.problems', {}), function(d) {
			delete(probpageInfoDatas[0]);
			delete(probpageInfoDatas[1]);
			probpageInfoDatas[0] = d.problems;
			probpageInfoDatas[1] = d.problemStatistics;
			delete(probpageChosenTags);
			probpageChosenTags = [];
			delete(probpagePassedPersons);
			probpagePassedPersons = {};
			for (var i = 0; i < probpageInfoDatas[1].length; i++)
				probpagePassedPersons[probpageInfoDatas[1][i].contestId + probpageInfoDatas[1][i].index] = probpageInfoDatas[1][i].solvedCount;
			reloadprobpageProblemPage(true);
		})
		if (currentLoginHandle != "") {
			setLoaderById(1, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.status', {
				handle: currentLoginHandle
			}), function(d) {
				delete(probpageInfoDatas[2]);
				probpageInfoDatas[2] = d;
				delete(probpageChosenTags);
				probpageChosenTags = [];
				delete(probpageCalculatedProblemType);
				probpageCalculatedProblemType = {};
				if (probpageInfoLoaders[0] == null)
					reloadprobpageProblemPage(true);
			})
		}
	} else {
		if (reList[0])
			setLoaderById(0, generateAuthorizeURL(settings.codeforcesApiUrl + '/problemset.problems', {}), function(d) {
				delete(probpageInfoDatas[0]);
				delete(probpageInfoDatas[1]);
				probpageInfoDatas[0] = d.problems;
				probpageInfoDatas[1] = d.problemStatistics;
				delete(probpagePassedPersons);
				probpagePassedPersons = {};
				for (var i = 0; i < probpageInfoDatas[1].length; i++)
					probpagePassedPersons[probpageInfoDatas[1][i].contestId + probpageInfoDatas[1][i].index] = probpageInfoDatas[1][i].solvedCount;
				delete(probpageChosenTags);
				probpageChosenTags = [];
				reloadprobpageProblemPage(true);
			})
		if (reList[1] && currentLoginHandle != "") {
			setLoaderById(1, generateAuthorizeURL(settings.codeforcesApiUrl + '/user.status', {
				handle: currentLoginHandle
			}), function(d) {
				delete(probpageInfoDatas[2]);
				probpageInfoDatas[2] = d;
				delete(probpageChosenTags);
				probpageChosenTags = [];
				delete(probpageCalculatedProblemType);
				probpageCalculatedProblemType = {};
				if (probpageInfoLoaders[0] == null)
					reloadprobpageProblemPage(true);
			})
		}
	}
}
var probpageFirstLoaded = false;
$("[for=questionContent]").click(function() {
	if (!probpageFirstLoaded) {
		probpageFirstLoaded = true;
		probpageLoad();
	}
})
$(".probpageLoader0").click(function() {
	probpageLoad([1, 0]);
})
$(".probpageLoader1").click(function() {
	probpageLoad([0, 1]);
})