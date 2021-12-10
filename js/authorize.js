var loginTypeLoader = null;
var CodeforcesUserAPIKey, CodeforcesUserAPISeg;

function loadLoginType(){
	currentLoginHandle = "";
	if(problemNewWinLoaded)	initProblemNewWin();
	getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
	$(".settingsLoginType").html(`<span info='settingsLoadingLoginType'>${languageOption.general.settingsLoadingLoginType}</span>`);
	if(loginTypeLoader != null)
		loginTypeLoader.abort();
	loginTypeLoader = $.ajax({
		url: settings.mainURL + '?locale=en',
		success: function(data){
			var q = $(data).find(".lang-chooser > div").eq(1);
			if(q.children("a").eq(1).html() == "Logout"){
				var hdl = q.children("a").eq(0).html();
				currentLoginHandle = hdl;
				if(problemNewWinLoaded)	initProblemNewWin();
				$(".settingsLoginType").html(`<span info='currentUser' argv=["${hdl}"]>${languageOption.general.currentUser.format([hdl])}</span>`);
			}
			else{
				currentLoginHandle = "";
				getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
				if(problemNewWinLoaded)	initProblemNewWin();
				$(".settingsLoginType").html(`<span info='notLoggedIn' style="cursor: pointer" onclick="loadLoginType()">${languageOption.general.notLoggedIn}</span>`);
			}
		},
		error: function(){
			$(".settingsLoginType").html(`<span info='loadLoginTypeError' style="cursor: pointer" onclick="loadLoginType()">${languageOption.general.loadLoginTypeError}</span>`);
		}
	})
}
var queryCsrf = new RegExp(`<meta name="X-Csrf-Token" content="([0-9a-f]*)"`);
var queryGlobalChannel = new RegExp(`<meta name="gc" content="([0-9a-f]*)"`);
var queryHandle = new RegExp(`handle = "([\s\S]+?)"`);
var queryHandle2 = new RegExp(`<title>([0-9a-zA-Z-_.]+?) - Codeforces</title>`);
function getFtaa(){
	var str = "0123456789qwertyuiopasdfghjklzxcvbnm";
	var ret = "";
	for(var i=0; i<18; i++)
		ret += str[Math.floor(Math.random()*str.length)];
	return ret;
}
function submitLogout(cb){
	if(currentLoginHandle == ""){
		cb();
		return;
	}
	$.ajax({
		url: settings.mainURL,
		success: function(data){
			var q = $(data).find(".lang-chooser > div").eq(1);
			if(q.children("a").eq(1).html() == "Register"){
				cb(); return;
			}
			$.ajax({
				url: settings.mainURL + q.children("a").eq(1).attr("href") + '?locale=en',
				success: function(){
					currentLoginHandle = "";
					getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
					if(problemNewWinLoaded)	initProblemNewWin();
					$(".settingsLoginType").html(`<span info='notLoggedIn'>${languageOption.general.notLoggedIn}</span>`);
					cb();
				},
				error: function(){
					setTimeout(function(){submitLogout(cb)}, 2000);
				}
			})
		},
		error: function(){
			$(".settingsLoginButton").html(`<span info='errorCsrfLoadFailed'>${languageOption.error.errorCsrfLoadFailed}</span>`);
			setTimeout(function(){
				$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
			}, 2000)
		}
	})
}
function submitLogin(){
	$(".settingsLoginButton").html(`<span info='loginLoading'>${languageOption.general.loginLoading}</span>`);
	submitLogout(function(){$.ajax({
		url: settings.mainURL,
		success: function(data){
			var csrf = queryCsrf.exec(data);
			if(csrf == null){
				$(".settingsLoginButton").html(`<span info='errorCsrfLoadFailed'>${languageOption.error.errorCsrfLoadFailed}</span>`);
				setTimeout(function(){
					$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
				}, 2000)
				return;
			}
			csrf = csrf[1];
			$.ajax({
				url: settings.mainURL + '/enter?back=%2F&locale=en',
				type: "POST",
				data: {
					csrf_token: csrf,
					action: "enter",
					ftaa: getFtaa(),
					bfaa: "f1b3f18c715565b589b7823cda7448ce",
					handleOrEmail: $("[for=accountHandleOrEmail] > .settingsInputPart > input").val(),
					password: $("[for=accountPassword] > .settingsInputPart > input").val(),
					_tta: "176",
					remember: "on",
				},
				success: function(d){
					var q = $(d).find(".lang-chooser > div").eq(1);
					if(q.children("a").eq(1).html() == "Register"){
						currentLoginHandle = "";
						getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
						$(".settingsLoginType").html(`<span info='notLoggedIn'>${languageOption.general.notLoggedIn}</span>`);
						$(".settingsLoginButton").html(`<span info='errorLoginFailed'>${languageOption.error.errorLoginFailed}</span>`);
						setTimeout(function(){
							$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
						}, 2000);
						return;
					}
					$(".settingsLoginButton").html(`<span info='loginSuccess'>${languageOption.general.loginSuccess}</span>`);
					setTimeout(function(){
						$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
					}, 2000);
					var hdl = q.children("a").eq(0).html();
					currentLoginHandle = hdl;
					if(problemNewWinLoaded)	initProblemNewWin();
					$(".settingsLoginType").html(`<span info='currentUser' argv=["${hdl}"]>${languageOption.general.currentUser.format([hdl])}</span>`);
				},
				error: function(){
					$(".settingsLoginButton").html(`<span info='errorLoginFailed'>${languageOption.error.errorLoginFailed}</span>`);
					setTimeout(function(){
						$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
					}, 2000);
				}
			})
		},
		error: function(){
			$(".settingsLoginButton").html(`<span info='errorCsrfLoadFailed'>${languageOption.error.errorCsrfLoadFailed}</span>`);
			setTimeout(function(){
				$(".settingsLoginButton").html(`<span info='settingsLoginButton' onclick="submitLogin()">${languageOption.general.settingsLoginButton}</span>`);
			}, 2000)
		}
	})});
}
function submitSolution(ci, idx, code, lang, S, E){
	$.ajax({
		url: settings.mainURL,
		success: function(data){
			var csrf = queryCsrf.exec(data);
			if(csrf == null){
				E('errorCsrfLoadFailed', languageOption.error.errorCsrfLoadFailed);
				return;
			}
			csrf = csrf[1];
			$.ajax({
				url: settings.mainURL + `/${ci >= 100000 ? "gym" : "contest"}/` + ci + '/submit',
				type: "POST",
				data: {
					csrf_token: csrf,
					action: "submitSolutionFormSubmitted",
					ftaa: getFtaa(),
					bfaa: "f1b3f18c715565b589b7823cda7448ce",
					"submittedProblemIndex": idx,
					"programTypeId":         lang,
					"contestId":             ci,
					"source":                code,
					"sourceFile":            "",
					"tabSize":               "4",
					"_tta":                  "493",
					"sourceCodeConfirmed":   "true",
				},
				success: function(d){
					if($(d).find(".lang-chooser > div").length == 0){
						E('errorNetworkError', languageOption.error.errorNetworkError);
						return;
					}
					var q = $(d).find(".lang-chooser > div").eq(1);
					if(q.children("a").eq(1).html() == "Register"){
						currentLoginHandle = "";
						getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
						E('errorLoginFailed', languageOption.error.errorLoginFailed);
						return;
					}
					if(d.indexOf("You have submitted exactly the same code before") != -1){
						E('errorSameCode', languageOption.error.errorSameCode);
						return;
					}
					if(d.indexOf("submitted successfully") == -1){
						E('errorSubmitFailed', languageOption.error.errorSubmitFailed);
						return;
					}
					var gc = queryGlobalChannel.exec(d);
					if(gc != null)
						gc = gc[1];
					else
						gc = "7bf17394dc32cc2d4d6234197d8d58178ed01ff7";
					S($(d).find(`[data-submission-id]`).eq(0).attr("data-submission-id"), ci + idx, gc);
				},
				error: function(){
					E('errorLoginFailed', languageOption.error.errorLoginFailed);
				}
			})
		},
		error: function(){
			E('errorCsrfLoadFailed', languageOption.error.errorCsrfLoadFailed);
		}
	});
}
function reloadLanguages(){
	if(currentLoginHandle == ""){
		$(".settingsReloadLanguages").html(localize('notLoggedIn'));
		setTimeout(function(){
			$(".settingsReloadLanguages").html(`<span info='reloadLanguages' onclick="reloadLanguages()">${languageOption.general.reloadLanguages}</span>`);
		}, 2000)
		return;
	}
	$(".settingsReloadLanguages").html(localize('loginLoading'));
	$.ajax({
		url: settings.mainURL + '/problemset/submit',
		success: function(d){
			var q = $(d).find(".submit-form select");
			submissionLangs = {};
			var pt = 0;
			$("[for=statementDefaultLanguage] select").html("");
			q.children().each(function(){
				if(pt == 0)
					pt = Number($(this).attr("value"));
				submissionLangs[$(this).attr("value")] = $(this).html();
				$("[for=statementDefaultLanguage] select").append(`<option value=${$(this).attr("value")}>${$(this).html()}</option>`);
			})
			if(submissionLangs[settings.statementDefaultLanguage] == undefined)
				settings.statementDefaultLanguage = pt;
			$("[for=statementDefaultLanguage] select").val(settings.statementDefaultLanguage);
			saveSettings();
			$(".settingsReloadLanguages").html(localize('reloadLanguagesSuccess'));
			setTimeout(function(){
				$(".settingsReloadLanguages").html(`<span info='reloadLanguages' onclick="reloadLanguages()">${languageOption.general.reloadLanguages}</span>`);
			}, 2000)
		},
		error: function(){
			$(".settingsReloadLanguages").html(`<span info='errorLoadFailed'>${languageOption.error.errorLoadFailed}</span>`);
			setTimeout(function(){
				$(".settingsReloadLanguages").html(`<span info='reloadLanguages' onclick="reloadLanguages()">${languageOption.general.reloadLanguages}</span>`);
			}, 2000)
		}
	})
}

