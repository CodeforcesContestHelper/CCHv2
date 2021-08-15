var settings = localStorage.getItem("CCH_Settings");
function saveSettings(){
	localStorage.setItem("CCH_Settings", JSON.stringify(settings));
}
var contestRanks = [0, 0], contestRankLast = [0, 0], contestRankInfo = [[], []], contestCalculatingRank = [false, false], contestRankChosen = 0;
var contestNewWinJQ, contestNewWin, contestNewWinOpened = false, contestNewWinLoaded = false;
var lang_list = ["English", "简体中文"];
var lang_attr = ["en", "zh_cn"];
var openStandingsSelection = ["Disabled", "Div1Only", "Enabled"];
var openRankPredictorSelection = ["Disabled", "RatedOnly", "Enabled"];
var styleSelectionList = ["System", "Light", "Dark"];
var lang_en = {
	general: {
		title: "Codeforces Contest Helper v2.0",
		singleNav: "Single",
		multiNav: "Multi",
		contestNav: "Contest",
		questionNav: "Question",
		infoNav: "Profile",
		settingNav: "Settings",
		singleTitle: "<i class='fas fa-calendar'></i> Select Contest Type",
		singleDivider: "OR",
		singleContestantPointer: "Contestant",
		singleVirtualPointer: "Virtual",
		singleContestantButton: "Fetch Information",
		singleVirtualButton: "Fetch Information",
		singleCheckExist: "Checking Existance...",
		singleHeadBack: "Back to select page",
		singleSmallWindow: "Open small window",
		singleSmallWindowClose: "Close small window",
		alertLoadSuccess: "Load Success!",
		Rank: "Rank",
		Problem: "Problem",
		contestRunning: "Contest Ends in {0}",
		contestPendingSystemTest: "Pending System Test",
		contestSystemTest: "System Testing",
		contestFinished: "Finished",
		settingsSingle: "Single Mode",
		settingsPreference: "Preference",
		Ascending: "Ascending",
		Descending: "Descending",
		Disabled: "Disabled",
		Div1Only: "Div. 1 only",
		RatedOnly: "Rated Only",
		Enabled: "Enabled",
		tagContestant: "Contestant",
		tagUnrated: "Unrated",
		tagVirtual: "Virtual",
		Unrated: "Unrated",
		System: "System",
		Light: "Light",
		Dark: "Dark",
		setAsDefault: "Set As Default",
		Rank: "Rank",
	},
	input: {
		singleContestantUsername: "Username",
		singleContestantContestId: "Contest ID",
		singleVirtualUsername: "Username",
		singleVirtualContestId: "Contest ID",
		singleVirtualTime: "Time (YYYY/M/D HH:MM)",
	},
	error: {
		errorUsernameError: "Username Error",
		errorContestIdError: "Contset Id Error",
		errorNetworkError: "Network Error",
		errorUserNotFound: "User Not Found",
		errorLoadTimeout: "Load Timeout",
		errorContestNotFound: "Contest Not Found",
		errorTimeFormatError: "Time Format Error",
		errorNotInTheContest: "Not in the contest",
		errorContestNotStarted: "Contest not started",
		errorVirtualInfoNotFound: "Virtual round not found",
	},
	tip: {
		tipInitializing: "Initializing...",
		tipContestNotStarted: "Contest has not started.",
		tipHaveARest: "Take a deep breath and have a rest.",
		tipContestStartIn: "Contest starts in {0}",
		tipLoading: "Loading...",
		tipCalculatingRankGraph: "Loading rank graph...",
		tipNoSubmissionFound: "No submission found",
		tipFetchingStandings: "Fetching standings...",
		tipFetchingHacks: "Fetching hacks...",
		tipVirtualTime: "Insert 'auto' to get the latest virtual round <span class='red'>with at least one submission</span>."
	},
	settings: {
		fontFamily: [
			"Font Family",
			"Use commas(,) to split font name. Monospace font can make a better view."
		],
		timeLimit: [
			"Load Time Limit",
			"Time limits while fetching information. Big time limit will be used to limit standings and rating changes loader."
		],
		reloadTime: [
			"Information Load Time",
			"Load time between updates during the contest."
		],
		smallReloadTime: [
			"Small Reload Time",
			"Reload time when some of the informations are not be able to be loaded."
		],
		mainURL: [
			"Main URL",
			"URL used while opening Codeforces links."
		],
		predictorURL: [
			"Predictor URL",
			"Address to get predicted rating changes."
		],
		openStandings: [
			"Open Standings",
			"Select when to load the standings and hacks of a contest. <span class='red'>The data can be really large, so think twice.</span>"
		],
		standingsLoadingGap: [
			"Standings Loading Gap",
			"Load time between standings updates."
		],
		openRankPredict: [
			"Open Rank Calculator",
			"Select when to enable history rank calculator. <span class='red'>Standings Required.</span>"
		],
		problemSubmissionDirection: [
			"Submission Order",
			"Order option of submissions for each problem."
		],
		problemEventDirection: [
			"Event Order",
			"Order option of events for the contest."
		],
		language: [
			"Language",
			"The language can be loaded without rebooting."
		],
		styleSelection: [
			"Style",
			"Select favourite style."
		],
		virtualFilter: [
			"Open Virtual Filter",
			"Choose how history rank calculator deal with virtual information. Open this to remove them."
		]
	}
};
var lang_zh = {
	general: {
		title: "Codeforces Contest Helper v2.0",
		singleNav: "个人",
		multiNav: "多人",
		contestNav: "比赛",
		questionNav: "题目",
		infoNav: "简介",
		settingNav: "设置",
		singleTitle: "<i class='fas fa-calendar'></i> 选择比赛类型",
		singleDivider: "或",
		singleContestantPointer: "参赛者",
		singleVirtualPointer: "虚拟赛",
		singleContestantButton: "获取信息",
		singleVirtualButton: "获取信息",
		singleCheckExist: "检查合法性......",
		singleHeadBack: "返回选择界面",
		singleSmallWindow: "打开小窗口",
		singleSmallWindowClose: "关闭小窗口",
		alertLoadSuccess: "加载成功！",
		Rank: "排名",
		Problem: "题目",
		contestRunning: "在 {0} 后结束",
		contestPendingSystemTest: "等待系统测试",
		contestSystemTest: "系统测试中",
		contestFinished: "已结束",
		settingsSingle: "个人模式",
		settingsPreference: "个性化",
		Ascending: "递增",
		Descending: "递减",
		Disabled: "关闭",
		Div1Only: "仅 Div. 1",
		RatedOnly: "仅 Rated",
		Enabled: "开启",
		tagContestant: "参赛者",
		tagUnrated: "不计 Rating",
		tagVirtual: "虚拟赛",
		Unrated: "Unrated",
		System: "跟随系统",
		Light: "亮色",
		Dark: "暗色",
		setAsDefault: "设置为默认值",
		Rank: "排名",
		tipVirtualTime: "输入 'auto' 以获取最近的<span class='red'>提交至少一次的</span>虚拟赛时间。"
	},
	input: {
		singleContestantUsername: "用户名",
		singleContestantContestId: "比赛 ID",
		singleVirtualUsername: "用户名",
		singleVirtualContestId: "比赛 ID",
		singleVirtualTime: "时间 (YYYY/M/D HH:MM)",
	},
	error: {
		errorUsernameError: "用户名错误",
		errorContestIdError: "比赛 ID 错误",
		errorNetworkError: "网络错误",
		errorUserNotFound: "用户未找到",
		errorLoadTimeout: "加载超时",
		errorContestNotFound: "比赛未找到",
		errorTimeFormatError: "时间格式错误",
		errorNotInTheContest: "不在比赛当中",
		errorContestNotStarted: "比赛没有开始",
		errorVirtualInfoNotFound: "未找到虚拟赛信息"
	},
	tip: {
		tipInitializing: "初始化中......",
		tipContestNotStarted: "比赛仍未开始。",
		tipHaveARest: "深呼吸，放松一下。",
		tipContestStartIn: "比赛将在 {0} 后开始。",
		tipLoading: "加载中......",
		tipCalculatingRankGraph: "加载排名图像中",
		tipNoSubmissionFound: "未找到提交记录",
		tipFetchingStandings: "获取排行榜信息......",
		tipFetchingHacks: "获取 hack 记录......",
		tipVirtualTime: "输入 'auto' 以获取最近的<span class='red'>提交至少一次的</span>虚拟赛时间。"
	},
	settings: {
		fontFamily: [
			"字体",
			"使用逗号进行字体名字分割。使用等宽字体会打开更好的效果。"
		],
		timeLimit: [
			"加载时间限制",
			"加载信息时的时间限制。大时间限制将用于比赛排行榜和 Rating 变化量。"
		],
		reloadTime: [
			"信息获取间隔",
			"比赛时获取必要信息的时间间隔。"
		],
		smallReloadTime: [
			"重新加载时间",
			"在重要信息没有加载成功后的等待时间。"
		],
		mainURL: [
			"主页地址",
			"打开 Codeforces 链接使用的主页地址。"
		],
		predictorURL: [
			"预测器地址",
			"获取比赛 Rating 变化的地址。"
		],
		openStandings: [
			"打开排行榜获取",
			"选择何时进行排行榜和 hack 的获取。<span class='red'>因为获取的信息量会很大，所以三思而后行。</span>"
		],
		standingsLoadingGap: [
			"排行榜获取间隔",
			"比赛时获取排行榜的时间间隔。"
		],
		openRankPredict: [
			"打开历史排名计算器",
			"选择何时打开历史排名计算器。<span class='red'>需要排行榜信息。</span>"
		],
		problemSubmissionDirection: [
			"评测记录顺序",
			"每一道题目的评测记录显示顺序。"
		],
		problemEventDirection: [
			"事件顺序",
			"比赛的时间显示顺序。"
		],
		language: [
			"语言",
			"语言无需重启即可更换。"
		],
		styleSelection: [
			"样式",
			"选择你喜欢的样式。"
		],
		virtualFilter: [
			"打开虚拟赛过滤",
			"选择历史排名计算器如何处理虚拟赛数据。打开此设置以去除它们。"
		]
	}
};
var settingsFunctions = {
	language: {
		initial: function(){
			var i = settings.language;
			var idx;
			for(var q=0; q<lang_attr.length; q++)
				if(lang_attr[q] == i)	idx = q;
			return [lang_list[idx], idx!=0, idx!=lang_attr.length-1];
		},
		next: function(){
			var i = settings.language;
			var idx;
			for(var q=0; q<lang_attr.length; q++)
				if(lang_attr[q] == i)	idx = q;
			++idx;
			settings.language = lang_attr[idx];
			initLanguage();saveSettings();
			return [lang_list[idx], idx!=0, idx!=lang_attr.length-1];
		},
		previous: function(){
			var i = settings.language;
			var idx;
			for(var q=0; q<lang_attr.length; q++)
				if(lang_attr[q] == i)	idx = q;
			--idx;
			settings.language = lang_attr[idx];
			initLanguage(); saveSettings();
			return [lang_list[idx], idx!=0, idx!=lang_attr.length-1];
		}
	},
	timeLimit: {
		initial: function(){
			return [getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 30000];
		},
		next: function(){
			settings.smallTimeLimit += 10000;
			settings.largeTimeLimit += 30000;
			saveSettings();
			return [getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 30000];
		},
		previous: function(){
			settings.smallTimeLimit -= 10000;
			settings.largeTimeLimit -= 30000;
			saveSettings();
			return [getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 30000];
		}
	},
	reloadTime: {
		initial: function(){
			return [getTimeLength3(settings.reloadTime), settings.reloadTime != 30000, settings.reloadTime != 90000];
		},
		next: function(){
			settings.reloadTime += 30000;
			saveSettings();
			return [getTimeLength3(settings.reloadTime), settings.reloadTime != 30000, settings.reloadTime != 90000];
		},
		previous: function(){
			settings.reloadTime -= 30000;
			saveSettings();
			return [getTimeLength3(settings.reloadTime), settings.reloadTime != 30000, settings.reloadTime != 90000];
		}
	},
	standingsLoadingGap: {
		initial: function(){
			return [getTimeLength3(settings.standingsLoadingGap), settings.standingsLoadingGap != 30000, settings.standingsLoadingGap != 240000];
		},
		next: function(){
			settings.standingsLoadingGap *= 2;
			saveSettings();
			return [getTimeLength3(settings.standingsLoadingGap), settings.standingsLoadingGap != 30000, settings.standingsLoadingGap != 240000];
		},
		previous: function(){
			settings.standingsLoadingGap /= 2;
			saveSettings();
			return [getTimeLength3(settings.standingsLoadingGap), settings.standingsLoadingGap != 30000, settings.standingsLoadingGap != 240000];
		}
	},
	smallReloadTime: {
		initial: function(){
			return [getTimeLength3(settings.smallReloadTime), settings.smallReloadTime != 5000, settings.smallReloadTime != 20000];
		},
		next: function(){
			settings.smallReloadTime *= 2;
			saveSettings();
			return [getTimeLength3(settings.smallReloadTime), settings.smallReloadTime != 5000, settings.smallReloadTime != 20000];
		},
		previous: function(){
			settings.smallReloadTime /= 2;
			saveSettings();
			return [getTimeLength3(settings.smallReloadTime), settings.smallReloadTime != 5000, settings.smallReloadTime != 20000];
		}
	},
	openStandings: {
		initial: function(){
			return [localize(openStandingsSelection[settings.openStandings]), settings.openStandings != 0, settings.openStandings != 2];
		},
		previous: function(){
			--settings.openStandings;
			saveSettings();
			return [localize(openStandingsSelection[settings.openStandings]), settings.openStandings != 0, settings.openStandings != 2];
		},
		next: function(){
			++settings.openStandings;
			saveSettings();
			return [localize(openStandingsSelection[settings.openStandings]), settings.openStandings != 0, settings.openStandings != 2];
		}
	},
	openRankPredict: {
		initial: function(){
			return [localize(openRankPredictorSelection[settings.openRankPredict]), settings.openRankPredict != 0, settings.openRankPredict != 2];
		},
		previous: function(){
			--settings.openRankPredict;
			saveSettings();
			return [localize(openRankPredictorSelection[settings.openRankPredict]), settings.openRankPredict != 0, settings.openRankPredict != 2];
		},
		next: function(){
			++settings.openRankPredict;
			saveSettings();
			return [localize(openRankPredictorSelection[settings.openRankPredict]), settings.openRankPredict != 0, settings.openRankPredict != 2];
		}
	},
	openUnofficialRankPredict: {
		initial: function(){
			return settings.openUnofficialRankPredict;
		},
		change: function(){
			settings.openUnofficialRankPredict = !settings.openUnofficialRankPredict;
			saveSettings(); return settings.openUnofficialRankPredict;
		}
	},
	mainURL: {
		initial: function(){
			return settings.mainURL;
		},
		change: function(str){
			settings.mainURL = str;
			saveSettings();
		}
	},
	predictorURL: {
		initial: function(){
			return settings.predictorURL;
		},
		change: function(str){
			settings.predictorURL = str;
			saveSettings();
		}
	},
	problemSubmissionDirection: {
		initial: function(){
			return [localize(settings.problemSubmissionDirection), true, true];
		},
		next: function(){
			if(settings.problemSubmissionDirection == "Ascending")
				settings.problemSubmissionDirection = "Descending";
			else
				settings.problemSubmissionDirection = "Ascending";
			saveSettings();
			return [localize(settings.problemSubmissionDirection), true, true];
		},
		previous: function(){
			if(settings.problemSubmissionDirection == "Ascending")
				settings.problemSubmissionDirection = "Descending";
			else
				settings.problemSubmissionDirection = "Ascending";
			saveSettings();
			return [localize(settings.problemSubmissionDirection), true, true];
		}
	},
	problemEventDirection: {
		initial: function(){
			return [localize(settings.problemEventDirection), true, true];
		},
		next: function(){
			if(settings.problemEventDirection == "Ascending")
				settings.problemEventDirection = "Descending";
			else
				settings.problemEventDirection = "Ascending";
			saveSettings();
			return [localize(settings.problemEventDirection), true, true];
		},
		previous: function(){
			if(settings.problemEventDirection == "Ascending")
				settings.problemEventDirection = "Descending";
			else
				settings.problemEventDirection = "Ascending";
			saveSettings();
			return [localize(settings.problemEventDirection), true, true];
		}
	},
	fontFamily: {
		initial: function(){
			if(settings.fontFamily != "")
				document.documentElement.style.setProperty("--font-family", settings.fontFamily);
			else
				document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
			if(contestNewWinLoaded){
				if(settings.fontFamily != "")
					contestNewWin.window.document.documentElement.style.setProperty("--font-family", settings.fontFamily);
				else
					contestNewWin.window.document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
			}
			return settings.fontFamily;
		},
		change: function(str){
			str = $.trim(str);
			settings.fontFamily = str;
			saveSettings();
			if(str != "")
				document.documentElement.style.setProperty("--font-family", str);
			else
				document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
			if(contestNewWinLoaded){
				if(str != "")
					contestNewWin.window.document.documentElement.style.setProperty("--font-family", str);
				else
					contestNewWin.window.document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
			}
		}
	},
	styleSelection: {
		initial: function(){
			return [localize(styleSelectionList[settings.styleSelection]), true, true];
		},
		previous: function(){
			--settings.styleSelection;
			if(settings.styleSelection == -1)
				settings.styleSelection = 2;
			initStyle(); saveSettings();
			return [localize(styleSelectionList[settings.styleSelection]), true, true];
		},
		next: function(){
			++settings.styleSelection;
			if(settings.styleSelection == 3)
				settings.styleSelection = 0;
			initStyle(); saveSettings();
			return [localize(styleSelectionList[settings.styleSelection]), true, true];
		},
	},
	virtualFilter: {
		initial: function(){
			return settings.virtualFilter;
		},
		change: function(){
			settings.virtualFilter = !settings.virtualFilter;
			saveSettings();
			return settings.virtualFilter;
		}
	}
};
String.prototype.format = function() {
	for (var a = this, b = 0; b < arguments.length; b++)
		a = a.replace(RegExp("\\{" + (b) + "\\}", "ig"), arguments[b]);
	return a;
};
var currentDefaultSettings = {
	language: "en",
	smallTimeLimit: 10000,
	largeTimeLimit: 30000,
	reloadTime: 30000,
	smallReloadTime: 5000,
	standingsLoadingGap: 120000,
	openRankPredict: 2,
	openStandings: 1,
	mainURL: "https://codeforces.com",
	predictorURL: "https://cf-predictor-frontend.codeforces.ml/GetNextRatingServlet",
	problemSubmissionDirection: "Descending",
	problemEventDirection: "Ascending",
	fontFamily: "",
	styleSelection: 0,
	virtualFilter: true,
};
function setAsDefault(){
	if(settings == undefined)
		settings = currentDefaultSettings;
	else{
		var L = settings.language;
		var D = settings.styleSelection;
		var F = settings.fontFamily;
		if(L == undefined)	L = currentDefaultSettings.language;
		if(D == undefined)	D = currentDefaultSettings.styleSelection;
		if(F == undefined)	F = currentDefaultSettings.fontFamily;
		settings = JSON.parse(JSON.stringify(currentDefaultSettings));
		settings.language = L;
		settings.styleSelection = D;
		settings.fontFamily = F;
	}
	saveSettings();
	initSettingsPage();
	initLanguage();
	initStyle();
}
function getLanguage(lang){
	if(lang == "en")	return lang_en;
	if(lang == "zh_cn")	return lang_zh;
	return lang_en;
}
function initLanguage(){
	if(settings == undefined)
		languageOption = getLanguage(currentDefaultSettings.language);
	else
		languageOption = getLanguage(settings.language);
	for(var name in languageOption.general)
		if(languageOption.general.hasOwnProperty(name)){
			if(languageOption.general[name].format("") != languageOption.general[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.general[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.general[name]);
		}
	for(var name in languageOption.error)
		if(languageOption.error.hasOwnProperty(name)){
			if(languageOption.error[name].format("") != languageOption.error[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.error[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.error[name]);
		}
	for(var name in languageOption.input)
		if(languageOption.input.hasOwnProperty(name))
			$(`[info=${name}]`).attr("placeholder", languageOption.input[name]);
	for(var name in languageOption.tip)
		if(languageOption.tip.hasOwnProperty(name)){
			if(languageOption.tip[name].format("") != languageOption.tip[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.tip[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.tip[name]);
		}
	for(var name in languageOption.settings)
		if(languageOption.settings.hasOwnProperty(name)){
			$(`.settingsUI[for=${name}] > div:first-child > div:first-child`).html(languageOption.settings[name][0]);
			$(`.settingsUI[for=${name}] > div:first-child > div:last-child`).html(languageOption.settings[name][1]);
		}
	if(contestNewWinOpened){
		for(var name in languageOption.general)
			if(languageOption.general.hasOwnProperty(name)){
				if(languageOption.general[name].format("") != languageOption.general[name] && $(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.general[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.general[name]);
			}
		for(var name in languageOption.error)
			if(languageOption.error.hasOwnProperty(name)){
				if(languageOption.error[name].format("") != languageOption.error[name] && $(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.error[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.error[name]);
			}
		for(var name in languageOption.input)
			if(languageOption.input.hasOwnProperty(name))
				contestNewWinJQ.find(`[info=${name}]`).attr("placeholder", languageOption.input[name]);
		for(var name in languageOption.tip)
			if(languageOption.tip.hasOwnProperty(name)){
				if(languageOption.tip[name].format("") != languageOption.tip[name] && $(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.tip[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.tip[name]);
			}
	}
}
initLanguage();
if(settings == undefined)	settings = {};
else
	settings = JSON.parse(settings);
if(Object.keys(settings).length != Object.keys(currentDefaultSettings).length)
	setAsDefault();
saveSettings();
initLanguage();
var languageOption;
function initStyle(){
	if(settings.styleSelection == 2){
		if(!DarkMode)	ChangeTheme();
	}
	else if(settings.styleSelection == 1){
		if(DarkMode)	ChangeTheme();
	}
	else{
		if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
			if(window.matchMedia('(prefers-color-scheme: dark)').matches){
				if(!DarkMode)	ChangeTheme();
			}
			else if(DarkMode)	ChangeTheme();
		}
	}
	if(contestNewWinLoaded)
		contestNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/contest/dark.css" : "./css/contest/default.css");
	if(contestRankInfo == undefined || contestRankInfo[contestRankChosen].length == 0)	return;
	if(contestCalculatingRank[contestRankChosen])
		$("#singleRankGraphContainer").html(`<div class="loadingInterface"><div><i class="fas fa-calculator"></i><span class="popTip" info="tipCalculatingRankGraph">${languageOption.tip.tipCalculatingRankGraph}</span></div></div>`);
	else generateRankGraph(contestRankInfo[contestRankChosen]);
}
function localize(x){
	return `<span info="${x}">${languageOption.general[x]}</span>`;
}

function initSettingsPage(){
	$(".settingsRadio").each(function(){
		var t = settingsFunctions[$(this).attr("for")].initial();
		if(t)	$(this).addClass("selected");
		else
			$(this).removeClass("selected");
	})
	$(".settingsSelect").each(function(){
		var t = settingsFunctions[$(this).attr("for")].initial();
		if(!t[1])	$(this).find(".settingsSelectPartLeft").addClass("closed");
		else
			$(this).find(".settingsSelectPartLeft").removeClass("closed");
		if(!t[2])	$(this).find(".settingsSelectPartRight").addClass("closed");
		else
			$(this).find(".settingsSelectPartRight").removeClass("closed");
		$(this).find(".settingsSelectPartContent").html(t[0]);
	})
	$(".settingsInput").each(function(){
		var t = settingsFunctions[$(this).attr("for")].initial();
		$(this).find(".settingsInputPartContent").val(t);
	})
}
initSettingsPage();


$(".settingsRadioButton").click(function(){
	var t = settingsFunctions[$(this).parent().attr("for")].change();
	if(t)	$(this).parent().addClass("selected");
	else
		$(this).parent().removeClass("selected");
})
$(".settingsSelectPartLeft").click(function(){
	var t = settingsFunctions[$(this).parent().parent().attr("for")].initial();
	if(!t[1])	return;
	t = settingsFunctions[$(this).parent().parent().attr("for")].previous();
	if(!t[1])	$(this).parent().find(".settingsSelectPartLeft").addClass("closed");
	else
		$(this).parent().find(".settingsSelectPartLeft").removeClass("closed");
	if(!t[2])	$(this).parent().find(".settingsSelectPartRight").addClass("closed");
	else
		$(this).parent().find(".settingsSelectPartRight").removeClass("closed");
	$(this).parent().find(".settingsSelectPartContent").html(t[0]);
})
$(".settingsSelectPartRight").click(function(){
	var t = settingsFunctions[$(this).parent().parent().attr("for")].initial();
	if(!t[2])	return;
	t = settingsFunctions[$(this).parent().parent().attr("for")].next();
	if(!t[1])	$(this).parent().find(".settingsSelectPartLeft").addClass("closed");
	else
		$(this).parent().find(".settingsSelectPartLeft").removeClass("closed");
	if(!t[2])	$(this).parent().find(".settingsSelectPartRight").addClass("closed");
	else
		$(this).parent().find(".settingsSelectPartRight").removeClass("closed");
	$(this).parent().find(".settingsSelectPartContent").html(t[0]);
})
$(".settingsInputPartContent").blur(function(){
	var q = $(this).val();
	settingsFunctions[$(this).parent().parent().attr("for")].change(q);
})
























function allHtmlSpecialChars(text){
	var map = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  '\'': '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
function toMemoryInfo(limit){  
	var size = "";
	if( limit < 0.1 * 1024 ) 
		size = limit.toFixed(2) + "B";	
	else if(limit < 0.1 * 1024 * 1024 )
		size = (limit / 1024).toFixed(2) + "KB";			  
	else if(limit < 0.1 * 1024 * 1024 * 1024)
		size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
	else
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
	var sizestr = size + "";
	var len = sizestr.indexOf("\.");
	var dec = sizestr.substr(len + 1, 2);
	if(dec == "00") 
		return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
	return sizestr;  
}
function toSubmissionMemoryInfo(limit){  
	var size = "";
	if( limit < 1024 ) 
		size = limit.toFixed(0) + "B";	
	else if(limit < 1024 * 1024 )
		size = (limit / 1024).toFixed(0) + "KB";			  
	else if(limit < 1024 * 1024 * 1024)
		size = (limit / (1024 * 1024)).toFixed(0) + "MB";  
	else
		size = (limit / (1024 * 1024 * 1024)).toFixed(0) + "GB";  
	var sizestr = size + "";
	return sizestr;  
}
Date.prototype.pattern = function(format) {
	var date = {
		"y+": this.getYear(),
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
			  ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}
function getTimeLength(x){
	x = Math.floor(x / 1000 / 60);
	var ret = "";
	var p = x % 60;
	ret = ''+Math.floor(p/10)+p%10;
	x = Math.floor(x/60);
	var p = x % 24;
	ret = ''+Math.floor(p/10)+p%10+':'+ret;
	x = Math.floor(x/24);
	if(x!=0)	ret=''+x+':'+ret;
	return ret;
}
function getTimeLength2(x){
	x = Math.floor(x / 1000);
	var ret = "";
	var p = x % 60;
	ret = ''+Math.floor(p/10)+p%10;
	x = Math.floor(x/60);
	var p = x % 60;
	ret = ''+Math.floor(p/10)+p%10+':'+ret;
	x = Math.floor(x/60);
	var p = x % 24;
	ret = ''+Math.floor(p/10)+p%10+':'+ret;
	x = Math.floor(x/24);
	if(x!=0)	ret=''+x+'d '+ret;
	return ret;
}
function getTimeLength3(x){
	x = Math.floor(x / 1000);
	var ret = "";
	var p = x % 60;
	if(p != 0)	ret = ''+p+'s';
	x = Math.floor(x/60);
	var p = x % 60;
	if(p != 0)	ret = ''+p+'m'+ret;
	x = Math.floor(x/60);
	var p = x % 24;
	if(p != 0)	ret = ''+p+'h'+ret;
	x = Math.floor(x/24);
	if(x!=0)	ret=''+x+'d'+ret;
	return ret;
}
function toSmallInfo(x){
	if(x==undefined)	return "";
	if(x == "OK")	return "AC";
	if(x == "FAILED")	return "FAIL";
	if(x == "PARTIAL")	return "PRT";
	if(x == "COMPILATION_ERROR")	return "CE";
	if(x == "RUNTIME_ERROR")	return "RE";
	if(x == "WRONG_ANSWER")	return "WA";
	if(x == "PRESENTATION_ERROR")	return "PE";
	if(x == "TIME_LIMIT_EXCEEDED")	return "TLE";
	if(x == "MEMORY_LIMIT_EXCEEDED")	return "MLE";
	if(x == "IDLENESS_LIMIT_EXCEEDED")	return "ILE";
	if(x == "SECURITY_VIOLATED")	return "SV";
	if(x == "CRASHED")	return "CRS";
	if(x == "INPUT_PREPARATION_CRASHED")	return "IPC";
	if(x == "CHALLENGED")	return "CHL";
	if(x == "SKIPPED")	return "SKP";
	if(x == "TESTING")	return "TST";
	if(x == "REJECTED")	return "REJ";
	return "";
}
function judgeToClass(x){
	if(x == "OK")	return "successColor";
	if(x == "COMPILATION_ERROR")	return "warningColor";
	if(x == "TESTING")	return "loadingColor";
	if(x == "PARTIAL")	return "warningColor";
	return "dangerColor";
}
function getSubmissionIcon(x){
	if(x == "OK")	return `<span class="fa fa-check"></span>`;
	if(x == "FAILED")	return `<span class="fa fa-server"></span>`;
	if(x == "PARTIAL")	return `<span class="fa fa-percent"></span>`;
	if(x == "COMPILATION_ERROR")	return `<span class="fa fa-code"></span>`;
	if(x == "RUNTIME_ERROR")	return `<span class="fa fa-bomb"></span>`;
	if(x == "WRONG_ANSWER")	return `<span class="fa fa-times"></span>`;
	if(x == "PRESENTATION_ERROR")	return `<span class="fa fa-print"></span>`;
	if(x == "TIME_LIMIT_EXCEEDED")	return `<span class="fa fa-clock"></span>`;
	if(x == "MEMORY_LIMIT_EXCEEDED")	return `<span class="fa fa-microchip"></span>`;
	if(x == "IDLENESS_LIMIT_EXCEEDED")	return `<span class="fa fa-align-left"></span>`;
	if(x == "SECURITY_VIOLATED")	return `<span class="fa fa-ban style_error"></span>`;
	if(x == "CRASHED")	return `<span class="fa fa-chain-broken"></span>`;
	if(x == "INPUT_PREPARATION_CRASHED")	return `<span class="fa fa-sign-in"></span>`;
	if(x == "CHALLENGED")	return `<span class="fa fa-user-secret"></span>`;
	if(x == "SKIPPED")	return `<span class="fa fa-forward"></span>`;
	if(x == "TESTING")	return `<span class="fa fa-hourglass-2"></span>`;
	if(x == "REJECTED")	return `<span class="fa fa-exclamation-triangle"></span>`;
}
function toSmallTestset(x){
	if(x == "SAMPLES")	return "SAMP";
	if(x == "PRETESTS")	return "PRET";
	if(x == "TESTS")	return "MAIN";
	if(x == "CHALLENGES")	return "HACK";
	return "TEST";
}
