function addWatcher(id, idx, gc) {
	var p = $(`<div class="singleWatchContent"><div class="singleWatchTitle">#${id} | ${idx}</div><div style="flex: 1; display: flex; flex-direction: row;"><div style="flex: 1; overflow: hidden; display: grid; place-items: center"><span class="singleWatchInfo">Pending...</span></div></div></div>`)
	p.css("transform", "scale(1, 0)");
	p.css("max-height", "0px");
	p.css("margin", "0");
	p.css("padding", "0");
	var IN = false;

	function fadeIn() {
		if (IN) return;
		IN = true;
		$(".watchDisplayer").append(p);
		setTimeout(function() {
			p.attr("style", "");
		}, 100);
	}
	var lastJudgement = "";

	function fadeOut(lj) {
		setTimeout(function() {
			if (!IN) return;
			if (lj != lastJudgement) return;
			IN = false;
			p.css("transform", "scale(1, 0)");
			p.css("max-height", "0px");
			p.css("margin", "0");
			p.css("padding", "0");
		}, 5000);
	}
	fadeIn();
	fadeOut("");
	var chk = false;

	function loadWatchType() {
		var wsOpened = false,
			wsGetResult = false;

		function startWS() {
			var chnl = new WebSocket(`wss://pubsub.codeforces.com/ws/s_${gc}?_=${new Date().getTime()}&tag=&time=&eventid=`);
			chnl.onopen = function() {
				wsOpened = true;
				console.log("ws started")
			};
			chnl.onerror = function() {
				console.log("ws error"), chnl.close();
				wsOpened = false;
			};
			chnl.onclose = function() {
				console.log("ws closed");
				wsOpened = false;
			};
			chnl.onmessage = function(data) {
				if (wsGetResult) {
					chnl.close();
					return;
				}
				var j = JSON.parse(data.data);
				j = JSON.parse(j.text);
				if (j.t != "s")
					return;
				j = j.d;
				if (j[1] != id)
					return;
				var vdl = j[6];
				var num = j[8];
				var tim = j[9];
				var mem = j[10];
				if (j[6] == null || j[6] == undefined)
					vdl = `<span>${toDetailedInfo(j[6], j[4])}</span>`;
				else if (j[6] == "TESTING")
					vdl = `<span>${toDetailedInfo(j[6], j[4])} on test ${j[7] + 1}</span>`;
				else if (j[6] == "OK")
					vdl = `<span class="green" style="font-weight: bold">${toDetailedInfo(j[6], j[4])}</span>`
				else if (j[6] == "PARTIAL" || j[6] == "COMPILATION_ERROR" || j[6] == "SKIPPED" || j[6] == "REJECTED")
					vdl = `<span class="red">${toDetailedInfo(j[6], j[4])}</span>`
				else if (j[6] == "CHALLENGED")
					vdl = `<span class="red" style="font-weight: bold">${toDetailedInfo(j[6], j[4])}</span>`
				else
					vdl = `<span class="red">${toDetailedInfo(j[6], j[4])} on test ${num}</span>`
				mem = toMemoryInfo(mem);
				tim += "ms";
				p.find(".singleWatchInfo").html(vdl);
				if (vdl != lastJudgement)
					fadeIn(), fadeOut(vdl);
				lastJudgement = vdl;
				if (j[6] != "TESTING" && j[6] != null && j[6] != undefined) {
					wsGetResult = true;
					p.find(".singleWatchTitle").html(`${idx} <i class="fas fa-angle-double-right"></i> ${tim} | ${mem}`);
					if (settings.openNotification) {
						new Notification(`Result of CF${idx}`, {
							body: `${$(vdl).html()}\n${tim} | ${mem}`,
							icon: '../favicon.png'
						});
					}
					chnl.close();
				}
			};
		}
		// startWS();
		function reloadByAjax() {
			console.log("Reloading by ajax...");
			$.ajax({
				url: settings.mainURL + `/${getProblemIndexes(idx)[0] >= 100000 ? "gym" : "contest"}/` + getProblemIndexes(idx)[0] + '/submission/' + id,
				success: function(data) {
					if (data.indexOf(`data-entityId="${id}"`) == -1) {
						setTimeout(reloadByAjax, 10000);
						return;
					}
					if (wsGetResult)
						return;
					var ctL = $(data).find("table").eq(0).find("tr").eq(1);
					if (ctL.children().eq(4).children().eq(0).hasClass("verdict-accepted")) {
						p.find(".singleWatchInfo").addClass("green").css("font-weight", "bold");
					}
					if (ctL.children().eq(4).children().eq(0).hasClass("verdict-rejected") ||
						ctL.children().eq(4).children().eq(0).hasClass("verdict-failed")) {
						p.find(".singleWatchInfo").addClass("red");
					}
					p.find(".singleWatchInfo").html(ctL.children().eq(4).text());
					if (ctL.children().eq(4).text() != lastJudgement)
						fadeIn(), fadeOut(ctL.children().eq(4).text());
					lastJudgement = ctL.children().eq(4).text();
					if (ctL.children().eq(4).children().eq(0).hasClass("verdict-waiting") ||
						lastJudgement == "In queue" || lastJudgement == "") {
						setTimeout(reloadByAjax, 2000);
						// if(wsOpened)
						// 	return;
					} else {
						wsGetResult = true;
						p.find(".singleWatchTitle").html(`${idx} <i class="fas fa-angle-double-right"></i> ${ctL.children().eq(5).text().trim()} | ${ctL.children().eq(6).text().trim()}`);
						if (settings.openNotification) {
							new Notification(`Result of CF${idx}`, {
								body: `${ctL.children().eq(4).text().trim()}\n${ctL.children().eq(5).text().trim()} | ${ctL.children().eq(6).text().trim()}`,
								icon: '../favicon.png'
							});
						}
					}
				},
				error: function() {
					setTimeout(reloadByAjax, 2000);
				}
			})
		}
		reloadByAjax();
	}
	setTimeout(function() {
		loadWatchType()
	}, 200);
}