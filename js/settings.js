var contestRanks = [0, 0], contestRankLast = [0, 0], contestRankInfo = [[], []], contestCalculatingRank = [false, false], contestRankChosen = 0;
var contestNewWinJQ, contestNewWin, contestNewWinOpened = false, contestNewWinLoaded = false;
var problemNewWinOpened = false, problemNewWin, problemNewWinJQ, submitCodeAreaController, problemNewWinLoaded;
var watchNewWinOpened = false, watchNewWin, watchNewWinJQ, watchNewWinLoaded;
var singleAnnouncementLength = -1;
var openStandingsSelection = ["Disabled", "Div1Only", "Enabled"];
var openRankPredictorSelection = ["Disabled", "RatedOnly", "Enabled"];
var styleSelectionList = ["System", "Light", "Dark"];
var currentLoginHandle = "";
var contestRatingChangesHook = null;
var contestEnterInPage = false;
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

var getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};

var settings = localStorage.getItem("CCH_Settings");
var submissionLangs = localStorage.getItem("CCH_Languages");
if(submissionLangs == undefined)
	submissionLangs = JSON.stringify(Langs);
localStorage.setItem("CCH_Languages", submissionLangs);
submissionLangs = JSON.parse(submissionLangs);
function saveSettings(){
	initFonts();
	localStorage.setItem("CCH_Settings", JSON.stringify(settings));
	localStorage.setItem("CCH_Languages", JSON.stringify(submissionLangs));
	if(contestNewWinLoaded)
		contestNewWinJQ.append(`<script>reloadSettings()</script>`);
	if(problemNewWinLoaded)
		problemNewWinJQ.append(`<script>reloadSettings()</script>`);
}
function openURL(x){
	if(RunInNwjs)
		nw.Shell.openExternal(x);
	else
		window.open(x);
}
var settingsFunctions = {
	accountHandleOrEmail: {
		initial: function(){return ""},
		change: function(){return ""}
	},
	accountPassword: {
		initial: function(){return ""},
		change: function(){return ""}
	},
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
			return [settings.smallTimeLimit == 1145141919 ? localize("unlimited") : getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 1145141919];
		},
		next: function(){
			if(settings.smallTimeLimit == 30000)
				settings.smallTimeLimit = settings.largeTimeLimit = 1145141919;
			else{
				settings.smallTimeLimit += 10000;
				settings.largeTimeLimit += 30000;
			}
			saveSettings();
			return [settings.smallTimeLimit == 1145141919 ? localize("unlimited") : getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 1145141919];
		},
		previous: function(){
			if(settings.smallTimeLimit == 1145141919){
				settings.smallTimeLimit = 30000;
				settings.largeTimeLimit = 90000;
			}
			else{
				settings.smallTimeLimit -= 10000;
				settings.largeTimeLimit -= 30000;
			}
			saveSettings();
			return [settings.smallTimeLimit == 1145141919 ? localize("unlimited") : getTimeLength3(settings.smallTimeLimit) + ' - ' + getTimeLength3(settings.largeTimeLimit), settings.smallTimeLimit != 10000, settings.smallTimeLimit != 1145141919];
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
			var rld = (settings.mainURL != str);
			settings.mainURL = str;
			saveSettings();
			if(rld && RunInNwjs)
				loadLoginType();
		}
	},
	codeforcesApiUrl: {
		initial: function(){
			return settings.codeforcesApiUrl;
		},
		change: function(str){
			settings.codeforcesApiUrl = str;
			saveSettings();
		}
	},
	transformPort: {
		initial: function(){
			return settings.transformPort;
		},
		change: function(str){
			settings.transformPort = str;
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
			return settings.fontFamily;
		},
		change: function(str){
			str = $.trim(str);
			settings.fontFamily = str;
			saveSettings();
		}
	},
	statementFontFamily: {
		initial: function(){
			return settings.statementFontFamily;
		},
		change: function(str){
			str = $.trim(str);
			settings.statementFontFamily = str;
			saveSettings();
		}
	},	
	editorFontFamily: {
		initial: function(){
			return settings.editorFontFamily;
		},
		change: function(str){
			str = $.trim(str);
			settings.editorFontFamily = str;
			saveSettings();
		}
	},
	apiKey: {
		initial: function(){
			return settings.apiKey;
		},
		change: function(str){
			str = $.trim(str);
			settings.apiKey = str;
			saveSettings();
		}
	},
	apiSecret: {
		initial: function(){
			return settings.apiSecret;
		},
		change: function(str){
			str = $.trim(str);
			settings.apiSecret = str;
			saveSettings();
		}
	},
	editorFontSize: {
		initial: function(){
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 32];
		},
		previous: function(){
			--settings.editorFontSize;
			initStyle(); saveSettings();
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 32];
		},
		next: function(){
			++settings.editorFontSize;
			initStyle(); saveSettings();
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 32];
		},
	},
	statementFontSize: {
		initial: function(){
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 32];
		},
		previous: function(){
			--settings.statementFontSize;
			initStyle(); saveSettings();
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 32];
		},
		next: function(){
			++settings.statementFontSize;
			initStyle(); saveSettings();
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 32];
		},
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
	statementDefaultLanguage: {
		initial: function(){
			return [submissionLangs, settings.statementDefaultLanguage];
		},
		change: function(x){
			settings.statementDefaultLanguage = x;
			saveSettings();
			return [submissionLangs, settings.statementDefaultLanguage];
		}
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
	},
	openProblems: {
		initial: function(){
			return settings.openProblems;
		},
		change: function(){
			settings.openProblems = !settings.openProblems;
			saveSettings();
			return settings.openProblems;
		}
	},
	openNotification: {
		initial: function(){
			return settings.openNotification;
		},
		change: function(){
			settings.openNotification = !settings.openNotification;
			saveSettings();
			return settings.openNotification;
		}
	},
	useApiKeys: {
		initial: function(){
			return settings.useApiKeys;
		},
		change: function(){
			settings.useApiKeys = !settings.useApiKeys;
			saveSettings();
			return settings.useApiKeys;
		}
	},
	showProblemStatus: {
		initial: function(){
			return settings.showProblemStatus;
		},
		change: function(){
			settings.showProblemStatus = !settings.showProblemStatus;
			saveSettings();
			return settings.showProblemStatus;
		}
	},
	headBackOption: {
		initial: function(){
			var q = $("[info=singleHeadBack]");
			q.attr("info", "singleHeadBack" + (settings.headBackOption));
			q.html(languageOption.general["singleHeadBack" + (settings.headBackOption)]);
			return [localize("singleHeadBackOptions" + (settings.headBackOption)), true, true];
		},
		previous: function(){
			var q = $(`[info=singleHeadBack${settings.headBackOption}]`);
			settings.headBackOption = 1 - settings.headBackOption;
			q.attr("info", "singleHeadBack" + (settings.headBackOption));
			q.html(languageOption.general["singleHeadBack" + (settings.headBackOption)]);
			reinitSingleButton(); saveSettings();
			return [localize("singleHeadBackOptions" + (settings.headBackOption)), true, true];
		},
		next: function(){
			var q = $(`[info=singleHeadBack${settings.headBackOption}]`);
			settings.headBackOption = 1 - settings.headBackOption;
			q.attr("info", "singleHeadBack" + (settings.headBackOption));
			q.html(languageOption.general["singleHeadBack" + (settings.headBackOption)]);
			reinitSingleButton(); saveSettings();
			return [localize("singleHeadBackOptions" + (settings.headBackOption)), true, true];
		},
	}
};
String.prototype.format = function() {
	for (var a = this, b = 0; b < arguments[0].length; b++)
		a = a.replace(RegExp("\\{" + (b) + "\\}", "ig"), arguments[0][b]);
	return a;
};
var currentDefaultSettings = {
	language: "en",
	smallTimeLimit: 1145141919,
	largeTimeLimit: 1145141919,
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
	codeforcesApiUrl: "https://codeforces.com/api",
	showProblemStatus: true,
	editorFontFamily: "",
	editorFontSize: 16,
	statementFontFamily: "",
	openProblems: false,
	transformPort: "1327,4244,6174,10042,10043,10045,27121",
	statementFontSize: 16,
	statementDefaultLanguage: 50,
	openNotification: true,
	useApiKeys: false,
	apiKey: "",
	apiSecret: "",
	headBackOption: 0,
};
function setAsDefault(op){
	if(op == undefined)	op = false;
	if(Object.keys(settings).length == 0)
		settings = currentDefaultSettings;
	else if(op){
		var newSettings = {};
		for(var i in currentDefaultSettings){
			if(settings[i] == undefined)
				newSettings[i] = currentDefaultSettings[i];
			else
				newSettings[i] = settings[i];
		}
		settings = newSettings;
	}
	else{
		var L = settings.language;
		var D = settings.styleSelection;
		var F = settings.fontFamily;
		var E = settings.editorFontFamily;
		var S = settings.editorFontSize;
		var P = settings.statementFontFamily;
		var s = settings.statementDefaultLanguage;
		var A = settings.useApiKeys;
		var K = settings.apiKey;
		var _s = settings.apiSecret;
		if(L == undefined)	L = currentDefaultSettings.language;
		if(D == undefined)	D = currentDefaultSettings.styleSelection;
		if(F == undefined)	F = currentDefaultSettings.fontFamily;
		if(E == undefined)	E = currentDefaultSettings.editorFontFamily;
		if(S == undefined)	S = currentDefaultSettings.editorFontSize;
		if(P == undefined)	P = currentDefaultSettings.statementFontFamily;
		if(s == undefined)	s = currentDefaultSettings.statementDefaultLanguage
		if(A == undefined)	A = currentDefaultSettings.useApiKeys;
		if(K == undefined)	K = currentDefaultSettings.apiKey;
		if(_s == undefined)	_s = currentDefaultSettings.apiSecret;
		settings = JSON.parse(JSON.stringify(currentDefaultSettings));
		settings.language = L;
		settings.styleSelection = D;
		settings.fontFamily = F;
		settings.editorFontFamily = E;
		settings.editorFontSize = S;
		settings.statementFontFamily = P;
		settings.statementDefaultLanguage = s;
		settings.useApiKeys = A;
		settings.apiKey = K;
		settings.apiSecret = _s;
	}
	saveSettings();
	initSettingsPage();
	initLanguage();
	initStyle();
}
function initLanguage(){
	if(settings == undefined)
		languageOption = getLanguage(currentDefaultSettings.language);
	else
		languageOption = getLanguage(settings.language);
	for(var name in languageOption.general)
		if(languageOption.general.hasOwnProperty(name)){
			if(languageOption.general[name].format(["", "", ""]) != languageOption.general[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.general[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.general[name]);
		}
	for(var name in languageOption.error)
		if(languageOption.error.hasOwnProperty(name)){
			if(languageOption.error[name].format(["", "", ""]) != languageOption.error[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.error[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.error[name]);
		}
	for(var name in languageOption.phase)
		if(languageOption.phase.hasOwnProperty(name)){
			if(languageOption.phase[name].format(["", "", ""]) != languageOption.phase[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.phase[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.phase[name]);
		}
	for(var name in languageOption.input)
		if(languageOption.input.hasOwnProperty(name))
			$(`[info=${name}]`).attr("placeholder", languageOption.input[name]);
	for(var name in languageOption.tip)
		if(languageOption.tip.hasOwnProperty(name)){
			if(languageOption.tip[name].format(["", "", ""]) != languageOption.tip[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.tip[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.tip[name]);
		}
	for(var name in languageOption.modules)
		if(languageOption.modules.hasOwnProperty(name)){
			if(languageOption.modules[name].format(["", "", ""]) != languageOption.modules[name] && $(`[info=${name}]`).attr("argv") != undefined)
				$(`[info=${name}]`).each(function(){
					$(this).html(languageOption.modules[name].format(JSON.parse($(this).attr("argv"))));
				})
			else	$(`[info=${name}]`).html(languageOption.modules[name]);
		}
	for(var name in languageOption.settings)
		if(languageOption.settings.hasOwnProperty(name)){
			$(`.settingsUI[for=${name}] > div:first-child > div:first-child`).html(languageOption.settings[name][0]);
			$(`.settingsUI[for=${name}] > div:first-child > div:last-child`).html(languageOption.settings[name][1]);
		}
	if(contestNewWinLoaded){
		for(var name in languageOption.general)
			if(languageOption.general.hasOwnProperty(name)){
				if(languageOption.general[name].format(["", "", ""]) != languageOption.general[name] && contestNewWinJQ.find(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.general[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.general[name]);
			}
		for(var name in languageOption.error)
			if(languageOption.error.hasOwnProperty(name)){
				if(languageOption.error[name].format(["", "", ""]) != languageOption.error[name] && contestNewWinJQ.find(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.error[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.error[name]);
			}
		for(var name in languageOption.input)
			if(languageOption.input.hasOwnProperty(name))
				$(`[info=${name}]`).attr("placeholder", languageOption.input[name]);
		for(var name in languageOption.tip)
			if(languageOption.tip.hasOwnProperty(name)){
				if(languageOption.tip[name].format(["", "", ""]) != languageOption.tip[name] && contestNewWinJQ.find(`[info=${name}]`).attr("argv") != undefined)
					contestNewWinJQ.find(`[info=${name}]`).each(function(){
						$(this).html(languageOption.tip[name].format(JSON.parse($(this).attr("argv"))));
					})
				else	contestNewWinJQ.find(`[info=${name}]`).html(languageOption.tip[name]);
			}
		for(var name in languageOption.settings)
			if(languageOption.settings.hasOwnProperty(name)){
				$(`.settingsUI[for=${name}] > div:first-child > div:first-child`).html(languageOption.settings[name][0]);
				$(`.settingsUI[for=${name}] > div:first-child > div:last-child`).html(languageOption.settings[name][1]);
			}
	}
}
initLanguage();
if(settings == undefined)	settings = {};
else settings = JSON.parse(settings);
if(Object.keys(settings).length != Object.keys(currentDefaultSettings).length)
	setAsDefault(true);
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
		contestNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/dark.css" : "./css/default.css");
	if(problemNewWinLoaded)
		problemNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/dark.css" : "./css/default.css");
	if(contestRankInfo == undefined || contestRankInfo[contestRankChosen].length == 0)	return;
	if(contestCalculatingRank[contestRankChosen])
		$("#singleRankGraphContainer").html(`<div class="loadingInterface"><div><i class="fas fa-calculator"></i><span class="popTip" info="tipCalculatingRankGraph">${languageOption.tip.tipCalculatingRankGraph}</span></div></div>`);
	else generateRankGraph(contestRankInfo[contestRankChosen]);
}
function reloadSettings(){
	settings = JSON.parse(localStorage.getItem("CCH_Settings"));
	initFonts();
	initSettingsPage();
	initLanguage();
	initStyle();
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
	$(".settingsSelectBig").each(function(){
		var t = settingsFunctions[$(this).attr("for")].initial();
		$(this).find(".settingsSelectBigPartContent").html("");
		for(var name in t[0])
			if(t[0].hasOwnProperty(name))
				$(this).find(".settingsSelectBigPartContent").append(`<option value=${name}>${t[0][name]}</option>`)
		$(this).find(".settingsSelectBigPartContent").val(t[1]);
	})
	$(".settingsInput").each(function(){
		var t = settingsFunctions[$(this).attr("for")].initial();
		$(this).find(".settingsInputPartContent").val(t);
	})
}
initSettingsPage();
function initFonts(){
	document.documentElement.style.setProperty("--editor-font-size", settings.editorFontSize + "px");
	document.documentElement.style.setProperty("--statement-font-size", settings.statementFontSize + "px");
	if(settings.fontFamily != "")
		document.documentElement.style.setProperty("--font-family", settings.fontFamily);
	else
		document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono',monospace, sans-serif");
	if(settings.editorFontFamily != "")
		document.documentElement.style.setProperty("--editor-font-family", settings.editorFontFamily);
	else
		document.documentElement.style.setProperty("--editor-font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono',monospace, sans-serif");
	if(settings.statementFontFamily != "")
		document.documentElement.style.setProperty("--statement-font-family", settings.statementFontFamily);
	else
		document.documentElement.style.setProperty("--statement-font-family", "sans-serif");
}

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
	$(this).parent().find(".settingsSelectBigPartContent").html(t[0]);
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
	$(this).parent().find(".settingsSelectBigPartContent").html(t[0]);
})
$(".settingsInputPartContent").blur(function(){
	var q = $(this).val();
	settingsFunctions[$(this).parent().parent().attr("for")].change(q);
})
$(".settingsSelectBigPartContent").change(function(){
	var q = $(this).val();
	var t = settingsFunctions[$(this).parent().parent().attr("for")].change(q);
	$(".settingsSelectBigPartContent").html("");
	for(var name in t[0])
		if(t[0].hasOwnProperty(name))
			$(".settingsSelectBigPartContent").append(`<option value=${name}>${t[0][name]}</option>`)
	$(".settingsSelectBigPartContent").val(t[1]);
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
		size = limit.toFixed(0) + " B";	
	else if(limit < 1024 * 1024 )
		size = (limit / 1024).toFixed(0) + " KB";			  
	else if(limit < 1024 * 1024 * 1024)
		size = (limit / (1024 * 1024)).toFixed(0) + " MB";  
	else
		size = (limit / (1024 * 1024 * 1024)).toFixed(0) + " GB";  
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
	if(x == undefined || x == "")	return "INQ";
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
function toDetailedInfo(x, ptType){
	if(x == undefined || x == "" || x == null)	return languageOption.compile["IN_QUEUE"];
	if(x == "OK"){
		if(ptType == "PRETESTS")
			return languageOption.compile["PRETEST_PASSED"];
		return languageOption.compile["ACCEPTED"];
	}
	return languageOption.compile[x];
}
function judgeToClass(x){
	if(x == undefined || x == "")	return "loadingColor";
	if(x == "OK")	return "successColor";
	if(x == "COMPILATION_ERROR")	return "warningColor";
	if(x == "TESTING")	return "loadingColor";
	if(x == "PARTIAL")	return "warningColor";
	return "dangerColor";
}
function toSmallTestset(x){
	if(x == "SAMPLES")	return "SAMP";
	if(x == "PRETESTS")	return "PRET";
	if(x == "TESTS")	return "MAIN";
	if(x == "CHALLENGES")	return "HACK";
	return "TEST";
}
function toDetailedTestset(x){
	if(x == "SAMPLES")	return "samples";
	if(x == "PRETESTS")	return "pretests";
	if(x == "TESTS")	return "main tests";
	if(x == "CHALLENGES")	return "hack";
	return "testcase " + x.substring(5);
}
function allHtmlSpecialChars(text){
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
function checkHandles(list, name){
	for(var i=0; i<list.length; i++){
		var p = list[i];
		if(p.handle == name)	return true;
	}
	return false;
}
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
		if((i < q || i > p) && !(/[0-9]/.test(x[i])))
			return [-1, -1];
	if(x.substring(q).length > 2)
		return [-1, -1];
	return [x.substring(0, q), x.substring(q)];
}
function getContestType(x){
	if(x.indexOf("Div. 1 + Div. 2") >= 0)	return "Div. 1+2";
	if(x.indexOf("Rated for Div. 2") >= 0)	return "Rated for Div. 2";
	for(var i=1; i<=4; i++)
		if(x.indexOf("Div. " + i) >= 0)	return "Div. " + i;
	return undefined;
}
function getLimitedContestType(x){
	if(x.indexOf("Div. 1 + Div. 2") >= 0)	return "Div1+2";
	if(x.indexOf("Rated for Div. 2") >= 0)	return "RDiv2";
	for(var i=1; i<=4; i++)
		if(x.indexOf("Div. " + i) >= 0)	return "Div" + i;
	return "nType";
}
function getOpResult(op, x, y){
	if(op == "<")	return x < y;
	if(op == ">")	return x > y;
	if(op == "<=")	return x <= y;
	if(op == ">=")	return x >= y;
	if(op == "=")	return x == y;
	return x != y;
}
$(".singleContestTypeSelector > div > div > .remainSinglePart > .bigInputArea > input")
	.bind('keydown',function(event){
    if(event.keyCode == "13"){
    	var t = $(this).parent().next();
    	if(t.hasClass("bigInputArea")){
    		t.find("input").focus();
    		t.find("input").select();
    	}
    	else{
    		t.parent().find(".bigButton").click();
    	}
    }
});
$(".settingsUI[for=accountHandleOrEmail] input")
	.bind('keydown',function(event){
    if(event.keyCode == "13"){
    	var t = $(".settingsUI[for=accountPassword] input")
    	t.focus(); t.select();
    }
});
$(".settingsUI[for=accountPassword] input")
	.bind('keydown',function(event){
    if(event.keyCode == "13"){
    	submitLogin();
    }
});
function ratingToClass(x){
	if(x == undefined)	return "user-unrated";
	if(x <= 0)	return "user-unrated";
	if(x < 1200)	return "user-newbie";
	if(x < 1400)	return "user-pupil";
	if(x < 1600)	return "user-specialist";
	if(x < 1900)	return "user-expert";
	if(x < 2100)	return "user-cmaster";
	if(x < 2300)	return "user-master";
	if(x < 2400)	return "user-imaster";
	if(x < 2600)	return "user-grandmaster";
	if(x < 3000)	return "user-igramdmaster";
	return "user-legendary";
}
function ratingToSmalln(x){
	if(x == undefined)	return "U";
	if(x <= 0)	return "U";
	if(x < 1200)	return "N";
	if(x < 1400)	return "P";
	if(x < 1600)	return "S";
	if(x < 1900)	return "E";
	if(x < 2100)	return "CM";
	if(x < 2300)	return "M";
	if(x < 2400)	return "IM";
	if(x < 2600)	return "GM";
	if(x < 3000)	return "IGM";
	return "LGM";
}
function ratingToGrade(x){
	if(x == undefined)	return "Unrated";
	if(x <= 0)	return "Unrated";
	if(x < 1200)	return "Newbie";
	if(x < 1400)	return "Pupil";
	if(x < 1600)	return "Specialist";
	if(x < 1900)	return "Expert";
	if(x < 2100)	return "Candidate Master";
	if(x < 2300)	return "Master";
	if(x < 2400)	return "International Master";
	if(x < 2600)	return "Grandmaster";
	if(x < 3000)	return "International Grandmaster";
	return "Legendary Grandmaster";
}
function getSubmissionIcon(x){
	if(x == "OK")	return `<span class="fa fa-check green"></span>`;
	if(x == "FAILED")	return `<span class="fa fa-server" style="color:rgb(175, 168, 158)"></span>`;
	if(x == "PARTIAL")	return `<span class="fa fa-percent" style="color:rgb(74, 254, 246)"></span>`;
	if(x == "COMPILATION_ERROR")	return `<span class="fa fa-code" style="color:#a1a54f"></span>`;
	if(x == "RUNTIME_ERROR")	return `<span class="fa fa-bomb" style="color:rgb(191, 63, 255);"></span>`;
	if(x == "WRONG_ANSWER")	return `<span class="fa fa-times red"></span>`;
	if(x == "PRESENTATION_ERROR")	return `<span class="fa fa-print" style="color:#ca7d3c;"></span>`;
	if(x == "TIME_LIMIT_EXCEEDED")	return `<span class="fa fa-clock" style="color:#ca7d3c;"></span>`;
	if(x == "MEMORY_LIMIT_EXCEEDED")	return `<span class="fa fa-microchip" style="color:#ca7d3c;"></span>`;
	if(x == "IDLENESS_LIMIT_EXCEEDED")	return `<span class="fa fa-align-left" style="color:#ca7d3c;"></span>`;
	if(x == "SECURITY_VIOLATED")	return `<span class="fa fa-ban red"></span>`;
	if(x == "CRASHED")	return `<span class="fa fa-chain-broken" style="color:#ca7d3c;"></span>`;
	if(x == "INPUT_PREPARATION_CRASHED")	return `<span class="fa fa-sign-in" style="color:#ca7d3c;"></span>`;
	if(x == "CHALLENGED")	return `<span class="fa fa-user-secret" style="color:rgb(175, 168, 158)"></span>`;
	if(x == "SKIPPED")	return `<span class="fa fa-forward" style="color:rgb(110, 149, 210);"></span>`;
	if(x == "TESTING")	return `<span class="fa fa-hourglass-2" style="color:rgb(110, 149, 210)"></span>`;
	if(x == "REJECTED")	return `<span class="fa fa-exclamation-triangle" style="color:#decb29"></span>`;
}
function toColoredSubmissionInfo(x){
	if(x == "OK")	return `<span class="green" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "FAILED")	return `<span style="color:rgb(175, 168, 158)" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "PARTIAL")	return `<span style="color:rgb(74, 254, 246)" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "COMPILATION_ERROR")	return `<span style="color:#a1a54f" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "RUNTIME_ERROR")	return `<span style="color:rgb(191, 63, 255);" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "WRONG_ANSWER")	return `<span class="red" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "PRESENTATION_ERROR")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "TIME_LIMIT_EXCEEDED")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "MEMORY_LIMIT_EXCEEDED")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "IDLENESS_LIMIT_EXCEEDED")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "SECURITY_VIOLATED")	return `<span class="red" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "CRASHED")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "INPUT_PREPARATION_CRASHED")	return `<span style="color:#ca7d3c;" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "CHALLENGED")	return `<span style="color:rgb(175, 168, 158)" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "SKIPPED")	return `<span style="color:rgb(110, 149, 210);" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "TESTING")	return `<span style="color:rgb(110, 149, 210)" title="${x}">${toSmallInfo(x)}</span>`;
	if(x == "REJECTED")	return `<span style="color:#decb29" title="${x}">${toSmallInfo(x)}</span>`;
}