$(document).ready(function() {
	$('#submit-btn').click(function(){
		var query = $('#songSearch').val(); // get the value of the search field

		// check if there are already results
		// if so, clear previous results out, then call the API / run the search
		if ($('#results-container').is(':empty')) {
			callAPI(query);
			displayResults();
		} else {
			$('#results-list ul').empty();
			callAPI(query);
			displayResults();
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
			'>Play Song</button><input type="button" class="remove" value="Remove"></li>');
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
	$.get("https://api.soundcloud.com/tracks?client_id=b3179c0738764e846066975c2571aebb",
		{'q': query,
		'limit': '200'},
		function(data) {
			processSoundCloud(data,"#results-list ul");
		},'json'
	);
}

function callAPIRelated(query) {
	$.get("https://api.soundcloud.com/tracks?client_id=b3179c0738764e846066975c2571aebb",
		{'q': query,
		'limit': '200'},
		function(data) {
			processSoundCloud(data,"#related-list ul");
		},'json'
	);
}

function processSoundCloud(data,ulContainer) {
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
		var resultRelated = data[i]["tag_list"]

		var searchTag = relatedTracks(resultRelated);

		if (resultPicture === null) {
			resultPicture = "img/placeholder.png"
		}

		$(ulContainer).prepend('<li>' +
			'<img class="resultPicture" src="'+resultPicture+'"/>' + 
			'<div class="new-item"><span class="resultArtist">' + 
			resultArtist + '</span><br/><span class="resultSong">' + 
			resultSong + '</span><br/><button id="play-btn" onclick="changeTrack(' + 
			"'" + resultPermalink + "'" + '); showRelatedTracks(' + "'" + searchTag + "'" + ')">Play Song</button><button id="add-btn">' + 
			'Add to Playlist</button></div></li>');
	}
}

function displayResults(results) {
	
	
	if (resultPicture === null) {
		resultPicture = "img/placeholder.png"
	}

	$('#results-list ul').prepend('<li>' +
		'<img class="resultPicture" src="'+resultPicture+'"/>' + 
		'<div class="new-item"><span class="resultArtist">' + 
		resultArtist + '</span><br/><span class="resultSong">' + 
		resultSong + '</span><br/><button id="play-btn" onclick="changeTrack(' + 
		"'" + resultPermalink + "'" + '); showRelatedTracks(' + "'" + searchTag + "'" + ')">Play Song</button><button id="add-btn">' + 
		'Add to Playlist</button></div></li>');
}

function relatedTracks(resultRelated) {
	var relatedArray = []

	console.log(relatedArray);

	// some tags are two words. find them by identifying by double quotes
	// remove the double quotes, then merge the two words together
	// DOESN'T ACCOUNT FOR PHRASES WITH 2+ WORDS! :(
	resultRelated = resultRelated.split(' ');
	var multiWord = '';
	for (var i = 0; i < resultRelated.length; i++) {
		if (resultRelated[i].startsWith('"')) {
			multiWord = (resultRelated[i].replace('"','')+" ");
		} else if (resultRelated[i].endsWith('"')) {
			multiWord = multiWord + (resultRelated[i].replace('"',''));
			// console.log(multiWord);
			relatedArray.push(multiWord);
		} else {
			relatedArray.push(resultRelated[i]);
			continue;
		}
	};

	// return the first tag in the array
	return relatedArray[0];
}

function showRelatedTracks(searchTag) {
	callAPIRelated(searchTag);
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


