//make new video first phase "Recording"
function makeVideo() { 
	var videoIndex = $('#selVideo').val();
	if (variables.action == "idle") {
		variables.action = "video1";
		$("#btVideo").attr("Value", "Recording");
		lockButtons();
		setTimeout(makeVideoPhase2, video_stats[videoIndex].time1 * 1000);
	} else {
		addMessage("Wrong action state in makeVideo", "error");
		variables.action = "idle";
	}
}

//make new video second phase "Editing", add health accordingly
function makeVideoPhase2() {
	var videoIndex = $('#selVideo').val();
	if (variables.action == "video1") {
		variables.action = "video2";
		$("#btVideo").attr("Value", "Editing");
		addHealth(video_stats[videoIndex].hp);
		setTimeout(makeVideoPhase3, video_stats[videoIndex].time2 * 1000);
	} else {
		addMessage("Wrong action state in makeVideoPhase2", "error");
		variables.action = "idle";
	}
}

//Reset to "idle", add video, call videoEvent, add health and views accordingly
function makeVideoPhase3() {
	var videoIndex = $('#selVideo').val();
	if (variables.action == "video2") {
		addVideo(1);
		addHealth(video_stats[videoIndex].hp);
		messageVideo();
		
		addViews(Math.floor((variables.subscriber + variables.extraSubs) * video_stats[videoIndex].multiplyer));
		
		if (videoIndex == 4) { //decides if soapbox video or not
			videoEventID(6); // special event for soap box video
		} else {
			videoEvent();
		}
		
		variables.action = "idle";
		$("#btVideo").attr("Value", "Make a Video");
		unlockButtons();
	} else {
		addMessage("Wrong action state in makeVideoPhase3", "error");
		variables.action = "idle";
	}
}

//toggle sleep State
function sleep() {
	if (variables.action == "sleep") {
		messageSleep();
		variables.action = "idle";
		unlockButtons();
	} else {
		variables.action = "sleep";
		lockButtons();
	}
}

//eat and lock button
function eat(btn) {
	$("#btEat"+btn).attr("disabled", "disabled");
	addHealth(food[btn].hp);
	addMessage(food[btn].message + "[+" + food[btn].hp + "HP]");
	setTimeout(function() {unlockEat(btn);}, food[btn].time*1000);
}

function unlockEat(btn){
	$("#btEat"+btn).removeAttr("disabled");
}

function lockButtons() {
	 $("#btVideo").attr("disabled", "disabled");
	 $("#btSleep").attr("disabled", "disabled");
	 $("#selVideo").attr("disabled", "disabled");
}

function unlockButtons() {
	$("#btVideo").removeAttr("disabled");
	$("#btSleep").removeAttr("disabled");
	$("#selVideo").removeAttr("disabled");
}
