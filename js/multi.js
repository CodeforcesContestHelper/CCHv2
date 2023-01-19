function loadMultiList(cid, users, room, showUnofficial, from, count, S, E) {
	var data = {};
	data.from = from;
	data.count = count;
	data.contestId = cid;
	if (users != undefined && users.length != 0)
		data.handles = users.join(";");
	if (room != 0)
		data.room = room;
	data.showUnofficial = showUnofficial;
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + '/contest.standings', data),
		timeout: settings.largeTimeLimit,
		success: function(json) {
			if (json.status != "OK")
				E();
			else
				S(json.result);
		},
		error: function() {
			E();
		}
	})
}

var userColorCache = {},
	userAvatarCache = {};
var userColorCacheTime = 10 * 60 * 1000;

function loadUserColors(users, S, E) {
	var ret = {};
	var U = [];
	for (var i = 0; i < users.length; i++) {
		if (userColorCache[users[i]] != undefined && userColorCache[users[i]][1] <= (new Date()).getTime() - userColorCacheTime)
			delete userColorCache[users[i]];
		if (userColorCache[users[i]] != undefined)
			ret[users[i]] = userColorCache[users[i]][0];
		else
			U.push(users[i]);
	}
	if (U.length == 0) {
		S(ret);
		return;
	}
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + '/user.info', {
			handles: U.join(";")
		}),
		timeout: settings.largeTimeLimit,
		success: function(json) {
			if (json.status != "OK")
				E();
			else {
				for (var i = 0; i < json.result.length; i++) {
					var q = json.result[i];
					ret[q.handle] = ratingToClass(q.rating);
					userColorCache[q.handle] = [ratingToClass(q.rating), (new Date()).getTime()];
					userAvatarCache[q.handle] = [q.titlePhoto, q.rating];
				}
				S(ret);
			}
		},
		error: function() {
			E();
		}
	})
}

function loadFriendList(S, E) {
	$.ajax({
		url: generateAuthorizeURL(settings.codeforcesApiUrl + '/user.friends', {}),
		timeout: settings.largeTimeLimit,
		success: function(json) {
			if (json.status != "OK")
				E();
			else
				S(json.result);
		},
		error: function() {
			E();
		}
	})
}

var multiPlaceholders = ["", "", ""];
var eventAjax = null;
$(".multiFetchTypeSelect > div").click(function() {
	var t = $(".multiFetchTypeSelect > div.chosen");
	var i = $(".multiFetchTypeSelect > div").index(t);
	multiPlaceholders[i] = $(".multiContestInfoInput").val();
	$(".multiFetchTypeSelect > div").removeClass("chosen");
	$(this).addClass("chosen");
	var idx = $(".multiFetchTypeSelect > div").index(this);
	$(".multiContestInfoInput").attr("info", "multiContestInfoInput" + idx);
	$(".multiContestInfoInput").attr("placeholder", languageOption.input["multiContestInfoInput" + idx]);
	$(".multiContestInfoInput").removeAttr("disabled");
	if (idx == 1) {
		$(".multiContestInfoInput").attr("disabled", "true");
		if (i == 1) {
			if (!settings.useApiKeys) {
				flushMultiStatusBar(localize("multiApiError"), true);
			} else {
				flushMultiStatusBar(localize("multiLoadingFriends"), false);
				loadFriendList(function(data) {
					flushMultiStatusBar(localize("multiFriendsOk"), false);
					var l = data.join(";");
					multiPlaceholders[1] = l;
					var _t = $(".multiFetchTypeSelect > div.chosen");
					var _i = $(".multiFetchTypeSelect > div").index(_t);
					if (_i == 1)
						$(".multiContestInfoInput").val(l);
				}, function() {
					flushMultiStatusBar(localize("multiFriendsError"), true);
				})
			}
		}
	}
	$(".multiContestInfoInput").val(multiPlaceholders[idx]);
});

var multiCurrentPage = 1;

function flushMultiStatusBar(info, error) {
	if (error)
		$(".multiStatusBar").html("<span class='red'>" + info + "</span>");
	else
		$(".multiStatusBar").html(info);
}