function loadContestPassedStatus(S, E){
	if(currentLoginHandle == ""){
		S(); return;
	}
	$.ajax({
		url: settings.mainURL + '/contests',
		success: function(data){
			var csrf = queryCsrf.exec(data);
			if(csrf == null){
				E();
				return;
			}
			csrf = csrf[1];
			$.ajax({
				url: settings.mainURL + '/data/contests',
				type: "POST",
				data: {
					csrf_token: csrf,
					action: "getSolvedProblemCountsByContest",
				},
				success: function(d){
					getSolvedProblemsByContest = d;
					displayContestListPage();
					S();
				},
				error: function(){
					E();
				}
			})
		}
	});
}
function checkRegistation(ci, S, E){
	if(currentLoginHandle == ""){
		S(false); return;
	}
	$.ajax({
		url: settings.mainURL + '/contests',
		success: function(d){
			var q = $(d).find(`[data-contestid=${ci}]`);
			var flg = false;
			q.each(function(){
				if(flg)	return;
				var h = $(this).find(".red-link");
				h.each(function(){
					if(flg)	return;
					if($(this).html() == "Register »"){
						E(); flg = true;
					}
				})
			});
			if(flg)	return;
			S(true);
		},
		error: function(){
			S(false); return;
		}
	});
}
function registerContest(ci, S, E){
	$.ajax({
		url: settings.mainURL,
		success: function(data){
			var csrf = queryCsrf.exec(data);
			if(csrf == null){
				E();
				return;
			}
			csrf = csrf[1];
			$.ajax({
				url: settings.mainURL + '/contestRegistration/' + ci,
				type: "POST",
				data: {
					csrf_token: csrf,
					action: "formSubmitted",
					ftaa: getFtaa(),
					bfaa: "f1b3f18c715565b589b7823cda7448ce",
					takePartAs: "personal",
					_tta: 370
				},
				success: function(d){
					var q = $(d).find(".lang-chooser > div").eq(1);
					if(q.children("a").eq(1).html() == "Register"){
						currentLoginHandle = "";
						getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
						E();
						return;
					}
					if(d.indexOf("You have been successfully registered") == -1){
						E(); return;
					}
					S();
				},
				error: function(){
					E();
				}
			})
		},
		error: function(){
			E();
		}
	});
}

