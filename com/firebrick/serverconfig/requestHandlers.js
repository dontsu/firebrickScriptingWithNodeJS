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
var scriptRunner = require('./scriptRunner');
var mongoserver = require("./dao/mongoserver");
var mountedDevices = require("./mountedDevices");

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

function guide(response) {
	fs.readFile('./../client/html/user_guide.html', function(err, html) {
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
	try {
		var nodePath = path.normalize(urlParams.locationPath);
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
					sendErrorForResponse(response, err);
				} else {
					crudActions.getNodeById(nodePath, true, function(err,
							result) {
						if (err !== null) {
							sendErrorForResponse(response, err);
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
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

function executeScript(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null
			&& urlParams.scriptBody !== null) {
		try {
			var script = './userscripts/' + urlParams.scriptName;
			fs.writeFileSync(script, urlParams.scriptBody);
			delete require.cache[require.resolve(script)];
			scriptRunner.run(urlParams, response);
		} catch (err) {
			sendErrorForResponse(response, err);
		}
	}
}

function clearDb(response) {
	try {
		crudActions.clearDb();
		sendSuccessForResponse(response);
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

function loadMenuData(response) {
	try {
		crudActions.getNodes(function(err, result) {
			if (err != null) {
				sendErrorForResponse(response, err);
			} else {
				response.writeHead(200, {
					"Content-Type" : "application/text"
				});
				var scripts = [];
				fs.readdirSync("./userscripts").map(function(child) {
					scripts.push(child);
				});
				mountedDevices.getList(function(error, devices) {
					if (error != null) {
						sendErrorForResponse(response, err);
					} else {
						response.write(JSON.stringify({
							'nodes' : result,
							'scripts' : scripts,
							'devices' : devices
						}));
						response.end();
					}
				});
			}
		});
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

function getNode(response, postData, urlParams) {
	if (urlParams !== null && urlParams.nodeId !== null) {
		try {
			crudActions.getNodeById(urlParams.nodeId, true, function(err,
					result) {
				if (err !== null) {
					sendErrorForResponse(response, err);
				} else {
					response.writeHead(200, {
						"Content-Type" : "application/text"
					});
					response.write(JSON.stringify({
						'nodes' : result
					}));
					response.end();
				}
			});
		} catch (err) {
			sendErrorForResponse(response, err);
		}
	}
	;
}

function loadScriptContent(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null) {
		try {
			fs.readFile('./userscripts/' + urlParams.scriptName, 'utf8',
					function(err, data) {
						if (err !== null) {
							sendErrorForResponse(response, err);
						} else {
							response.writeHead(200, {
								"Content-Type" : "application/text"
							});
							response.write(data);
							response.end();
						}
					});
		} catch (err) {
			sendErrorForResponse(response, err);
		}
	}
	;
}
function saveNewScript(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null) {
		try {
			var tempFile = fs.openSync('./userscripts/' + urlParams.scriptName,
					'a');
			fs.closeSync(tempFile);
			sendSuccessForResponse(response);
		} catch (err) {
			sendErrorForResponse(response, err);
		}
	}
}

function saveScriptContent(response, postData, urlParams) {
	if (urlParams !== null && urlParams.scriptName !== null
			&& urlParams.scriptBody !== null) {
		try {
			fs.writeFileSync('./userscripts/' + urlParams.scriptName,
					urlParams.scriptBody);
			sendSuccessForResponse(response);
		} catch (err) {
			sendErrorForResponse(response, err);
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
			sendSuccessForResponse(response);
		} catch (err) {
			sendErrorForResponse(response, err);
		}
	}
}

function sendErrorForResponse(response, ex) {
	response.writeHead(200, {
		"Content-Type" : "application/json"
	});
	response.write(JSON.stringify({
		error : ex.toString()
	}));
	response.end();
}
function sendSuccessForResponse(response, info) {
	if (info == null) {
		response.writeHead(200, {
			"Content-Type" : "application/text"
		});
		response.write("SUCCESS");
	} else {
		response.writeHead(200, {
			"Content-Type" : "application/json"
		});
		response.write(JSON.stringify({
			info : info.toString()
		}));
	}
	response.end();
}

function startMongoServer(response) {
	try {
		mongoserver.start(function(err, info) {
			if (err != null) {
				sendErrorForResponse(response, err);
			} else {
				sendSuccessForResponse(response, info);
				mongoserver.createIndex();
			}
		});
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

function stopMongoServer(response) {
	try {
		mongoserver.stop(function(err, info) {
			if (err != null) {
				sendErrorForResponse(response, error);
			} else {
				sendSuccessForResponse(response, info);
			}
		});
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

function repairMongoServer(response) {
	try {
		mongoserver.repair(function(error, info) {
			if (error != null) {
				sendErrorForResponse(response, error);
			} else {
				if (info == null) {
					startMongoServer(response);
				} else {
					sendSuccessForResponse(response, info);
				}
			}
		});
	} catch (err) {
		sendErrorForResponse(response, err);
	}
}

exports.repairMongoServer = repairMongoServer;
exports.startMongoServer = startMongoServer;
exports.stopMongoServer = stopMongoServer;
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
exports.guide = guide;
