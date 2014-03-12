function showEvent(eventID) {
	var messageBox = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
	$('<div>').addClass('eventTitle').text(events[eventID].title).appendTo(messageBox);
	$('<div>').attr('id', 'description').html(events[eventID].text).appendTo(messageBox);
	$('<div>').attr('id', 'buttons').appendTo(messageBox)
		.html('<input type="button" value="' + events[eventID].buttonA + '" onclick="removeEvents()">' +
			'<input type="button" value="' + events[eventID].buttonB + '" onclick="removeEvents()">');

	$('div#wrapper').append(messageBox);
	messageBox.animate({opacity: 1}, 400, 'linear');
}

function removeEvents() {
	$('div#event').remove();
}

// For each video (excluding soapbox) there is a 8/100 chance to get a random event from videoEventId; 
// the eventID is determined by rand
function videoEvent() {
	var rand = Math.floor(Math.random() * 100);
	videoEventID(rand);
}

// Sends random events that can occur when a new video is made;
// every option in videoEventId has to work with every type of video
function videoEventID(eventID) {
	switch (eventID) {
	case 1:
		addMessage("Oh no, YouTube ate <strong>one</strong> of your <strong>videos</strong>!");
		addVideo(-1);
		break;
	case 2:
		addMessage("D'oh! YouTube ate <strong>two</strong> of your <strong>videos</strong>!!");
		addVideo(-2);
		break;
	case 3:
		addMessage("The editing process was exhausting... <strong>-10 Health</strong>");
		addHealth(-10);
		break;
	case 4:
		addMessage("You've decided to split your video! <strong>+2 Videos</strong>");
		addVideo(1);
		break;
	case 5:
		addMessage("The video looks awesome and that cheered you up! <strong>+5 Health</strong>, woo-hoo!");
		addHealth(5);
		break;
	case 6:
		var upset = Math.floor((variables.subscriber + variables.extraSubs) / 10 * Math.random());
		if (upset > 0) {
			addMessage("The video has upset <strong>" + upset + "</strong> of your <strong>subscribers</strong> and they felt like leaving...");
			addExtraSubs(-upset);
		}
		break;
	case 7:
		var newSubs = 10;
		if (Math.floor((variables.subscriber + variables.extraSubs) / 5) > newSubs) {
			newSubs = Math.floor((variables.subscriber + variables.extraSubs) / 5);
		}
		addMessage("Your new video has gained some attention, you have <strong>" + newSubs + "</strong> new <strong>subscribers</strong>!");
		addExtraSubs(newSubs);
		break;
	case 8:
		addMessage("The editing failed and you have <strong>lost</strong> all of your footage. Well, dang.");
		addVideo(-1);
		break;
//	case 9:
//		addMessage("");
//		break;
//	case 10:
//		addMessage("");
//		break;
	}
}