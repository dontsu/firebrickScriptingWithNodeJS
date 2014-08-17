/**
 * New node file
 */

var timeout = 500;
var closetimer = 0;
var ddmenuitem = 0;

$(document).ready(function() {
	$('#jsddm > li').bind('mouseover', jsddmOpen);
	$('#jsddm > li').bind('mouseout', jsddmTimer);
	$("#clearDb").click(clearDb);
	$("#startMongoDb").click(startServerDb);
	$("#stopMongoDb").click(stopServerDb);
	$("#repairMongoDb").click(repairServerDb);

	document.oncclick = jsddmClose;
	loadMenuData();
});

function loadMenuData() {
	$.getJSON("loadMenuData").done(function(data) {
		createNodes(data);
		createScriptList(data);
		createDeviceList(data);
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		displayError("Script could not be executed: " + err);
	});
}

function createNodes(data) {
	if (data.nodes !== null) {
		var menu = $('#existingNodes');
		menu.empty();
		$.each(data.nodes, function(key, value) {
			var html = "<li><a id='" + value._id
					+ "' href='#' onclick='loadNode(this)'>" + value._id
					+ "</a></li>";
			menu.append(html);
		});
	}
}

function createScriptList(data) {
	if (data.scripts !== null) {
		var scripts = $('#existingScripts');
		scripts.empty();
		$.each(data.scripts, function(key, value) {
			var html = "<li><a id='" + value
					+ "' href='#' onclick='loadScript(this)'>" + value
					+ "</a></li>";
			scripts.append(html);
		});
		var html = "<li><a id='new_script' href='#' onclick='createNewScript()'>"
				+ " New script </a></li>";
		scripts.append(html);
	}
}

function createDeviceList(data) {
	if (data.devices !== null) {
		var devices = $('#mountedDevices');
		devices.empty();
		$.each(data.devices, function(key, value) {
			var html = "<li><a id='" + value
			+ "' href='#' onclick='loadNode(this)'>" + value
			+ "</a></li>";
			devices.append(html);
		});
	}
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
	getNode(element.id);
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
	var dialogBox = $("#remove_dialog");
	dialogBox.html("Do you really want to clear the database? ");
	dialogBox.dialog({
		resizable : false,
		height : 140,
		modal : true,
		buttons : {
			"Yes" : function() {
				sendRequestToClearTheDb();
				$(this).dialog("close");
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		}
	});
}

function startServerDb() {
	$.get("startMongoServer").done(function(data) {
		if (data.error != null && data.error !== "") {
			displayError(data.error);
		} else {
			displaySuccessMessage(data.info);
		}
	}).fail(function(jqxhr, textStatus, error) {
		displayError("Server could not be started: " + error);
	});
}

function stopServerDb() {
	$.get("stopMongoServer").done(function(data) {
		if (data.error != null && data.error !== "") {
			displayError(data.error);
		} else {
			displaySuccessMessage(data.info);
		}
	}).fail(function(jqxhr, textStatus, error) {
		displayError("Server could not be stopped: " + error);
	});
}

function repairServerDb() {
	$.get("repairMongoServer").done(function(data) {
		if (data.error != null && data.error !== "") {
			displayError(data.error);
		} else {
			displaySuccessMessage(data.info);
		}
	}).fail(function(jqxhr, textStatus, error) {
		displayError("Server could not be repaired: " + error);
	});
}

function sendRequestToClearTheDb() {
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

function jsddmOpen() {
	jsddmCanceltimer();
	jsddmClose();
	ddmenuitem = $(this).find('ul').css('visibility', 'visible');
}

function jsddmClose() {
	if (ddmenuitem)
		ddmenuitem.css('visibility', 'hidden');
}

function jsddmTimer() {
	closetimer = window.setTimeout(jsddmClose, timeout);
}

function jsddmCanceltimer() {
	if (closetimer) {
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}
