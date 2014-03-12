function addMessage(message, type) {
	// Fetch the MessageBox
	var messageBox = $("#log"); 
	
	// New message container
	var divTag = $('<div>').css({opacity:0}).html(message); 

	if (typeof type === 'undefined') {
		divTag.attr('id', 'aMessage');
	} else {
		divTag.attr('id', type);
	}

	var count = $("#log").children().length;
	if (count >= MAX_LOG) {
		$("#log div:last").remove();
	}

	messageBox.prepend(divTag);
	divTag.animate({opacity: 1}, 400, 'linear');
}

function messageVideo() {
	if (variables.videos == 1) {
		addMessage("You have made your first video");
	}
	if (variables.videos > 9) {
		if (variables.videos < 100 && variables.videos % 10 == 0) {
			addMessage("You have made your " + variables.videos + "th video");
		} else if (variables.videos >= 100 && variables.videos % 100 == 0) {
			addMessage("You have made your " + variables.videos + "th video");
		}
	}
}

var healthLowSend = false;

function messageHealthLow() {
	if (healthLowSend == false && variables.health < 10) {
		healthLowSend = true;
		addMessage("Your health is low");
	} else if (healthLowSend == true && variables.health >= 10) {
		healthLowSend = false;
	}
}