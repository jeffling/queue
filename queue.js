var searchCB = function(response) {
    var html = "";
    	for(vid in response.videos){
    		var video = response.videos[vid];
    		html += "Video : " + video.title;
    	}
    alert(html);
}

$(document).ready(function() {
    $('#searchBox').submit(function() {
      jQTubeUtil.search($(), searchCB);
      return false;
    });
})