/*
 * This is a utility used to parse a folder tree structure
 * and turn it into a json
 * 
 * @author Diana Raileanu
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename),
            lastModified: stats.mtime,
            accessedTime: stats.atime,
            createdTime: stats.ctime
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }
    return util.inspect(info, false, null);
}
/*
 * this is used for testing purposes
 */

var start = new Date();
console.log("test started -------");
console.log(dirTree("C:/Users/drailean/Downloads"));
console.log("Start:" + start);
var stop = new Date();
console.log("Stop: " + stop + " Difference: " + ( stop- start));


//exports.dirTree = dirTree;