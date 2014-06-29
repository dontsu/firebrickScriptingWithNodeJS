/**
 * This is a router that either handles the requested path, 
 * or in case of resource files (ex. js, css)
 * it will read those files and return back their content in case they exist
 * 
 * @author Diana Raileanu
 */

var path = require('path');
var fs = require('fs');

function route(handle, pathname, response, postData, urlParams) {
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		return handle[pathname](response, postData, urlParams);
	} else {
		var extname = path.extname(pathname);
		var contentType = "";
		switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		}

		path.exists('.' + pathname, function(exists) {

			if (exists) {
				fs.readFile('.' + pathname, function(error, content) {
					if (error) {
						response.writeHead(500);
						response.end();
					} else {
						response.writeHead(200, {
							'Content-Type' : contentType
						});
						response.end(content, 'utf-8');
					}
				});
			} else {
				response.writeHead(404);
				response.end();
			}
		});
	}
}

exports.route = route;