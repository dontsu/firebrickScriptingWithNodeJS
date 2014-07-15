/**
 * This is the server start/stop file
 */
var spawn = require('child_process').spawn;
var config = require("./config.json");
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

function connect() {
	var mongoStatus = spawn('mongo', [ 'status' ], {
		cwd : config.mongodb_bin
	});
	mongoStatus.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	mongoStatus.stderr.on('data', function(data) {

		var mongoserver = spawn('mongod', [], {
			cwd : config.mongodb_bin
		});
		mongoserver.stdout.on('data', function(data) {
			console.log('server stdout: ' + data);
		});
		mongoserver.stderr.on('data', function(data) {
			console.log('server stderr: ' + data);
		});

		console.log('stderr: ' + data);
	});

}
function createIndex() {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		if (!err && db !== null) {
			var collection = db.collection('folderNodes');
			collection.createIndex([ "meta", [ '_id', 1 ], [ 'extention', 1 ],
					[ 'lastModified', 1 ] ], function(err, indexName) {

			});
		}

	});
}
exports.connect = connect;
exports.createIndex = createIndex;
