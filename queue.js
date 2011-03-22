// Globals
var queue = [];
var currentlyPlaying = false;
var youtubeplayer;

// Play whatever's on queue
var playNext = function() {
	if (currentlyPlaying) {
		togglePlay();
	}
	
    var next = popQueue();
    if (!next) {
    	return false;
    }
    
    jQuery("#player").tubeplayer("play", next);
};

var togglePlay = function() {
	if (currentlyPlaying)
		jQuery("#player").tubeplayer("stop");
	else
	    jQuery("#player").tubeplayer("play");
};

// Callback for the search form. 
var searchCB = function(response) {
    var html = ""; 
    	for(vid in response.videos){
    		var video = response.videos[vid];
    		html += "<p><div class=\"videoThumb\">";
    		html += "<a href=\"#\" onClick=\"addToQueue('" + video.videoId + "')\">";
    		html += "<img src=\"http://img.youtube.com/vi/" + video.videoId + "/3.jpg\"></a>";
    		html += "</div>";
    		html += "<div class=\"videoTitle\">";
    		html += "<a href=\"#\" onClick=\"addToQueue('" + video.videoId + "')\">" + video.title + "</a>";
    		html += "</div></p>";
    	}
    $("#searchResults").html(html);
};

// Takes from the front of the queue
var popQueue = function() {
	if (queue.length > 0) {
		var next = queue.pop();
	    updateQueue();
	    return next;
	}
	return false;
};

// Put to the back of the queue
var addToQueue = function(vid) {
    queue.push(vid);
    
    // if there is nothing playing, why not play the new video?
    if (!currentlyPlaying) {
       playNext();
    }
    updateQueue();
};

// Update Queue List
var updateQueue = function() {
    // update queue list on UI
    var html = "<ul>";
    for (vid in queue) {
    	html += "<li>" + queue[vid] + "</li>";
    }
    html += "</ul>";
    $("#queue-display").html(html);
};

/**
// set click event binding
var setClickBind = function() {
    // intercept all link clicks to recognize clicks to videos

    $("a").click( function(event) {
        var url = $(this).attr('href');
        var results = url.match("[\\?&]v=([^&#]*)");
        
        if (results != null) {        
            event.preventDefault();
            addToQueue(results[1]); // results[1] is the video ID
        }
    });
};
**/

// Video Stop Handler
var onStopCB = function() {
	if (queue.length < 0) {
		playNext();
	}
	else
		currentlyPlaying = false;
};

$(document).ready(function() {
	// set up player
    jQuery("#player").tubeplayer({
    	playerID: "youtube-player", // the ID of the embedded youtube player
    	preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
    	onPlay: function(id){currentlyPlaying = true;}, // after the play method is called
    	onPause: function(){currentlyPlaying = false;}, // after the pause method is called
    	onStop: function(){currentlyPlaying = false;}, // after the player is stopped
    	onSeek: function(time){}, // after the video has been seeked to a defined point
    	onMute: function(){}, // after the player is muted
    	onUnMute: function(){}, // after the player is unmuted
    	onPlayerEnded: function(){onStopCB();}
    });
    
    // get the player reference just in case
    youtubeplayer = jQuery("#player").tubeplayer("player");
    
    $('#searchBox').submit(function(event) {
        jQTubeUtil.search($("#textbox").val(), searchCB);
        event.preventDefault();
    });
});