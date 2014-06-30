/**
 * New node file
 */
var fs = require('fs');
function load(pageName) {
	fs.readFile(pageName, function(err, html) {
		if (err) {
			throw err;
		}
		return html;
	});
}

exports.load = load;