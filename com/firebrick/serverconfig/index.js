/**
 * This is the startup/entry point for scripting module where the HTTP sever is
 * started
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.index;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/executeScript"] = requestHandlers.executeScript;
handle["/index"] = requestHandlers.index;

server.start(router.route, handle);