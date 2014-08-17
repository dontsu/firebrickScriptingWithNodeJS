/*
 * This is a utility used to parse a folder tree structure
 * and turn it into a json
 * 
 * @author Diana Raileanu
 */
var fs = require('fs');
var path = require('path');
var util = require('util');

function dirTree(filename, parent, array) {
	var stats = fs.lstatSync(filename), info = {
		_id : filename,
		name : path.basename(filename),
		lastModified : stats.mtime,
		accessedTime : stats.atime,
		createdTime : stats.ctime,
		extention : stats.isDirectory() ? "" : path.extname(filename).replace(".", "").toLowerCase(),
		// these attributes are used for JStree to display this json
		text : path.basename(filename),
		state : {
			'opened' : true
		},
		parent : parent
	};

	if (stats.isDirectory()) {
		fs.readdirSync(filename).map(function(child) {
			array.push(dirTree(filename + '/' + child, filename, array));
		});
	}
	return info;
}
/*
 * this is used for testing purposes
 */
/*
 * var start = new Date(); console.log("test started -------");
 * console.log(util.inspect(dirTree("C:/Diana stuff/books"), false, null));
 * console.log("Start:" + start); var stop = new Date(); console.log("Stop: " +
 * stop + " Difference: " + ( stop- start));
 */

exports.dirTree = dirTree;