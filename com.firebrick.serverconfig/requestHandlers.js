/**
 * New node file
 */
var fs = require('fs');
var exec = require("child_process").exec;

function start(response) {
	console.log("Request handler 'start' was called.");
	fs.readFile('./html/start.html', function(err, html) {
		if (err) {
			throw err;
		}
		response.writeHeader(200, {
			"Content-Type" : "text/html"
		});
		response.write(html);
		response.end();
	});
}

function upload(response, postData, urlParams) {
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {
		"Content-Type" : "text/plain"
	});
	response.write("Hello Upload");
	response.end();
}

function executeScript(response, postData, urlParams) {
	console.log("Request handler 'executeScript' was called.");
	var scriptName = "userScript.js";

	fs.writeFile('./' + scriptName, urlParams.scriptBody, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
			exec("node " + scriptName, {
				timeout : 10000,
				maxBuffer : 20000 * 1024
			}, function(error, stdout, stderr) {
				if ((error === null && stderr === null) || stderr === "") {
					response.writeHead(200, {
						"Content-Type" : "text/plain"
					});
					response.write(stdout);
					response.end();
				} else {
					response.writeHead(200, {
						"Content-Type" : "text/plain"
					});
					response.write(error + stderr);
					response.end();
					console.log("Request handler 'executeScript' failed:" + stderr);
				}
			});
		}
	});

}

exports.start = start;
exports.upload = upload;
exports.executeScript = executeScript;