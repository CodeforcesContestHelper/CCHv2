


var problemNewWinOpen = false, problemNewWin, problemNewWinJQ;
function initProblemNewWin(x){
	problemNewWinJQ.find(".ToolListTitle").html("Codeforces Problems");
}
function openProblemWin(idList){
	if(!RunInNwjs)	return;
	if(problemNewWinOpen)	return;
	problemNewWinOpen = true;
	nw.Window.open("problem.html",{
	    "title": "Codeforces Problems", 
	    "icon": "favicon.png",
	    "width": 600,
	    "height": 400, 
	    "position": "center",
	    "resizable": true,
	    "min_width": 560,
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
		setTimeout(function(){
			problemNewWinJQ = $(problemNewWin.window.document.body);
			initProblemNewWin(idList);
			problemNewWin.on("closed", function(){
				problemNewWinOpen = false;
			})
		}, 100);
	});
}
// openProblemWin([]);