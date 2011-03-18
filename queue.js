// Globals
var queue = [];

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