function getMultiHack(x, y) {
	if (x == 0 && y == 0)
		return "";
	if (x == 0)
		return `<span class='red'>-${y}</span>`;
	if (y == 0)
		return `<span class='green'>+${x}</span>`;
	return `<span class='green'>+${x}</span>:<span class='red'>-${y}</span>`;
}

function showUserInfoBlock(un, ci, st, tm) {
	$(".userInfoAvatar").attr("src", "");
	$(".userInfoContainer").css("display", "grid");
	setTimeout(function() {
		$(".userInfoContainer").css("opacity", "1");
	}, 100);
	$(".userInfoMain").css("display", "none");
	(function(d) {
		$(".userInfoMain").css("display", "block");
		$(".userInfoLoading").css("display", "none");
		$(".userInfoAvatar").attr("src", d.titlePhoto);
		$(".userInfoName").html(`<div style="display: inline-block" class='${ratingToClass(d.rating)}'>${d.handle}</div> (rating: ${d.rating == undefined ? "?" : d.rating})`);
		$(".userInfoProfile").unbind('click').click(function() {
			$(".userInfoCloseButton").click();
			infoLoadUsername(un);
		})
		if (st != "PRACTICE")
			$(".userInfoObserve").removeClass("disabled"),
			$(".userInfoObserve").unbind('click').click(function() {
				$(".userInfoCloseButton").click();
				$("[for=singleContent]").click();
				loadSingleInformation(st == "VIRTUAL", un, ci, (new Date(tm * 1000)), true);
			})
		else {
			$(".userInfoObserve").unbind('click');
			$(".userInfoObserve").addClass("disabled");
		}
	})({
		titlePhoto: userAvatarCache[un][0],
		handle: un,
		rating: Number(userAvatarCache[un][1])
	});
}
$(".userInfoCloseButton").click(function() {
	$(".userInfoContainer").css("opacity", "0");
	setTimeout(function() {
		$(".userInfoContainer").css("display", "none");
	}, 500);
})

