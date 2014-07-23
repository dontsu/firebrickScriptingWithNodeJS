/**
 * This file contains the proper request handling logic
 * 
 * @author Diana Raileanu
 */
var fs = require('fs');
var exec = require("child_process").exec;
var directoryToJson = require("./directoryToJson");
var crudActions = require("./dao/crudActions");
var path = require('path');

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
	var nodePath = urlParams.locationPath;
	if (nodePath !== null && nodePath.trim() !== '') {
		var arrayResult = [];
		arrayResult.push({
			_id : nodePath,
			parent : "",
			name : path.basename(nodePath),
			text : path.basename(nodePath),
			state : {
				'opened' : true
			}
		});
		directoryToJson.dirTree(nodePath, "", arrayResult);

		crudActions.save(arrayResult, function(err) {
			if (err !== null) {
				response.writeHead(500, {
					"Content-Type" : "application/text"
				});

				response.end();
			} else {
				crudActions.getNodeById(nodePath, true, function(err, result) {
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
	if (urlParams !== null && urlParams.scriptName !== null
			&& urlParams.scriptBody !== null) {
		fs.writeFile('./userscripts/' + urlParams.scriptName, urlParams.scriptBody, function(err) {
			if (err) {
				console.log(err);
			} else {
				exec("node userscripts/" + urlParams.scriptName, {
					timeout : 10000,
					maxBuffer : 20000 * 1024
				}, function(error, stdout, stderr) {
					response.writeHead(200, {
						"Content-Type" : "text/plain"
					});
					if ((error === null && stderr === null) || stderr === "") {
						response.write(stdout);
					} else {
						response.write(error + stderr);
					}
					response.end();
				});
			}
		});
	}
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
			var scripts = [];
			fs.readdirSync("./userscripts").map(function(child) {
				scripts.push(child);
			});
			response.write(JSON.stringify({
				'nodes' : result,
				'scripts' : scripts
			}));
		}
		response.end();
	});

}

function getNode(response, postData, urlParams) {
	if (urlParams !== null && urlParams.nodeId !== null) {
		crudActions.getNodeById(urlParams.nodeId, true, function(err, result) {
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
	;
}

function loadScriptContent(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null) {
		fs.readFile('./userscripts/' + urlParams.scriptName, 'utf8', function(
				err, data) {
			if (err !== null) {
				response.writeHead(500, {
					"Content-Type" : "application/text"
				});
			} else {
				response.writeHead(200, {
					"Content-Type" : "application/text"
				});
				response.write(data);
			}
			response.end();
		});
	}
	;
}
function saveNewScript(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null) {
		try {
			var tempFile = fs.openSync('./userscripts/' + urlParams.scriptName,
					'a');
			fs.closeSync(tempFile);
			response.writeHead(200, {
				"Content-Type" : "application/text"
			});
			response.write("SUCCESS");
			response.end();
		} catch (err) {
			response.writeHead(500, {
				"Content-Type" : "application/text"
			});
			response.end();
		}
	}
}

function saveScriptContent(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null
			&& urlParams.scriptBody !== null) {
		try {
			fs.writeFileSync('./userscripts/' + urlParams.scriptName,
					urlParams.scriptBody);
			response.writeHead(200, {
				"Content-Type" : "application/text"
			});
			response.write("SUCCESS");
			response.end();
		} catch (err) {
			response.writeHead(500, {
				"Content-Type" : "application/text"
			});
			response.end();
		}
	}
	;
}
function deleteScript(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null) {
		try {
			var tempFile = fs.openSync('./userscripts/' + urlParams.scriptName,
					'r');
			fs.closeSync(tempFile);
			fs.unlinkSync('./userscripts/' + urlParams.scriptName);
			response.writeHead(200, {
				"Content-Type" : "application/text"
			});
			response.write("SUCCESS");
			response.end();
		} catch (err) {
			response.writeHead(500, {
				"Content-Type" : "application/text"
			});
			response.end();
		}
	}
}
exports.clearDb = clearDb;
exports.loadFolder = loadFolder;
exports.executeScript = executeScript;
exports.index = index;
exports.loadMenuData = loadMenuData;
exports.shortcuts = shortcuts;
exports.getNode = getNode;
exports.loadScriptContent = loadScriptContent;
exports.saveScriptContent = saveScriptContent;
exports.deleteScript = deleteScript;
exports.saveNewScript = saveNewScript;
