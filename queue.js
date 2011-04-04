// Globals
var queue = [];
var queuePos = 0;
var currentlyPlaying = false;
var youtubeplayer;

// Search options
var orderby = "relevance";
var time = "all_time";

// Change title and now playing header
var nowPlaying = function(title)  {
    document.title = title;
    $("#nowPlaying").text(title);
}

// autocomplete suggest
var suggestTerm = function(request, responseCB) {
	jQTubeUtil.suggest(request.term, 
		function(response) {
			responseCB(response.suggestions);
		}
	);
};

// Play whatever's on queue
var playNext = function() {
	if (currentlyPlaying) {
		togglePlay();
	}
	
    var next = queue[queuePos];
    if (!next) {
    	return false;
    }
    
    jQTubeUtil.video(next,function(response){
         nowPlaying(response.videos[0].title);
    });
    
    jQuery("#player").tubeplayer("play", next);
};

var togglePlay = function() {
	if (currentlyPlaying)
		jQuery("#player").tubeplayer("pause");
	else
	    jQuery("#player").tubeplayer("play");
};

// Callback for the search form. 
var searchCB = function(response) {
    var html = ""; 
    	for(vid in response.videos){
    		var video = response.videos[vid];
            html += "<div class=\"videoResult\">";
    		html += "<div class=\"videoThumb\">";
    		html += "<a href=\"#\" onClick=\"addToQueue('" + video.videoId + "')\">";
    		html += "<img src=\"http://img.youtube.com/vi/" + video.videoId + "/3.jpg\"></a>";
    		html += "</div>";
    		html += "<div class=\"videoTitle\">";
    		html += "<a href=\"#\" onClick=\"addToQueue('" + video.videoId + "')\">" + video.title + "</a>";
    		html += "</div>";
            html += "</div>";
    	}
    $("#searchResults").html(html);
};

// Takes from the front of the queue
var popQueue = function() {
	if (queue.length > 0) {
		var next = queue.shift();
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
        html += "<li>";
    	html += "<img src=\"http://img.youtube.com/vi/" + queue[vid] + "/3.jpg\"></a>"; 
        html += "</li>";
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
	if (queue.length > 0) {
		playNext();
	}
	else
		currentlyPlaying = false;
};

$(document).ready(function() {
    var leftPanelWidth = $("#leftPanel").width();
	// set up player
    jQuery("#player").tubeplayer({
        width: leftPanelWidth,
        height: (leftPanelWidth/4)*3,
    	playerID: "youtube-player", // the ID of the embedded youtube player
        initialVideo: "0GLoHifu6aM",
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
    
    $("#searchForm").submit(function(event) {
        jQTubeUtil.search({
        	"q": $("#searchTextBox").val(),
        	"time": time,
        	"orderby": orderby,
        	"max-results": 25}, searchCB);
        $("#searchTextBox").autocomplete("close");
        event.preventDefault();
    });
    
    // form that takes url and queues it
    $("#videoEntryForm").submit(function(event) {
    	var url = $("#videoEntryBox").val();
        var results = url.match("[\\?&]v=([^&#]*)");
        
        if (results != null) {        
            addToQueue(results[1]); // results[1] is the video ID
        }
        
        $("#videoEntryBox").val("");
        event.preventDefault();
    });
    
    $("#searchTextBox").autocomplete(
    	{source:suggestTerm,
    	autoFill: true}
    );
    
    $("#searchTextBox").focus();
});