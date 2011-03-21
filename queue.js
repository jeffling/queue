// Globals
var queue = [];
var currentlyPlaying = false;

// Play whatever's on queue
var playNext = function() { 
    var next = queue.pop();
    alert(next);
    // Example code from library... Should figure out how I want this to be
    jQuery("#player").tubeplayer({
    	width: 600, // the width of the player
    	height: 450, // the height of the player
    	allowFullScreen: "true", // true by default, allow user to go full screen
    	initialVideo: next, // the video that is loaded into the player
    	playerID: "youtube-player", // the ID of the embedded youtube player
    	preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
    	onPlay: function(id){currentlyPlaying = play;}, // after the play method is called
    	onPause: function(){currentlyPlaying = false;}, // after the pause method is called
    	onStop: function(){currentlyPlaying = false;}, // after the player is stopped
    	onSeek: function(time){}, // after the video has been seeked to a defined point
    	onMute: function(){}, // after the player is muted
    	onUnMute: function(){} // after the player is unmuted
    });
    }

// Callback for the search form. 
var searchCB = function(response) {
    var html = "";
    	for(vid in response.videos){
    		var video = response.videos[vid];
    		html += "<p><div class=\"videoThumb\">";
    		html += "<a href=\"http://www.youtube.com/watch?v=" +  video.videoId + "\">";
    		html += "<img src=\"http://img.youtube.com/vi/" + video.videoId + "/3.jpg\"></a>";
    		html += "</div>";
    		html += "<div class=\"videoTitle\">";
    		html += "<a href=\"http://www.youtube.com/watch?v=" +  video.videoId + "\">" + video.title + "</a>";
    		html += "</div></p>";
    	}
    $("#searchResults").html(html);
    setClickBind();
}

// Put to the back of the queue
var addToQueue = function(vid) {
    queue.push(vid);
    if (queue.length == 1) {
       playNext();
    } 
}

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
}

$(document).ready(function() {
    setClickBind();
    // $("#player").tubeplayer("player");
    $('#searchBox').submit(function(event) {
        jQTubeUtil.search($("#textbox").val(), searchCB);
        event.preventDefault();
    });
})