function multiRenderList(data) {
	if (data.rows.length == 0) {
		flushMultiStatusBar(localize("ok"), false);
		$(".multiMask").css("display", "grid");
		$(".multiInfoTable").css("display", "none");
		return;
	}
	var userList = [];
	for (var i = 0; i < data.rows.length; i++) {
		var q = data.rows[i].party.members;
		for (var j = 0; j < q.length; j++)
			userList.push(q[j].handle);
	}

	function calcStandingList() {
		loadUserColors(userList, function(colors) {
			function calcUserBlock(un, dt) {
				return `<div style="display: inline-block" class="${colors[un]}" onclick="event.stopPropagation(); showUserInfoBlock('${un}', ${data.contest.id}, '${dt.party.participantType}', ${dt.party.startTimeSeconds})">${un}</div>`;
			}

			function getVirtualTag(u) {
				var len = Math.floor((new Date()).getTime() / 1000) - u;
				if (len < data.contest.durationSeconds)
					return getTimeLength(len * 1000);
				return '#';
			}
			flushMultiStatusBar(localize("ok") + " | " + `<span info="${data.contest.phase}">${languageOption.phase[data.contest.phase]}</span>`, false);
			$(".multiMask").css("display", "none");
			$(".multiInfoTable").css("display", "table");
			var hd = $(".multiInfoThead");
			hd.html("");
			var p = `<th style='width: 2em'>#</th><th>${localize("multiUser")}</th>`;
			if (data.contest.type == "IOI")
				p += `<th style='width: 2em'>=</th>`;
			else if (data.contest.type == "ICPC")
				p += `<th style='width: 2em'>=</th><th style='width: 4em'>&</th><th style='width: 5em'>*</th>`;
			else
				p += `<th style='width: 2em'>=</th><th style='width: 5em'>*</th>`;
			for (var i = 0; i < data.problems.length; i++)
				p += `<th style='width: 4em'><span onclick="openProblemWin(['${data.contest.id}${data.problems[i].index}'])" style="text-decoration: underline; cursor: pointer">${data.problems[i].index}</span>${data.contest.type == "CF" ? `<span class='multiSmall'>${data.problems[i].points}</span>` : ""}`
			hd.append("<tr>" + p + "</th>");
			var bd = $(".multiInfoTbody");
			bd.html("");
			for (var t = 0; t < data.rows.length; t++) {
				var user = data.rows[t];
				var uList = "";
				if (user.party.teamName != undefined)
					uList = `<span style='color: grey; font-size: 14px'>${user.party.teamName}</span>`;
				var l = [];
				var addi = "";
				for (var i = 0; i < user.party.members.length; i++)
					l.push(calcUserBlock(user.party.members[i].handle, user));
				if (l.length != 0 && uList != "")
					uList += ": ";
				uList += l.join(", ");
				var q = `<td>${user.party.participantType == "PRACTICE" ? "" : user.rank}</td>`;
				var rr = $(`<td class="multiTableUser">${user.party.ghost ? "<i class='fas fa-ghost'></i> " : ""}${(user.party.participantType == "PRACTICE" || user.party.participantType == "OUT_OF_COMPETITION") ? "* " : ""}${uList}${user.party.participantType == "VIRTUAL" && !user.party.ghost ? `<sup>${getVirtualTag(user.party.startTimeSeconds)}</sup>` : ""}</td>`);
				if (user.party.members.length != 0) {
					rr.css("cursor", "pointer");
					rr.attr("contestId", data.contest.id);
					rr.attr("handle", user.party.members[0].handle);
					rr.attr("startTime", user.party.participantType == "PRACTICE" ? 0 : user.party.startTimeSeconds);
					rr.attr("participantType", user.party.participantType);
					rr.addClass("eventLister");
				}
				q += rr.prop("outerHTML");
				if (data.contest.type == "IOI")
					q += `<td>${user.pointsInfo != undefined ? user.pointsInfo : user.points}</td>`;
				else if (data.contest.type == "ICPC")
					q += `<td>${user.points}</td><td>${user.party.participantType == "PRACTICE" ? "" : user.penalty}</td><td>${getMultiHack(user.successfulHackCount, user.unsuccessfulHackCount)}</td>`;
				else
					q += `<td>${user.points}</td><td>${getMultiHack(user.successfulHackCount, user.unsuccessfulHackCount)}</td>`;
				for (var i = 0; i < data.problems.length; i++) {
					var r = user.problemResults[i];
					var s = "";
					if (r.type == "PRELIMINARY" && data.contest.phase == "SYSTEM_TEST")
						s += `<span style="color: grey; font-weight: bold">?</span>`;
					else if (r.pointsInfo != undefined) {
						s = r.pointsInfo;
						if (r.bestSubmissionTimeSeconds != undefined)
							s += `<span class='multiSmall'>${getTimeLength(Number(r.bestSubmissionTimeSeconds * 1000))}</span>`;
					} else if (r.points == 0) {
						if (r.rejectedAttemptCount != 0)
							s = '<span class="red">-' + r.rejectedAttemptCount + "</span>";
					} else if (data.contest.type == "ICPC")
						s = `<span class='green' style="font-weight: bold">+${r.rejectedAttemptCount == 0 ? "" : r.rejectedAttemptCount}</span>${user.party.participantType == "PRACTICE" ? "" : `<span class='multiSmall'>${getTimeLength(Number(r.bestSubmissionTimeSeconds * 1000))}</span>`}`;
					else
						s = `<span class='green' style="font-weight: bold" title="[+${r.rejectedAttemptCount == 0 ? "" : r.rejectedAttemptCount}]">${r.points}</span>${user.party.participantType == "PRACTICE" ? "" : `<span class='multiSmall'>${getTimeLength(Number(r.bestSubmissionTimeSeconds * 1000))}</span>`}`;
					var tt = $(`<td>${s}</td>`);
					if (user.party.members.length != 0 && s != "") {
						tt.css("cursor", "pointer");
						tt.attr("contestId", data.contest.id);
						tt.attr("handle", user.party.members[0].handle);
						tt.attr("startTime", user.party.participantType == "PRACTICE" ? 0 : user.party.startTimeSeconds);
						tt.attr("participantType", user.party.participantType);
						tt.attr("problemId", data.problems[i].index);
						tt.addClass("eventLister");
					}
					q += tt.prop("outerHTML");
				}
				bd.append(`<tr class="${t % 2 == 1 ? "multiOddLine" : ""}">${q}</tr>`);
			}
			$(".eventLister").unbind("click").click(function() {
				var cid = Number($(this).attr("contestId"));
				var had = $(this).attr("handle");
				var stt = Number($(this).attr("startTime"));
				var ptt = $(this).attr("participantType");
				var pid = $(this).attr("problemId");
				$(".eventContainer").css("display", "grid");
				setTimeout(function() {
					$(".eventContainer").css("opacity", "1");
				}, 50);
				$(".eventList").html(`<div style="width: 100%; height: 100%; display: grid; place-items: center"><i class="fas fa-3x fa-spin fa-sync-alt"></i></div>`)
				eventAjax = $.ajax({
					url: generateAuthorizeURL(settings.codeforcesApiUrl + '/contest.status', {
						contestId: cid,
						handle: had
					}),
					timeout: settings.largeTimeLimit,
					success: function(json) {
						eventAjax = null;
						if (json.status != "OK")
							$(".eventList").html(`<div style="width: 100%; height: 100%; display: grid; place-items: center"><i class="fas red fa-3x fa-unlink"></i></div>`)
						else {
							json = json.result;
							var useful = [];
							for (var i = json.length - 1; i >= 0; i--) {
								var q = json[i];
								var _stt = q.author.startTimeSeconds;
								if (_stt == undefined || q.author.participantType == "PRACTICE")
									_stt = 0;
								if (q.author.participantType != ptt || _stt != stt || (pid != undefined && pid != q.problem.index))
									continue;
								useful.push(q);
							}
							$(".eventList").html('');
							for (var i = 0; i < useful.length; i++) {
								var tim = "";
								var curr = useful[i];
								if (stt == 0)
									tim = (new Date(curr.creationTimeSeconds * 1000).pattern("yyyy/MM/dd hh:mm"));
								else
									tim = getTimeLength2((curr.creationTimeSeconds - stt) * 1000);
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
								vid.attr("onclick", `openSubmission(${cid}, ${curr.id})`);
								vid.css("cursor", "pointer");
								vid = vid.prop("outerHTML");
								$(".eventList").append(`<p>${tim} ${pid == undefined ? `<span style="text-decoration: underline; display: inline-block; padding: 0px 3px; width: 20px; text-align: center">${curr.problem.index}</span> ` : ""}${vid}${curr.points != undefined || curr.pointsInfo != undefined ? ` | ${curr.pointsInfo != undefined ? curr.pointsInfo : curr.points}` : ""} [${toDetailedTestset(curr.testset)}]</p>`)
							}
						}
					},
					error: function() {
						$(".eventList").html(`<div style="width: 100%; height: 100%; display: grid; place-items: center"><i class="fas red fa-3x fa-unlink"></i></div>`)
					}
				})
			})
		}, function() {
			setTimeout(calcStandingList, 2000);
		})
	}
	delete(data);
	calcStandingList();
}

