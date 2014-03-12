/*
 *	Version 0.14.3.08
 *	Created by Doofmars - www.doofmars.de
 *	Copyright 2014 Doofmars
 *	Released under the MIT license
 *
 *	This is an unofficial fan project. Solely to parody the typical life of a YouTuber like Dan
 *	This Project is created in my free time and out of fun and passion.
 *	The game requires Javascript to run, and you are looking at the source code,
 *	so you are doing it wrong, if you just want to play.
 *	Feel free to make your own adaptation of the game and please share the results.
 *
 *	Thank you for Playing!
 *
 */

// Initialize variables and start the heartbeat
function init() {
	if (DEBUG) {
		debugMode();
	}

	var saved = read_cookie("chocolateChipCookie");
	if (saved != null) {
		variables = saved;
		addMessage('Game has been sucessfully loaded! Click <a id="restartGame">here</a> to restart the game');
		$('#restartGame')
			.click(function () {
				delete_cookie("chocolateChipCookie");
				window.location.reload();
			});
		setButtons();
		updateAll();
	}

	nIntervId = setInterval(heartbeat, 1000);
	initWindows();
	$('#selVideo').val("0");
}

// Locks/unlocks the buttons
function setButtons() {
	if (variables.action !== "idle") {
		lockButtons();
		if (variables.action == "video1") {
			$("#btVideo").attr("Value", "Recording...");
		} else if (variables.action == "video1") {
			$("#btVideo").attr("Value", "Editing...");
		}
	}
	for (var i = 1; i < variables.timer.length; i++) {
		if (variables.timer[i] > 0) {
			$("#btEat" + (i - 1)).attr("disabled", "disabled");
		}
	}
}

// Main function that runs the game
function heartbeat() {
	if (DEBUG) {
		$('textarea#debug').val(JSON.stringify(variables));
	}
	
	// Add health while sleeping
	if (variables.action == "sleep") { 
		addHealth(10);
	} else {
		addHealth(-0.1);
	}
	if (GAME_OVER) {
		stopHeartbeat();
	}

	messageHealthLow(); //message if health is critical
	newSubscriber();
	newViews();
	decrementTimer();

	update();
}

// Stop the heartbeat and displays the game over message
function stopHeartbeat() {
	GAME_OVER = true;
	addMessage("Game over! Score: [insert score here]", "error"); // TODO: How is the score calculated?
	delete_cookie("chocolateChipCookie");
	clearInterval(nIntervId);
}

// Add new subscribers; maximum subscribers/videos: subscribers = (videos^4)/14666
function newSubscriber() {
	var rand = Math.random();
	var limiter = ((Math.pow(variables.videos, 4) / 14666) - variables.subscriber);
	newSubs = Math.floor(limiter * rand);
	addSubscribers(newSubs);
}

// Add some views, handle cold videos and save game
function newViews() {
	if (variables.cooldown <= 0) {
		variables.cooldown = COOLDOWNTIME_VIDEO;
		bake_cookie("chocolateChipCookie", variables, 14); // Save game in a cookie every COOLDOWNTIME_VIDEO seconds

		if (variables.videos - variables.coldVideos > 10) {
			variables.coldVideos++;
			if (DEBUG) {
				console.log("coldVideos=" + variables.coldVideos);
			}
		}
	}
	variables.cooldown--;
	addViews(variables.videos - variables.coldVideos);
}

// Update timer interval, handle button lock time (and being able to save them)
function decrementTimer() {
	if (variables.timer[0] == 0) {
		if (variables.action == "video1") {
			variables.timer[0] = -1;
			makeVideoPhase2();
		} else if (variables.action == "video2") {
			variables.timer[0] = -1;
			makeVideoPhase3();
		} else if (variables.action == "idle") {
			variables.timer[0] = -1;
			unlockButtons();
		}
	}
	
	for (var i = 0; i < variables.timer.length; i++) {
		if (variables.timer[i] > 0) {
			variables.timer[i] = variables.timer[i] - 1;
		}
		if (i > 0 && variables.timer[i] == 0) {
			unlockEat(i - 1);
			variables.timer[i] = -1;
		}
	}
}

