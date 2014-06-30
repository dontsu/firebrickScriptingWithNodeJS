 
 $(document ).ready(function() {
  var editor = ace.edit("editor");
	editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/eclipse");
    // enable autocompletion and snippets
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
    
    $("#search_btn").click(executeSearch);
});

function executeSearch() {
	$.get( "executeScript", { scriptBody: ace.edit("editor").getValue()} )
	  .done(function( data ) {
		  $("#result").html(data);
	  })
	  .fail(function( jqxhr, textStatus, error ) {
	    var err = textStatus + ", " + error;
	    console.log( "Request Failed: " + err );
	});
}