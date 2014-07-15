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
	$.getJSON("loadMenuData").done(
			function(data) {
				if (data.nodes !== null) {
					var menu = $('#existingNodes');
					menu.empty();
					$.each(data.nodes, function(key, value) {
						var html = "<li><a id='" + value._id
								+ "' href='#' onclick='loadNode(this)'>" + value._id + "</a></li>";
						menu.append(html);
					});
				}
			}).fail(function(jqxhr, textStatus, error) {

	});
}
function loadNode(element) {
	$("#location_path").val(element.id);
	loadFolder();
}
function clearDb() {
	$.get("clearDb").done(function(data) {
		location.reload();
	}).fail(function(jqxhr, textStatus, error) {
		alert("Clear failed: " + error);
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