// Update views and subscribers, add research button
function update() {
	$('#row_views_val').html(variables.views);
	if (variables.subscriber + variables.extraSubs < 0) {
		$('#row_sub_val').html(0);
	} else {
		$('#row_sub_val').html(variables.subscriber + variables.extraSubs);
	}

	if (variables.videos > 2 && $('#research')
		.length == 0) {
		var research = $('<div>')
			.attr('class', 'inline-div')
			.attr('id', 'research')
			.insertAfter("#sleep");
		$('<input type="button" onclick="researchWindow()">')
			.attr("Value", "Research")
			.css({opacity:0})
			.appendTo(research)
			.animate({opacity: 1}, 1000, 'linear');
	}

	var selector = $('select#selVideo');

	// Create the video type selector if it doesn't exist
	if (variables.typesUnlocked > 0 && selector.length == 0) {
		selector = $('<select id="selVideo">')
			.css({opacity:0})
			.appendTo('#video')
			.animate({opacity: 1}, 1000, 'linear');
	}

	// Add options to the selector
	for (var i = 0; i < video_stats.length; i++) { 
		if (variables.typesUnlocked > i && $('select#selVideo option[value=' + i + ']').length == 0) {
			if (DEBUG) {
				console.log("Type " + i + " Unlocked");
			}
			selector.append($('<option>')
				.attr("value", i)
				.text(video_stats[i].title));
		}
	}

	var foodContainer = $('#food');

	// Create the food container if it doesn't exist
	if (variables.foodUnlocked > 0 && foodContainer.length == 0) {
		console.log("t2=" + foodContainer.lenght === 0);
		foodContainer = $('<div>')
			.css({opacity:0})
			.attr('id', 'food')
			.insertAfter('#video')
			.animate({opacity: 1}, 1000, 'linear');
	}

	// Add food-specific buttons
	for (var i = 0; i < food_stats.length; i++) {
		if (variables.foodUnlocked > i && $('#btEat' + i)
			.length == 0) {
			// if (DEBUG) {console.log("Food " + i + " Unlocked"); }
			$('<input type="button" onClick="eat(' + i + ')">')
				.css({opacity:0})
				.attr('id', 'btEat' + i)
				.attr('Value', food_stats[i].name)
				.appendTo(foodContainer)
				.animate({opacity: 1}, 1000, 'linear');
		}
	}
}

// Update everything (views, subscribers, health and videos)
function updateAll() {
	update();
	$('#row_health_val').html(variables.health.toFixed(1)); // Make sure that the decimal is always displayed
	$('#row_videos_val').html(variables.videos);
}

// Save the game in a cookie
function bake_cookie(name, value, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

	// var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	var cookie = [name, '=', JSON.stringify(value), '; expires=.', d.toGMTString(), '; path=/;'].join('');
	document.cookie = cookie;

	$('#saveNotify')
		.css('opacity', 1)
		.animate({opacity: 1}, 2000, 'linear')
		.css('opacity', 1)
		.animate({opacity: 0}, 5000, 'linear');
	if (DEBUG) {
		console.log("Saved: " + JSON.stringify(value));
	}
}

// Load game from a cookie and validate
function read_cookie(name) {
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));

	if (validateSave(result)) {
		if (DEBUG && result != null) {
			console.log("Loaded: " + JSON.stringify(result));
		}
		return result;
	} else {
		return null;
	}
}

function delete_cookie(name) {
	// document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; ', window.location.host.toString()].join('');
	document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/'].join('');
	if (DEBUG) {
		console.log("Cookie Deleted: " + name);
	}
}

