// Globals
var queue = new Array();
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
};

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
    
    return play(next);
};

// Play whatever's on queue previous
var playPrev = function() {
    if (queuePos < 1)
        return false;
        
    queuePos--;
    
    return play(queue[queuePos]);
};

var play = function(vid) {   
    if (currentlyPlaying) {
    	togglePlay();
	}

    nowPlaying(unescape(vid.title));
    
    jQuery("#player").tubeplayer("play", vid.id);
    updateQueue();
    return false;
}

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

// Delete from queue 
var delFrom = function(index) {
    var wasPlaying = currentlyPlaying;
    if (queuePos == index) 
        togglePlay();
        
    queue.splice(index, 1);
    
    if (wasPlaying && (queuePos == index))
        play(queue[queuePos]);
        
    updateQueue();
    return false;
}

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