function registerVirtualRound(ci, tm, S, E){
	var months = [
	    "January", "February", "March", "April", "May", "June", 
	    "July", "August", "September", "October", "November", "December"
    ];
    var offsetTime = new Date(tm.getTime() + tm.getTimezoneOffset() * 60 * 1000);
	$.ajax({
		url: settings.mainURL,
		success: function(data){
			var csrf = queryCsrf.exec(data);
			if(csrf == null){
				E("fa-unlink");
				return;
			}
			csrf = csrf[1];
			$.ajax({
				url: settings.mainURL + '/contestRegistration/' + ci + '/virtual/true',
				type: "POST",
				data: {
					csrf_token: csrf,
					action: "formSubmitted",
					ftaa: getFtaa(),
					bfaa: "f1b3f18c715565b589b7823cda7448ce",
					_tta: 292,
					virtual: "true",
					backUrl: "",
					takePartAs: "personal",
					initialDatetime: `${months[offsetTime.getMonth()].substring(0, 3)}/${offsetTime.getDate()}/${offsetTime.getFullYear()} ${offsetTime.pattern("hh:mm")}`,
					clientTimezoneOffset: (- tm.getTimezoneOffset()),
					startDay: `${months[tm.getMonth()].substring(0, 3)}/${tm.getDate()}/${tm.getFullYear()}`,
					startTime: tm.pattern("hh:mm"),
					teamId: -1,
					requiredConfirmation: "true"
				},
				success: function(d){
					var q = $(d).find(".lang-chooser > div").eq(1);
					if(q.children("a").eq(1).html() == "Register"){
						currentLoginHandle = "";
						getSolvedProblemsByContest = {problemCountsByContestId: {}, solvedProblemCountsByContestId: {}};
						E("fa-unlink");
						return;
					}
					if(d.indexOf("You have been successfully registered") == -1){
						E("fa-exclamation-triangle"); return;
					}
					S();
				},
				error: function(){
					E("fa-unlink");
				}
			})
		},
		error: function(){
			E("fa-unlink");
		}
	});
}