function validateSave(save) {
	if (save == null) {
		if (DEBUG) {
			console.log("Loading Error: Input is null");
		}
		return false;
	}

	// Try block for checking the timer attribute (see if it exists and if enough fields are set)
	try {
		if (save.timer.length === variables.timer.length) {
			for (var i = 0; i < variables.timer.length; i++) {
				if (typeof (save.timer[i]) !== 'number') {
					if (DEBUG) {
						console.log("Loading Error: timer " + i + " is !== 'number'");
					}
					return false;
				}
			}
		} else {
			if (DEBUG) {
				console.log("Loading Error: timer.length is different");
			}
			return false;
		}
	} catch (e) {
		if (DEBUG) {
			console.log("Loading Error: " + e);
		}
		return false;
	}

	// Check the rest of the JQuery object (see if an attribute exists and if it is of the correct type
	if (typeof (save.views) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof views mismatch");
		}
	} else if (typeof (save.videos) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof videos mismatch");
		}
	} else if (typeof (save.videoID) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof videoID mismatch");
		}
	} else if (typeof (save.coldVideos) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof coldVideos mismatch");
		}
	} else if (typeof (save.cooldown) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof cool down mismatch");
		}
	} else if (typeof (save.subscriber) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof subscriber mismatch");
		}
	} else if (typeof (save.extraSubs) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof extraSubs mismatch");
		}
	} else if (typeof (save.health) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof health mismatch");
		}
	} else if (typeof (save.foodUnlocked) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof foodUnlocked mismatch");
		}
	} else if (typeof (save.typesUnlocked) !== 'number') {
		if (DEBUG) {
			console.log("Loading Error: typeof typesUnlocked mismatch");
		}
	} else if (typeof (save.action) !== 'string') {
		if (DEBUG) {
			console.log("Loading Error: typeof action mismatch");
		}
	} else {
		return true;
	}
	return false;
}

/*
 * Debug tools
 */

// Send message and create an array of debug-related buttons
function debugMode() {
	addMessage("Debug is On");

	var debug = $('<div>')
		.attr('id', 'debug')
		.appendTo("#debug-window");
	$('<input type="button" onclick="stopHeartbeat()">')
		.attr("Value", "Stop")
		.appendTo(debug);
	$('<input type="button" onclick="unlockButtons(); unlockEat(0); unlockEat(1); unlockEat(2);">')
		.attr("Value", "Unlock")
		.appendTo(debug);
	$('<input type="button" onclick="addHealth(-10)">')
		.attr("Value", "Punch")
		.appendTo(debug);
	$('<input type="button" onclick="addHealth(variables.health * 2)">')
		.attr("Value", "Heal")
		.appendTo(debug);
	$('<input type="button" onclick="addVideo(1)">')
		.attr("Value", "Make a Video")
		.appendTo(debug);
	$('<input type="button" onclick="addExtraSubs(1)">')
		.attr("Value", "Sub")
		.appendTo(debug);
	$('<input type="button" onclick="test()">')
		.attr("Value", "Test")
		.appendTo(debug);
	$('<textarea id="debug" wrap="on" style="width: 603px; height: 148px;" >')
		.appendTo("#debug-window");
}

function test() {
	showEvent(1);
}

/*
 * Setters
 */
function addVideo(value) {
	if (!GAME_OVER) {
		if (variables.videos + value >= 0) {
			variables.videos = variables.videos + value;
		}
	}
	$('#row_videos_val')
		.html(variables.videos);
}

function addHealth(value) {
	if (!GAME_OVER) {
		variables.health = Math.round10(variables.health + value, -1);
		if (variables.health + value >= 100 && variables.action == "sleep") {
			variables.health = 100.0;
			sleep();
		}
		if (variables.health < 0.1) {
			$('#row_health_val').html("dead");
			GAME_OVER = true;
		} else {
			$('#row_health_val').html(variables.health.toFixed(1)); // Make sure that the decimal is always displayed
		}
	}
}

function addSubscribers(value) {
	if (!GAME_OVER) {
		if (variables.subscriber + value >= 0) {
			variables.subscriber += value;
		}
	}
}

function addExtraSubs(value) {
	if (!GAME_OVER) {
		variables.extraSubs += value;
		if (DEBUG) {
			console.log("extraSubs=" + variables.extraSubs);
		}
	}
}

function addViews(value) {
	if (!GAME_OVER) {
		if (variables.views + value >= 0) {
			variables.views = variables.views + value;
		}
	}
}