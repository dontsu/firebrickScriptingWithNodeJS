var http = require("http");
var url = require("url");
var children  = [];

function start(route, handle) {

	
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var urlParams = url.parse(request.url, true).query;
		var postData = "";
		request.setEncoding("utf8");

		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
		});

		request.addListener("end", function() {
			route(handle, pathname, response, postData, urlParams);
		});
	}
	
	http.createServer(onRequest).listen(8082);
	console.log("Server has started.");

	process.on('exit', function() {
	  console.log('killing', children.length, 'child processes');
	  children.forEach(function(child) {
	    child.kill();
	  });
	});
}

exports.start = start;