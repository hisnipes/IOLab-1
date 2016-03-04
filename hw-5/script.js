$(document).ready(function() {

	// when the "Add to List" button is clicked, run this:
	$('#submit-btn').click(function(){
		var stuffToDo = $('#stuffToDo').val(); // get the value of the text field

		// use 'prepend' rather than 'append' to put new item at the top of the list
		// create a list item with a bonus "Action" button! 
		$('#to-do ul').prepend('<li><button id="action-btn">Action</button><span class="stufftodo">'+stuffToDo+'</span></li>');

		// clear out the text field for the next item!
		$('#stuffToDo').val('');
		return false;
	});

	// when the "Action" button is clicked, run this...
	$(document).on('click', '#action-btn', function(){
		var stuffItem = $(this).parent("li"); // store the whole list item
		var listName = stuffItem.parent().parent().prop("id"); // store which list you're on

		$(this).remove(); // remove the button from the current list
		$(stuffItem).remove(); // and also remove the list item

		// depending on which list you're on, do stuff accordingly + run an effect:
		if (listName === "to-do") {
			$('#completed-items ul').prepend('<li><button id="action-btn">Action</button><span class="stufftodo">'+stuffItem.text()+'</span></li>').effect("bounce",{times:3},300);
		} else {
			$('#to-do ul').prepend('<li><button id="action-btn">Action</button><span class="stufftodo">'+stuffItem.text()+'</span></li>').effect("pulsate",300);	
		}
	});

});

// this makes the list items sortable
$(function() {
	$("#to-do #sortable").sortable();
	$("#completed-items #sortable").sortable();
	$("#to-do #sortable").disableSelection();
	$("#completed-items #sortable").disableSelection();
});