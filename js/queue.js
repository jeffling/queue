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
    
    player.tubeplayer("play", vid.id);
    updateQueue();
    return false;
}

// Go between play/pause states
var togglePlay = function() {
	if (currentlyPlaying)
		player.tubeplayer("pause");
	else
	    player.tubeplayer("play");
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
    player.tubeplayer("play", queue[index].id);
    updateQueue();
    return false;
}


