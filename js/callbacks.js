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

// Update Queue List
var updateQueue = function() {
    
    // update queue list on UI
    var counter = 0;
    var html = "<ul>";
    for (vid in queue) {
        html += "<a href=\"#\" onClick=\"return skipTo(" + counter + ");\">";
        html += "<li class=\"span-8 last queuedVideo\" ";
        if (queuePos == vid) {
            html += " id=\"currentVideo\" ";
        }
        html += ">";
        html += "<div class=\"span-4 vidThumb\">";
    	html += "<img ";
        html += "src=\"http://img.youtube.com/vi/" + queue[vid].id + "/3.jpg\">";
        html += "</div> <div class=\"span-4 last vidTitle\">"; 
        html += "<h4>" + unescape(queue[vid].title) + "</h4>"; 
        html += "</div></li>";
        html += "</a>";
        counter++;
    }
    html += "</ul>";
    $("#queue-display").html(html);
    
    // make list scroll with current video TODO: doesn't quite work loll
    if (queue.length != 0)
        $("#queue-display").scrollTo("#currentVideo", 100);
        
};

// Video Stop Handler
var onStopCB = function() {
	if (queue.length > (queuePos+1) ) {
		playNext();
	}
	else
		currentlyPlaying = false;
};