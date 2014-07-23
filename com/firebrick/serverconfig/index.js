/**
 * This is the startup/entry point for scripting module where the HTTP sever is
 * started
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var mongoserver = require("./dao/mongoserver");

var handle = {};
handle["/"] = requestHandlers.index;
handle["/loadFolder"] = requestHandlers.loadFolder;
handle["/executeScript"] = requestHandlers.executeScript;
handle["/index"] = requestHandlers.index;
handle["/clearDb"] = requestHandlers.clearDb;
handle["/loadMenuData"] = requestHandlers.loadMenuData;
handle["/shortcuts"] = requestHandlers.shortcuts;
handle["/getNode"] = requestHandlers.getNode;
handle["/loadScriptContent"] = requestHandlers.loadScriptContent; 
handle["/saveScriptContent"] = requestHandlers.saveScriptContent; 
handle["/saveNewScript"] = requestHandlers.saveNewScript; 
handle["/deleteScript"] = requestHandlers.deleteScript; 

server.start(router.route, handle);
mongoserver.connect();
mongoserver.createIndex();