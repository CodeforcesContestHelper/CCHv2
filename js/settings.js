var contestRanks = [0, 0], contestRankLast = [0, 0], contestRankInfo = [[], []], contestCalculatingRank = [false, false], contestRankChosen = 0;
var contestNewWinJQ, contestNewWin, contestNewWinOpened = false, contestNewWinLoaded = false;
var problemNewWinOpened = false, problemNewWin, problemNewWinJQ, submitCodeAreaController, problemNewWinLoaded;
var watchNewWinOpened = false, watchNewWin, watchNewWinJQ, watchNewWinLoaded;
var singleAnnouncementLength = -1;
var lang_list = ["English", "简体中文"];
var lang_attr = ["en", "zh_cn"];
var openStandingsSelection = ["Disabled", "Div1Only", "Enabled"];
var openRankPredictorSelection = ["Disabled", "RatedOnly", "Enabled"];
var styleSelectionList = ["System", "Light", "Dark"];
var currentLoginHandle = "";
var contestRatingChangesHook = null;
var contestEnterInPage = false;
var settings = localStorage.getItem("CCH_Settings");
var submissionLangs = localStorage.getItem("CCH_Languages");
if(submissionLangs == undefined)
	submissionLangs = JSON.stringify(Langs);
localStorage.setItem("CCH_Languages", JSON.stringify(submissionLangs));
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
var lang_en = {
	general: {
		title: "Codeforces Contest Helper v2.0",
		singleNav: "Single",
		multiNav: "Multi",
		contestNav: "Contest",
		questionNav: "Problem",
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
		settingsSingle: "<span class='fas fa-user'></span> Single Mode",
		settingsPreference: "<span class='fas fa-palette'></span> Preference",
		settingsAccount: "<span class='fas fa-user-circle'></span> Account",
		settingsProblemPage: "<span class='fas fa-book'></span> Problem Page",
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
		verdict: "Verdict",
		language: "Language",
		time: "Time",
		memory: "Memory",
		close: "Close",
		back: "Back",
		reloadLanguages: "<span class='fas fa-sync-alt'></span> Reload Language",
		reloadLanguagesSuccess: "<span class='fas fa-check green'></span> Reload Success!",
		currentUser: "<span class='fas fa-check green'></span> Current user: {0}",
		notLoggedIn: "<span class='fas fa-times red'></span> Not logged in",
		settingsLoginButton: "<i class='fas fa-sign-in-alt'></i> Click here to log in",
		settingsLoadingLoginType: "<span class='fas fa-pulse fa-spinner'></span> Loading Login Type...",
		loadLoginTypeError: "<span class='fas fa-unlink red'></span> Load login type error. Click here to retry.",
		loginLoading: "<span class='fas fa-pulse fa-spinner'></span> Loading...",
		loginSuccess: "<span class='fas fa-check green'></span> Login Success!",
		sendAnswer: "Send Answer",
		input: "Input",
		output: "Output",
		copy: "Copy",
		copied: "Copied",
		forceLoadStandings: "Force Load Standings",
		openProblems: "Open Problems",
		submitSuccess: "Submit Success!",
		unlimited: "Unlimited",
		flushContestList: "Flush contest list...",
		copyInfo: "Copy Info",
	},
	input: {
		singleContestantUsername: "Username",
		singleContestantContestId: "Contest ID",
		singleVirtualUsername: "Username",
		singleVirtualContestId: "Contest ID",
		singleVirtualTime: "Time (YYYY/M/D HH:MM)",
		search: "Search",
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
		errorCannotGetCode: "Cannot Get Code",
		errorLoginFailed: "<span class='fas fa-exclamation-triangle red'></span> Login Failed",
		errorLoadFailed: "<span class='fas fa-exclamation-triangle red'></span> Load Failed",
		errorCsrfLoadFailed: "<span class='fas fa-exclamation-triangle red'></span> 'csrf_token' Load Failed",
		errorSubmitFailed: "Submit Failed"
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
		tipVirtualTime: "Insert 'auto' to get the latest virtual round <span class='red'>with at least one submission</span>.",
		tipClickToGoBack: "Click here to go back."
	},
	settings: {
		fontFamily: [
			"<span class='fas fa-font'></span> Font Family",
			"Use commas(,) to split font name. Monospace font can make a better view."
		],
		editorFontFamily: [
			"<span class='fas fa-code'></span> Code Block Font Family",
			"Set font family for code blocks."
		],
		editorFontSize: [
			"<span class='fas fa-text-width'></span> Code Block Font Size",
			"Set font size for code blocks."
		],
		statementFontFamily: [
			"<span class='fas fa-clipboard-list'></span> Statement Font Family",
			"Set font family for problem statements."
		],
		timeLimit: [
			"<span class='fas fa-stopwatch'></span> Load Time Limit",
			"Time limits while fetching information. Big time limit will be used to limit standings and rating changes loader."
		],
		reloadTime: [
			"<span class='fas fa-hourglass-half'></span> Information Load Time",
			"Load time between updates during the contest."
		],
		smallReloadTime: [
			"<span class='fas fa-sync-alt'></span> Small Reload Time",
			"Reload time when some of the informations are not be able to be loaded."
		],
		mainURL: [
			"<span class='fas fa-link'></span> Main URL",
			"URL used while opening Codeforces links."
		],
		predictorURL: [
			"<span class='fas fa-search'></span> Predictor URL",
			"Address to get predicted rating changes."
		],
		openStandings: [
			"<span class='fas fa-list-ol'></span> Open Standings",
			"Select when to load the standings and hacks of a contest. <span class='red'>The data can be really large, so think twice.</span>"
		],
		standingsLoadingGap: [
			"<span class='fas fa-stopwatch'></span> Standings Loading Gap",
			"Load time between standings updates."
		],
		openRankPredict: [
			"<span class='fas fa-calculator'></span> Open Rank Calculator",
			"Select when to enable history rank calculator. <span class='red'>Standings Required.</span>"
		],
		problemSubmissionDirection: [
			"<span class='fas fa-server'></span> Submission Order",
			"Order option of submissions for each problem."
		],
		problemEventDirection: [
			"<span class='fas fa-book'></span> Event Order",
			"Order option of events for the contest."
		],
		language: [
			"<span class='fas fa-language'></span> Language",
			"The language can be loaded without rebooting."
		],
		styleSelection: [
			"<span class='fas fa-paint-roller'></span> Style",
			"Select favourite style."
		],
		virtualFilter: [
			"<span class='fas fa-filter'></span> Open Virtual Filter",
			"Choose how history rank calculator deal with virtual information. Open this to remove them."
		],
		codeforcesApiUrl: [
			"<span class='fas fa-exchange-alt'></span> Codeforces API URL", 
			"Set the address of Codeforces APIs."
		],
		showProblemStatus: [
			"<span class='fas fa-question-circle'></span> Show Problem Status Bar",
			"View problem status percentage under Problem mode. <span class='red'>Standings Required.</span>"
		],
		accountHandleOrEmail: [
			"<span class='fas fa-user'></span> Handle or Email", ""
		],
		accountPassword: [
			"<span class='fas fa-key'></span> Password", ""
		],
		openProblems: [
			"<span class='fas fa-tasks'></span> Open Problems",
			`Open problems if the contest is not ended.`
		],
		transformPort: [
			"<span class='fas fa-location-arrow'></span> Transform Port",
			"Set the ports while communicating to editors. Use commas(,) to split each port."
		],
		statementFontSize: [
			"<span class='fas fa-text-width'></span> Statement Font Size",
			"Set font size for statements."
		],
		statementDefaultLanguage: [
			"<span class='fas fa-cloud-upload-alt'></span> Submit Default Language",
			"Set default language while submitting."
		],
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
		settingsSingle: "<span class='fas fa-user'></span> 个人模式",
		settingsPreference: "<span class='fas fa-palette'></span> 个性化",
		settingsAccount: "<span class='fas fa-user-circle'></span> 账号",
		settingsProblemPage: "<span class='fas fa-book'></span> 题目界面",
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
		tipVirtualTime: "输入 'auto' 以获取最近的<span class='red'>提交至少一次的</span>虚拟赛时间。",
		verdict: "评测结果",
		language: "语言",
		time: "用时",
		memory: "内存",
		close: "关闭",
		back: "返回",
		reloadLanguages: "<span class='fas fa-sync-alt'></span> 重载代码语言",
		reloadLanguagesSuccess: "<span class='fas fa-check green'></span> 重载成功！",
		currentUser: "<span class='fas fa-check green'></span> 当前用户: {0}",
		notLoggedIn: "<span class='fas fa-times red'></span> 未登录",
		settingsLoginButton: "<i class='fas fa-sign-in-alt'></i> 点此以登录",
		settingsLoadingLoginType: "<span class='fas fa-pulse fa-spinner'></span> 加载登录状态......",
		loadLoginTypeError: "<span class='fas fa-unlink red'></span> 加载登陆状态失败。点此重试。",
		loginLoading: "<span class='fas fa-pulse fa-spinner'></span> 加载中......",
		loginSuccess: "<span class='fas fa-check green'></span> 登陆成功！",
		sendAnswer: "提交答案",
		input: "输入",
		output: "输出",
		copy: "复制",
		copied: "已复制",
		forceLoadStandings: "强制加载排行榜",
		openProblems: "打开问题界面",
		submitSuccess: "提交成功！",
		unlimited: "无限制",
		flushContestList: "刷新比赛列表中......",
		copyInfo: "复制信息",
	},
	input: {
		singleContestantUsername: "用户名",
		singleContestantContestId: "比赛 ID",
		singleVirtualUsername: "用户名",
		singleVirtualContestId: "比赛 ID",
		singleVirtualTime: "时间 (YYYY/M/D HH:MM)",
		search: "搜索",
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
		errorVirtualInfoNotFound: "未找到虚拟赛信息",
		errorCannotGetCode: "无法获取代码",
		errorLoginFailed: "<span class='fas fa-exclamation-triangle red'></span> 登录失败",
		errorLoadFailed: "<span class='fas fa-exclamation-triangle red'></span> 加载失败",
		errorCsrfLoadFailed: "<span class='fas fa-exclamation-triangle red'></span> 'csrf_token' 加载失败",
		sendAnswer: "提交答案",
		errorSubmitFailed: "提交失败",
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
		tipVirtualTime: "输入 'auto' 以获取最近的<span class='red'>提交至少一次的</span>虚拟赛时间。",
		tipClickToGoBack: "点此以返回。"
	},
	settings: {
		fontFamily: [
			"<span class='fas fa-font'></span> 字体",
			"使用逗号进行字体名字分割。使用等宽字体会打开更好的效果。"
		],
		editorFontFamily: [
			"<span class='fas fa-code'></span> 代码块字体",
			"为代码块设置字体。"
		],
		editorFontSize: [
			"<span class='fas fa-text-width'></span> 代码块字体大小",
			"为代码块设置字体大小。"
		],
		statementFontFamily: [
			"<span class='fas fa-clipboard-list'></span> 题目信息字体",
			"为题目信息设置字体。"
		],
		timeLimit: [
			"<span class='fas fa-stopwatch'></span> 加载时间限制",
			"加载信息时的时间限制。大时间限制将用于比赛排行榜和 Rating 变化量。"
		],
		reloadTime: [
			"<span class='fas fa-hourglass-half'></span> 信息获取间隔",
			"比赛时获取必要信息的时间间隔。"
		],
		smallReloadTime: [
			"<span class='fas fa-sync-alt'></span> 重新加载时间",
			"在重要信息没有加载成功后的等待时间。"
		],
		mainURL: [
			"<span class='fas fa-link'></span> 主页地址",
			"打开 Codeforces 链接使用的主页地址。"
		],
		predictorURL: [
			"<span class='fas fa-search'></span> 预测器地址",
			"获取比赛 Rating 变化的地址。"
		],
		openStandings: [
			"<span class='fas fa-list-ol'></span> 打开排行榜获取",
			"选择何时进行排行榜和 hack 的获取。<span class='red'>因为获取的信息量会很大，所以三思而后行。</span>"
		],
		standingsLoadingGap: [
			"<span class='fas fa-stopwatch'></span> 排行榜获取间隔",
			"比赛时获取排行榜的时间间隔。"
		],
		openRankPredict: [
			"<span class='fas fa-calculator'></span> 打开历史排名计算器",
			"选择何时打开历史排名计算器。<span class='red'>需要排行榜信息。</span>"
		],
		problemSubmissionDirection: [
			"<span class='fas fa-server'></span> 评测记录顺序",
			"每一道题目的评测记录显示顺序。"
		],
		problemEventDirection: [
			"<span class='fas fa-book'></span> 事件顺序",
			"比赛的时间显示顺序。"
		],
		language: [
			"<span class='fas fa-language'></span> 语言",
			"语言无需重启即可更换。"
		],
		styleSelection: [
			"<span class='fas fa-paint-roller'></span> 样式",
			"选择你喜欢的样式。"
		],
		virtualFilter: [
			"<span class='fas fa-filter'></span> 打开虚拟赛过滤",
			"选择历史排名计算器如何处理虚拟赛数据。打开此设置以去除它们。"
		],
		codeforcesApiUrl: [
			"<span class='fas fa-exchange-alt'></span> Codeforces API 地址", 
			"设置获取 Codeforces API 的地址。"
		],
		showProblemStatus: [
			"<span class='fas fa-question-circle'></span> 显示题目状态",
			"在题目状态中显示每道题的状态比例。<span class='red'>需要排行榜信息。</span>"
		],
		accountHandleOrEmail: [
			"<span class='fas fa-user'></span> 用户名或邮箱", ""
		],
		accountPassword: [
			"<span class='fas fa-key'></span> 密码", ""
		],
		openProblems: [
			"<span class='fas fa-tasks'></span> 打开 Problems",
			`在比赛没有结束的时候打开 Problems 页面。`
		],
		transformPort: [
			"<span class='fas fa-location-arrow'></span> 交流端口",
			"设置和代码编辑器交流的端口，用逗号分割。"
		],
		statementFontSize: [
			"<span class='fas fa-text-width'></span> 题面字体大小",
			"为题面设置字体大小。"
		],
		statementDefaultLanguage: [
			"<span class='fas fa-cloud-upload-alt'></span> 默认提交语言",
			"设置提交时的默认语言。"
		],
	}
};
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
			settings.mainURL = str;
			saveSettings();
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
	editorFontSize: {
		initial: function(){
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 24];
		},
		previous: function(){
			--settings.editorFontSize;
			initStyle(); saveSettings();
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 24];
		},
		next: function(){
			++settings.editorFontSize;
			initStyle(); saveSettings();
			return [settings.editorFontSize, settings.editorFontSize != 8, settings.editorFontSize != 24];
		},
	},
	statementFontSize: {
		initial: function(){
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 24];
		},
		previous: function(){
			--settings.statementFontSize;
			initStyle(); saveSettings();
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 24];
		},
		next: function(){
			++settings.statementFontSize;
			initStyle(); saveSettings();
			return [settings.statementFontSize, settings.statementFontSize != 8, settings.statementFontSize != 24];
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
	showProblemStatus: {
		initial: function(){
			return settings.showProblemStatus;
		},
		change: function(){
			settings.showProblemStatus = !settings.showProblemStatus;
			saveSettings();
			return settings.showProblemStatus;
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
	statementDefaultLanguage: 50
};
function setAsDefault(){
	if(settings == undefined)
		settings = currentDefaultSettings;
	else{
		var L = settings.language;
		var D = settings.styleSelection;
		var F = settings.fontFamily;
		var E = settings.editorFontFamily;
		var S = settings.editorFontSize;
		var P = settings.statementFontFamily;
		var s = settings.statementDefaultLanguage;
		if(L == undefined)	L = currentDefaultSettings.language;
		if(D == undefined)	D = currentDefaultSettings.styleSelection;
		if(F == undefined)	F = currentDefaultSettings.fontFamily;
		if(E == undefined)	E = currentDefaultSettings.editorFontFamily;
		if(S == undefined)	S = currentDefaultSettings.editorFontSize;
		if(P == undefined)	P = currentDefaultSettings.statementFontFamily;
		if(s == undefined)	s = currentDefaultSettings.statementDefaultLanguage
		settings = JSON.parse(JSON.stringify(currentDefaultSettings));
		settings.language = L;
		settings.styleSelection = D;
		settings.fontFamily = F;
		settings.editorFontFamily = E;
		settings.editorFontSize = S;
		settings.statementFontFamily = P;
		settings.statementDefaultLanguage = s;
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
}
initLanguage();
if(settings == undefined)	settings = {};
else settings = JSON.parse(settings);
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
	if(problemNewWinLoaded){
		problemNewWinJQ.find(".ThemeTypeIf").attr("href", DarkMode ? "./css/problem/dark.css" : "./css/problem/default.css");
		submitCodeAreaController.setOption("theme", DarkMode ? "dracula" : "eclipse");
	}
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
		document.documentElement.style.setProperty("--font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
	if(settings.editorFontFamily != "")
		document.documentElement.style.setProperty("--editor-font-family", settings.editorFontFamily);
	else
		document.documentElement.style.setProperty("--editor-font-family", "'Consolas','Fira Code','Source Code Pro','Lucida Console','Cascadia Code','Ubuntu Mono','Monospace', sans-serif");
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
function judgeToClass(x){
	if(x == undefined || x == "")	return "loadingColor";
	if(x == "OK")	return "successColor";
	if(x == "COMPILATION_ERROR")	return "warningColor";
	if(x == "TESTING")	return "loadingColor";
	if(x == "PARTIAL")	return "warningColor";
	return "dangerColor";
}
function getSubmissionIcon(x){
	if(x == undefined || x == "")	return `<span class="fa fa-hourglass-start"></span>`;
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
	if(x == "TESTING")	return `<span class="fa fa-pulse fa-spinner"></span>`;
	if(x == "REJECTED")	return `<span class="fa fa-exclamation-triangle"></span>`;
}
function toSmallTestset(x){
	if(x == "SAMPLES")	return "SAMP";
	if(x == "PRETESTS")	return "PRET";
	if(x == "TESTS")	return "MAIN";
	if(x == "CHALLENGES")	return "HACK";
	return "TEST";
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