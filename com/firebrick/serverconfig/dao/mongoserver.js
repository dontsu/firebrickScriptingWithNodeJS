/**
 * This is the server start/stop file
 */
var spawn = require('child_process').spawn;
var config = require("./config.json");
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var child = require('child_process');
var connection;

function start(callback) {
	getConnection(function(err, db) {
		if (db == null) {
			spawn('mongod', [], {
				cwd : config.mongodb_bin
			});
			callback(null, "Server started.");
		} else {
			callback(null, "Server is running.");
		}
	});
}
function createIndex() {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		if (!err && db !== null) {
			var collection = db.collection('folderNodes');
			collection.createIndex([ "meta", [ '_id', 1 ], [ 'parent', 1 ],
					[ 'children', 1 ], [ 'extention', 1 ],
					[ 'lastModified', 1 ] ], function(err, indexName) {

			});
		}

	});
}
function repair(callback) {
	getConnection(function(err, db) {
		if (db == null) {
			child.exec("mongod -repair", {
				cwd : config.mongodb_bin
			}, function(error, stdout, stderr) {
				if (error !== null) {
					callback(error);
				} else {
					callback(null, null);
				}

			});
		} else {
			callback(null, "Mongo is running. No need to repair.");
		}
	});
}

function getConnection(callback) {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		connection = db;
		callback(err, db);
	});
}

function stop(callback) {
	getConnection(function(err, db) {
		if (db != null) {
			db.admin().serverStatus(function(err, info) {
				if (info != null) {
					shutdownInConsole(callback);
				} else {
					callback(err, info);
				}
			});
		}
	});
}

function shutdownInConsole(callback) {
	child.exec('mongo --eval "db.getSiblingDB(\'admin\').shutdownServer()"', {
		cwd : config.mongodb_bin
	}, function(error, stdout, stderr) {
		if (error !== null) {
			callback(error);
		} else {
			callback(error, "Server stopped.");
		}

	});
}

exports.getConnection = getConnection;
exports.start = start;
exports.repair = repair;
exports.createIndex = createIndex;
exports.stop = stop;
