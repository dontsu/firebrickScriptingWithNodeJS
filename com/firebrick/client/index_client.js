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
	editor.on('input', function() {
		disableScriptsButtons();
	});
	$("#run_btn").click(executeScript);
	$("#delete_btn").click(removeScript);
	$("#save_btn").click(saveScript);
	$("#location_submit").click(loadFolder);
	loadFolder();
	disableScriptsButtons();

});
function disableScriptsButtons() {
	if (ace.edit("editor").getValue().trim() !== "") {
		$("#run_btn").prop('disabled', false);
		$("#save_btn").prop('disabled', false);
	} else{
		$("#run_btn").prop('disabled', true);
		$("#save_btn").prop('disabled', true);		
	}
	if($("#script_name").val().trim() !== "" && $("#script_name").val().trim() !== "default.js"){
		$("#delete_btn").prop('disabled', false);
	}else{
		$("#delete_btn").prop('disabled', true);		
	}
}

function executeScript() {
	$.get("executeScript", {
		scriptBody : ace.edit("editor").getValue(),
		scriptName : $("#script_name").val()
	}).done(function(data) {
		$("#result").html(data);
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		$("#result").html(err);
	});
}

function saveScript() {
	$.get("saveScriptContent", {
		scriptName : $("#script_name").val(),
		scriptBody : ace.edit("editor").getValue()
	}).done(function(data) {
	}).fail(function(jqxhr, textStatus, error) {
	});
}

function removeScript() {
	$.get("deleteScript", {
		scriptName : $("#script_name").val()
	}).done(function(data) {
		$("#result").html("");
		$("#script_name").val("");
		var editor = ace.edit("editor");
		editor.setValue("");
		disableScriptsButtons();
		loadMenuData();
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
	});
}

function loadFolder() {
	var path = $("#location_path").val();
	if (path !== null && path.trim() !== '') {
		$("#result").block({
			message : "<img src='css/images/busy.gif' /></br>Processing"
		});
		$.getJSON("loadFolder", {
			locationPath : $("#location_path").val()
		}).done(function(data) {
			createTree(data);
			loadMenuData();
		}).fail(function(jqxhr, textStatus, error) {
			console.log("Request Failed: " + textStatus + ", " + error);
		});
	}
}

function createTree(data) {
	var resultDiv = $("#result");
	resultDiv.unblock();
	resultDiv.empty();
	resultDiv.html('<div id="tree_folder"></div>');
	$('#tree_folder').on(
			'changed.jstree',
			function(e, data) {
				if (data.selected.length > 0) {
					var node = data.instance.get_node(data.selected[0]);
					$.getJSON("getNode", {
						nodeId : node.id
					}).done(
							function(data) {
								if (data !== null && data.nodes !== null
										&& data.nodes.length > 0) {
									createTree(data.nodes);
								}
							}).fail(
							function(jqxhr, textStatus, error) {
								console.log("Request Failed: " + textStatus
										+ ", " + error);
							});
				}
			}).jstree({
		'core' : {
			'data' : data
		}
	});
}