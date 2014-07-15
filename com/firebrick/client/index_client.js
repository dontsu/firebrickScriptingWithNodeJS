$(document).ready(function() {
	var editor = ace.edit("editor");
	editor.session.setMode("ace/mode/javascript");
	editor.setTheme("ace/theme/eclipse");
	// enable autocompletion and snippets
	editor.setOptions({
		enableBasicAutocompletion : true,
		enableSnippets : true,
		enableLiveAutocompletion : false
	});

	$("#search_btn").click(executeSearch);
	$("#location_submit").click(loadFolder);
	loadFolder();

});

function executeSearch() {
	$.get("executeScript", {
		scriptBody : ace.edit("editor").getValue()
	}).done(function(data) {
		$("#result").html(data);
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
	});
}

function loadFolder() {
	var path = $("#location_path").val();
	if ( path !== null && path.trim() !== '') {
		$("#result").block({
			message : "<img src='css/images/busy.gif' /></br>Processing"
		});
		$.getJSON("loadFolder", {
			location_path : $("#location_path").val()
		}).done(function(data) {
			var resultDiv = $("#result");
			resultDiv.unblock();
			resultDiv.empty();
			resultDiv.html('<div id="tree_folder"></div>');
			$('#tree_folder').jstree({
				'core' : {
					'data' : data
				}
			});
			loadMenuData();
		}).fail(function(jqxhr, textStatus, error) {
			console.log("Request Failed: " + textStatus + ", " + error);
		});
	}
}