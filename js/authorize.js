var loginTypeLoader = null;
function loadLoginType(){
	$(".settingsLoginType").html(`<span info='settingsLoadingLoginType'>${languageOption.general.settingsLoadingLoginType}</span>`);
	if(loginTypeLoader != null)
		loginTypeLoader.abort();
	loginTypeLoader = $.ajax({
		url: settings.mainURL,
		success: function(data){
			var q = $(data).find(".lang-chooser > div:last-child");
			console.log(q.children("a"));
			if(q.children("a").eq(1).html() == "Register"){
				currentLoginHandle = "";
				$(".settingsLoginType").html(`<span info='notLoggedIn'>${languageOption.general.notLoggedIn}</span>`);
			}
			else{
				var hdl = q.children("a").eq(0).html();
				currentLoginHandle = hdl;
				$(".settingsLoginType").html(`<span info='currentUser' argv=["${hdl}"]>${languageOption.general.currentUser.format([hdl])}</span>`);
			}
		},
		error: function(){
			$(".settingsLoginType").html(`<span info='loadLoginTypeError' style="cursor: pointer" onclick="loadLoginType()">${languageOption.general.loadLoginTypeError}</span>`);
		}
	})
}
var queryCsrf = new RegExp(`<meta name="X-Csrf-Token" content="([0-9a-f]*)"/>`);
var queryHandle = new RegExp(`handle = "([\s\S]+?)"`);
var queryHandle2 = new RegExp(`<title>([0-9a-zA-Z-_.]+?) - Codeforces</title>`);
// <title>tiger2005 - Codeforces</title>
function getFtaa(){
	var str = "0123456789qwertyuiopasdfghjklzxcvbnm";
	var ret = "";
	for(var i=0; i<18; i++)
		ret += str[Math.floor(Math.random()*str.length)];
	return ret;
}
function submitLogout(cb){
	if(currentLoginHandle == ""){
		cb(); return;
	}
	$.ajax({
		url: settings.mainURL,
		success: function(data){
			console.log(data);
			var q = $(data).find(".lang-chooser > div:last-child");
			if(q.children("a").eq(1).html() == "Register"){
				cb(); return;
			}
			$.ajax({
				url: settings.mainURL + q.children("a").eq(1).attr("href"),
				success: function(){
					currentLoginHandle = "";
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
			console.log(data);
			var csrf = queryCsrf.exec(data)[1];
			console.log(csrf);
			$.ajax({
				url: settings.mainURL + '/enter?back=%2F',
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
					var q = $(d).find(".lang-chooser > div:last-child");
					console.log(q.children("a"));
					if(q.children("a").eq(1).html() == "Register"){
						currentLoginHandle = "";
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

if(RunInNwjs)
	loadLoginType();