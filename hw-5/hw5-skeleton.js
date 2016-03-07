$(document).ready(function() {
	$('#results-container').hide();
	$('#playlist-container').hide();

	$('#submit-btn').click(function(){
		var query = $('#songSearch').val(); // get the value of the search field

		// check if there are already results
		// if so, clear previous results out, then call the API / run the search
		if ($('#results-container').is(':empty')) {
			callAPI(query);
		} else {
			$('#results-list ul').empty();
			callAPI(query);
		}

	});

	$(document).on('click', '#add-btn', function() {
		var addSongArtist = $(this).siblings('.resultArtist');
		var addSongTitle = $(this).siblings('.resultSong');
		var addSongPermalink = $(this).siblings('#play-btn');

		console.log(addSongPermalink.attr("onclick"));;

		$('#playlist ul').prepend('<li>' +
			'<div class="playlist-left"><div class="move-arrows">' +
			'<input type="image" class="move up" title="move up" src="img/up.png" />' +
			'<input type="image" class="move down" title="move down" src="img/down.png" />' +
			'</div></div><div class="playlist-middle"><span class="resultArtist">' + 
			addSongArtist.text() + '</span><br/><span class="resultSong">' + 
			addSongTitle.text() + '</span></div><div class="playlist-right">' + 
			'<button id="play-btn" onclick=' + addSongPermalink.attr('onclick') + 
			'>&#9658; Play Song</button><input type="button" class="remove" value="&#8211; Remove"></li>');
	});

	$(document).on('click', 'input', function() {
		var songItem = $(this).parent().parent().parent('li');
		var removeItem = $(this).parent().parent('li');
		var prevItem = songItem.prev();
		var nextItem = songItem.next();

		if ($(this).hasClass('up')) {
			songItem.insertBefore(prevItem);
		} else if ($(this).hasClass('down')) {
			songItem.insertAfter(nextItem);
		} else if ($(this).hasClass('remove')) {
			removeItem.remove();
		}
	});

})

// Event hander for calling the SoundCloud API using the user's search query
function callAPI(query) {
	$('#results-container').fadeIn('fast');
	$('#playlist-container').fadeIn('fast');
	$.get("https://api.soundcloud.com/tracks?client_id=b3179c0738764e846066975c2571aebb",
		{'q': query,
		'limit': '200'},
		function(data) {
			processSoundCloud(data);
		},'json'
	);
}

function processSoundCloud(data) {
	// for each result, display:
		// Song Title - "title"
		// Artist - user > "username"
		// Picture - "artwork_url"
			// if picture is null, return placeholder
	// show only 20 results
	for (i = 0; i < 21; i++) {
		var resultSong = data[i]["title"]
		var resultArtist = data[i]["user"]["username"]
		var resultPicture = data[i]["artwork_url"]
		var resultPermalink = data[i]["permalink_url"]

		console.log(data[i]["tag_list"]);

		if (resultPicture === null) {
			resultPicture = "img/placeholder.png"
		}

		$('#results-list ul').append('<li>' +
			'<img class="resultPicture" src="'+resultPicture+'"/>' + 
			'<div class="new-item"><span class="resultArtist">' + 
			resultArtist + '</span><br/><span class="resultSong">' + 
			resultSong + '</span><br/><button id="play-btn" onclick="changeTrack(' + 
			"'" + resultPermalink + "'" + ')">&#9658; Play Song</button><button id="add-btn">' + 
			'&#43; Add to Playlist</button></div></li>');
	}

}


// 'Play' button event handler - play the track in the Stratus player
function changeTrack(resultPermalink) {

	// Remove any existing instances of the Stratus player
	$('#stratus').remove();

	// Create a new Stratus player using the clicked song's permalink URL
	$.stratus({
      key: "b3179c0738764e846066975c2571aebb",
      auto_play: true,
      animate: "slide",
      theme: "https://stratus.soundcloud.com/themes/dark.css",
      align: "bottom",
      links: resultPermalink
    });

}