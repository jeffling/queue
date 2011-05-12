// Callback for the search form. 
// Search Result Display
var searchCB = function(response) {
    
    // Update UI
    var html = ""; 
    	for(vid in response.videos){
    		var video = response.videos[vid];
            html += "<a href=\"#\" onClick=\"return addToQueue('" + video.videoId + "', '" + escape(video.title) + "');\">";
            html += "<div class=\"span-16 last videoResult\">";
    		html += "<div class=\"span-4 videoThumb\">";
    		html += "<img src=\"http://img.youtube.com/vi/" + video.videoId + "/3.jpg\">";
    		html += "</div>";
    		html += "<div class=\"span-12 last videoTitle\">";
    		html += "<h3>" + video.title + "</h3>";
    		html += "</div>";
            html += "</div>";
            html += "</a>";
    	}
    $("#searchResults").html(html);
    
    // Scroll to the text box after you press enter
    $(window).scrollTo("#searchTextBox", 800);
};

// Video Play Handler
var onPlayCB = function(ytplayer) {
    currentlyPlaying = true;
    
    // in case they used the related video feature of the player
    var url = player.tubeplayer('data').videoURL;
    var results = url.match("[\\?&]v=([^&#]*)");
    
    if (results != null) {
        if (results[1] != queue[queuePos].id) {
            jQTubeUtil.video(results[1],function(response){
                 queuePos++;
	             addToQueue(results[1], response.videos[0].title);	             
            });
        }
    }
}

// Video Stop Handler
var onStopCB = function() {
	if (queue.length > (queuePos+1) ) {
		playNext();
	}
	else
		currentlyPlaying = false;
};