function generateAuthorizeURL(url, data){
	function parseObject(x){
		var ret = [];
		for(var v in x)
			if(x.hasOwnProperty(v))
				ret.push([v, x[v]]);
		return ret.sort();
	}
	function generateParams(x){
		var ret = "";
		for(var i=0; i<x.length; i++){
			if(i == 0)
				ret += '?';
			else
				ret += "&";
			ret += (x[i][0] + '=' + x[i][1]);
		}
		return ret;
	}
	if(!settings.useApiKeys)
		return url + generateParams(parseObject(data));
	var method = url.split("/");
	method = method[method.length - 1];
	data.time = Math.floor((new Date()).getTime() / 1000);
	data.apiKey = settings.apiKey;
	data = parseObject(data);
	var rnd = "";
	var str = "0123456789qwertyuiopasdfghjklzxcvbnm";
	for(var j=0; j<6; j++)
		rnd += str[Math.floor(Math.random()*str.length)];
	var shaCode = rnd + '/' + method + generateParams(data) + '#' + settings.apiSecret;
	shaCode = hex_sha512(shaCode);
	data.push(["apiSig", rnd + shaCode]);
	return url + generateParams(data);
}
function openCodeforcesPage(){
	if(!RunInNwjs)
		return;
	window.open(settings.mainURL)
}

if(RunInNwjs)
	loadLoginType();