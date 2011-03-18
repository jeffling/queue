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
}

$(document).ready(function() {
    $('#searchBox').submit(function() {
      jQTubeUtil.search($("#textbox").val(), searchCB);
      return false;
    });
    
})