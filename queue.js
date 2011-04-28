// Globals
var queue = [];
var queuePos = -1;
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
    queuePos++;
	var next = queue[queuePos];
    if (!next) {
        queuePos--;
        return false;
    }
    
    if (currentlyPlaying) {
		togglePlay();
	}

    nowPlaying(unescape(next.title));
    
    jQuery("#player").tubeplayer("play", next.id);
    updateQueue();
    return false;
};

// Play whatever's on queue previous
var playPrev = function() {
    if (queuePos < 1)
        return false;
        
    queuePos--;
    var next = queue[queuePos];
    
    if (currentlyPlaying) {
		togglePlay();
	}

    nowPlaying(unescape(next.title));
    
    jQuery("#player").tubeplayer("play", next.id);
    updateQueue();
    return false;
};

// Go between play/pause states
var togglePlay = function() {
	if (currentlyPlaying)
		jQuery("#player").tubeplayer("pause");
	else
	    jQuery("#player").tubeplayer("play");
};

// Put to the back of the queue
var addToQueue = function(vidId, vidTitle) {
    queue.push({id:vidId, title:vidTitle});

    // Autoplay if not currently playing
    if (!currentlyPlaying)
       playNext();
    
    updateQueue();
    return false;
};

// skips to a video in the queue given queue index
var skipTo = function(index) {
    if (index == queuePos)
        return false;
    
    if (currentlyPlaying)
    	togglePlay();


    nowPlaying(unescape(queue[index].title));
    queuePos = index;
    jQuery("#player").tubeplayer("play", queue[index].id);
    updateQueue();
    return false;
}

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
        html += "<li class=\"span-8 last queuedVideo\" ";
        if (queuePos == vid) {
            html += " id=\"currentVideo\" ";
        }
        html += ">";
        html += "<a href=\"#\" onClick=\"return skipTo(" + counter + ");\">";
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
        $("#queue-display").scrollTo("#currentVideo", 800);
        
};

// Video Stop Handler
var onStopCB = function() {
	if (queue.length > (queuePos+1) ) {
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
    	onPause: function(){}, // after the pause method is called
    	onStop: function(){currentlyPlaying = false;}, // after the player is stopped
    	onSeek: function(time){}, // after the video has been seeked to a defined point
    	onMute: function(){}, // after the player is muted
    	onUnMute: function(){}, // after the player is unmuted
    	onPlayerEnded: function(){onStopCB();}
    });

    // get the player reference just in case
    youtubeplayer = jQuery("#player").tubeplayer("player");
    
    // initialize rightPanel    
    $(window).resize(function(event) {    
        // makes sure the queue-display height is updated
        $("#queue-display").css({
            width: $("#rightPanel").width(),
            height: $(window).height() - ($("#playerControls").height() + $("#videoEntry").height())
        });
    });
    $(window).resize(); 
    
    // set some form behavior, thanks to 
    $("input, textarea").focus(function(event) {
            this.value = '';
    });
    
    // set search form call handlers
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
        
        if (results != null)   
            jQTubeUtil.video(results[1],function(response){
	             addToQueue(results[1], response[0].title);
            });
        
        
        $("#videoEntryBox").val("Enter Youtube URL");
        event.preventDefault();
    });
    
    // if user didn't enter anything put default instructions back
    $("#videoEntryBox").blur(function(event) {
        if (this.value == "")
            this.value = "Enter Youtube URL";
    });
    
    
    $("#searchTextBox").autocomplete(
    	{source:suggestTerm,
    	autoFill: true,
        delay: 100}
    );
    
    $("#searchTextBox").select();
});