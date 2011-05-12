// Globals
var queue = new Array();
var queuePos = -1;
var currentlyPlaying = false;
var player;

// Search options
var orderby = "relevance";
var time = "all_time";

$(document).ready(function() {
    var leftPanelWidth = $("#leftPanel").width();
    
	// set up player
    player = jQuery("#player").tubeplayer({
        width: leftPanelWidth,
        height: (leftPanelWidth/4)*3,
    	playerID: "ytplayer", // the ID of the embedded youtube player
        initialVideo: "0GLoHifu6aM",
        iframed: true,
    	preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
    	onPlay: function(id){}, // after the play method is called
    	onPause: function(){}, // after the pause method is called
    	onStop: function(){currentlyPlaying = false;}, // after the player is stopped
    	onSeek: function(time){}, // after the video has been seeked to a defined point
    	onMute: function(){}, // after the player is muted
    	onUnMute: function(){}, // after the player is unmuted
    	onPlayerPlaying: function() {onPlayCB();}, // after the player starts playing
    	onPlayerEnded: function(){onStopCB();}
    });
        
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
	             addToQueue(results[1], response.videos[0].title);
            });
        
        $("#videoEntryBox").val("Enter Youtube URL");
        event.preventDefault();
    });
    
    // if user didn't enter anything put default instructions back
    $("#videoEntryBox").blur(function(event) {
        if (this.value == "")
            this.value = "Enter Youtube URL";
    });
    
    // Autocomplete initialization
    $("#searchTextBox").autocomplete(
    	{source:suggestTerm,
    	autoFill: true,
        delay: 100}
    );
    
    // initially select the thing
    $("#searchTextBox").select();
    
    addToQueue("0GLoHifu6aM", "Placeholder Video");
});