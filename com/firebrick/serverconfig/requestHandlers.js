/**
 * This file contains the proper request handling logic
 * 
 * @author Diana Raileanu
 */
var fs = require('fs');
var exec = require("child_process").exec;
var directoryToJson = require("./directoryToJson");
var crudActions = require("./dao/crudActions");

function index(response) {
	fs.readFile('./../client/html/index.html', function(err, html) {
		if (err) {
			response.writeHeader(404, {
				"Content-Type" : "text/html"
			});
			response.write(err);
		} else {
			response.writeHeader(200, {
				"Content-Type" : "text/html"
			});
			response.write(html);
		}
		response.end();
	});
}

function shortcuts(response) {
	fs.readFile('./../client/html/shortcuts.html', function(err, html) {
		if (err) {
			response.writeHeader(404, {
				"Content-Type" : "text/html"
			});
			response.write(err);
		} else {
			response.writeHeader(200, {
				"Content-Type" : "text/html"
			});
			response.write(html);
		}
		response.end();
	});
}

function loadFolder(response, postData, urlParams) {
	// hard-code at the moment until I find a way to ge if from the user
	var path = urlParams.location_path;
	if (path !== null && path.trim() !== '') {
		var jsonResult = directoryToJson.dirTree(path);

		crudActions.saveNode(jsonResult, function(err, result) {
			if (err !== null) {
				response.writeHead(500, {
					"Content-Type" : "application/text"
				});

				response.end();
			} else {
				crudActions.getNodeById(path, function(err, result) {
					if (err !== null) {
						response.writeHead(500, {
							"Content-Type" : "application/text"
						});

						response.end();
					} else {
						response.writeHead(200, {
							"Content-Type" : "application/json"
						});
						response.write(JSON.stringify(result));
						response.end();
					}
				});
			}

		});
	}
}

function executeScript(response, postData, urlParams) {
	var scriptName = "userscripts/default.js";

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
					console.log("Request handler 'executeScript' failed:"
							+ stderr);
				}
			});
		}
	});

}

function clearDb(response) {
	var result = crudActions.clearDb();
	if (result instanceof Error) {
		response.writeHead(500, {
			"Content-Type" : "application/text"
		});
		response.write(result);
	} else {
		response.writeHead(200, {
			"Content-Type" : "application/text"
		});
		response.write("Ok");
	}
	response.end();
}

function loadMenuData(response) {
	crudActions.getNodes(function(err, result) {
		if (err !== null) {
			response.writeHead(500, {
				"Content-Type" : "application/text"
			});
		} else {
			response.writeHead(200, {
				"Content-Type" : "application/text"
			});
			response.write(JSON.stringify({
				'nodes' : result
			}));
		}
		response.end();
	});

}

exports.clearDb = clearDb;
exports.loadFolder = loadFolder;
exports.executeScript = executeScript;
exports.index = index;
exports.loadMenuData = loadMenuData;
exports.shortcuts = shortcuts;