function fetchStandingsMainTrack() {
	flushMultiStatusBar(localize("multiLoading"), false);
	var cid = Number($(".multiContestIdInput").val());
	var t = $(".multiFetchTypeSelect > div.chosen");
	var idx = $(".multiFetchTypeSelect > div").index(t);
	var v = $(".multiContestInfoInput").val();
	t = $(".multiUnofficialSelecter > span.chosen");
	var sof = $(".multiUnofficialSelecter > span").index(t) == 1;
	var pg = Number($(".multiPageSelecter > .number.chosen").html());
	var l = (multiCurrentPage - 1) * pg + 1;
	var uList = [];
	var room = 0;
	if (idx == 0) {
		var u = v.split(";");
		var uList = [];
		for (var i = 0; i < u.length; i++)
			if ($.trim(u[i]) != "")
				uList.push($.trim(u[i]));
	} else if (idx == 1) {
		var u = v.split(";");
		var uList = [];
		for (var i = 0; i < u.length; i++)
			if ($.trim(u[i]) != "")
				uList.push($.trim(u[i]));
		if (currentLoginHandle != "")
			uList.push(currentLoginHandle);
	} else {
		room = Number(v);
	}
	loadMultiList(cid, uList, room, sof, l, pg, function(data) {
		multiRenderList(data);
	}, function() {
		flushMultiStatusBar(localize("fetchError"), true);
	})
}

