/**
 * This file will contain the db queries
 */

var MongoClient = require('mongodb').MongoClient;
var config = require("./config.json");

/*
 * Save the json to the db
 */
function saveNode(json, callback) {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		if (!err && db !== null) {
			getNodeById(json._id, function(err, result) {
				if (typeof result[0] == 'undefined') {
					var collection = db.collection('folderNodes');
					collection.insert(json, function(err, docs) {
						if (err !== null) {
							callback(err);
						} else {
							callback(null);
						}
					});

				} else {
					callback(null);
				}
			});

		} else {
			callback(err, null);
		}
	});
}

/*
 * Clear all the data from the database
 */
function clearDb() {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		var collection = db.collection('folderNodes');
		collection.remove({}, function(err, r) {
			if (!err) {
				return new Error(err);
				console.log("Collection cleared successful");
			} else {
				console.log("Connection error:" + err);
			}
		});
	});
}

function getNodeById(nodeId, callback) {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		if (err !== null || db === null) {
			callback(err);
		} else {
			var collection = db.collection('folderNodes');
			collection.find({
				'_id' : nodeId
			}, {
				"state" : true,
				"text" : true,
				"extention" : true,
				"children" : true,
				"children._id" : true,
				"children.text" : true,
				"children.extention" : true,
			}).toArray(function(err, documents) {
				callback(null, documents);
			});
		}
	});
}
function getNodes(callback) {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port
			+ "/investigationDb", function(err, db) {
		if (err !== null || db === null) {
			callback(err);
		} else {
			var collection = db.collection('folderNodes');
			collection.find({}, {
				"_id" : true
			}).toArray(function(err, documents) {
				callback(null, documents);
			});
		}
	});
}
exports.getNodes = getNodes;
exports.getNodeById = getNodeById;
exports.saveNode = saveNode;
exports.clearDb = clearDb;