/**
 * New node file
 */

var timeout = 500;
var closetimer = 0;
var ddmenuitem = 0;

$(document).ready(function() {
	$('#jsddm > li').bind('mouseover', jsddm_open);
	$('#jsddm > li').bind('mouseout', jsddm_timer);
	$("#clearDb").click(clearDb);

	document.onclick = jsddm_close;
	loadMenuData();
});
function loadMenuData() {
	$
			.getJSON("loadMenuData")
			.done(
					function(data) {
						if (data.nodes !== null) {
							var menu = $('#existingNodes');
							menu.empty();
							$
									.each(
											data.nodes,
											function(key, value) {
												var html = "<li><a id='"
														+ value._id
														+ "' href='#' onclick='loadNode(this)'>"
														+ value._id
														+ "</a></li>";
												menu.append(html);
											});
						}
						if (data.scripts !== null) {
							var scripts = $('#existingScripts');
							scripts.empty();
							$
									.each(
											data.scripts,
											function(key, value) {
												var html = "<li><a id='"
														+ value
														+ "' href='#' onclick='loadScript(this)'>"
														+ value + "</a></li>";
												scripts.append(html);
											});
							var html = "<li><a id='new_script' href='#' onclick='createNewScript()'>"
									+ " New script </a></li>";
							scripts.append(html);

						}

					}).fail(function(jqxhr, textStatus, error) {

			});
}

function loadScript(element) {
	var editor = ace.edit("editor");
	$.get("loadScriptContent", {
		scriptName : element.id
	}).done(function(data) {
		if (data.error != null && data.error !== "") {
			displayError(data.error);
		} else {
			editor.setValue(data);
			$("#script_name").val(element.id);
		}
		disableScriptsButtons();
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		displayError("Script could not be executed: " + err);
	});
}

function loadNode(element) {
	$("#location_path").val(element.id);
	loadFolder();
}

function createNewScript() {
	$("#create_dialog").dialog({
		resizable : false,
		height : 140,
		modal : true,
		buttons : {
			"Ok" : function() {
				$.get("saveNewScript", {
					scriptName : $("#new_script_name").val()
				}).done(function(data) {
					if (data.error != null && data.error !== "") {
						displayError("Script could not be saved: " + error);
					} else {
						loadMenuData();
						displaySuccessMessage("New script saved succesfuly.");
					}
				});
				var editor = ace.edit("editor");
				editor.setValue("");
				$("#script_name").val($("#new_script_name").val());
				$("#new_script_name").val("");
				$(this).dialog("close");
				disableScriptsButtons();
			},
			Cancel : function() {
				$("#new_script_name").val("");
				$(this).dialog("close");
			}
		}
	});
}

function clearDb() {
	$.get("clearDb").done(function(data) {
		if (data.error != null && data.error !== "") {
			displayError(data.error);
		} else {
			location.reload();
			displaySuccessMessage("Database cleared successfully.");
		}
	}).fail(function(jqxhr, textStatus, error) {
		displayError("Clear db Failed: " + err);
	});
}

function jsddm_open() {
	jsddm_canceltimer();
	jsddm_close();
	ddmenuitem = $(this).find('ul').css('visibility', 'visible');
}

function jsddm_close() {
	if (ddmenuitem)
		ddmenuitem.css('visibility', 'hidden');
}

function jsddm_timer() {
	closetimer = window.setTimeout(jsddm_close, timeout);
}

function jsddm_canceltimer() {
	if (closetimer) {
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}