function multiBeforeStart() {
	var cid = $(".multiContestIdInput").val();
	if (!queryNumber.test(cid)) {
		flushMultiStatusBar(localize("multiContestIdError"), true);
		return;
	}
	var t = $(".multiFetchTypeSelect > div.chosen");
	var idx = $(".multiFetchTypeSelect > div").index(t);
	var v = $(".multiContestInfoInput").val();
	if (idx == 0) {
		var u = v.split(";");
		var uList = [];
		for (var i = 0; i < u.length; i++)
			if ($.trim(u[i]) != "")
				uList.push($.trim(u[i]));
		var chk = true;
		for (var i = 0; i < uList.length; i++)
			chk &= (uList[i].length >= 3 && uList[i].length <= 24 && queryUsrename.test(uList[i]));
		if (!chk) {
			flushMultiStatusBar(localize("multiUsernameError"), true);
			return;
		}
	} else if (idx == 1) {
		;
	} else {
		if (!queryNumber.test(v) || Number(v) == 0) {
			flushMultiStatusBar(localize("multiRoomError"), true);
			return;
		}
	}
	fetchStandingsMainTrack();
}

function multiPageIndexClick() {
	var inp = $(`<input info="newPage" style="width: 100%; height: 100%; font-size: 18px; background: inherit; border: 0px; border-bottom: 1px solid grey; color: inherit; outline: 0; font-family: var(--font-family); text-align: center"></input>`);

	function check() {
		var val = inp.val();
		if (!queryNumber.test(val) || Number(val) <= 0 || Number(val) > 99999) {
			inp.remove();
			$(".multiPageIndex").append(`<span class="multiPageIndexNumber" style="cursor: pointer" onclick="multiPageIndexClick()">${multiCurrentPage}</span>`);
			flushMultiStatusBar(localize("pageIdError"), true);
			return;
		}
		flushMultiStatusBar(localize("ok"), false);
		multiCurrentPage = Number(val);
		inp.remove();
		multiBeforeStart();
		$(".multiPageIndex").append(`<span class="multiPageIndexNumber" style="cursor: pointer" onclick="multiPageIndexClick()">${multiCurrentPage}</span>`);
	}
	inp.bind('keydown', function(event) {
		if (event.keyCode == "13") {
			check();
		}
	});
	inp.on('blur', function() {
		check();
	})
	$(".multiPageIndex span").remove();
	$(".multiPageIndex").append(inp);
	inp.focus();
}

$(".multiClickToFetch").click(function() {
	multiCurrentPage = 1;
	$(".multiPageIndexNumber").html(multiCurrentPage);
	multiBeforeStart();
})

$(".multiPageSelecter > .number").click(function() {
	$(".multiPageSelecter > .number.chosen").removeClass("chosen");
	$(this).addClass("chosen");
	multiCurrentPage = 1;
	$(".multiPageIndexNumber").html(multiCurrentPage);
	multiBeforeStart();
})
$(".multiUnofficialSelecter > span").click(function() {
	$(".multiUnofficialSelecter > span").removeClass("chosen");
	$(this).addClass("chosen");
	multiBeforeStart();
})
$(".multiPagePrev").click(function() {
	setTimeout(function() {
		multiCurrentPage = Math.max(1, multiCurrentPage - 1);
		$(".multiPageIndexNumber").html(multiCurrentPage);
		multiBeforeStart();
	}, 50);
})
$(".multiPageNext").click(function() {
	setTimeout(function() {
		multiCurrentPage = Math.min(99999, multiCurrentPage + 1);
		$(".multiPageIndexNumber").html(multiCurrentPage);
		multiBeforeStart();
	}, 50);
})
$(".eventCloseButton").click(function() {
	if (eventAjax != null)
		eventAjax.abort(), eventAjax = null;
	$(".eventContainer").css("opacity", "0");
	setTimeout(function() {
		$(".eventContainer").css("display", "none");
	}, 500);
})