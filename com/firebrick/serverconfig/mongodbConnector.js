/**
 * New node file
 */

var MongoClient = require('mongodb').MongoClient;
var config = require("./config.json");

// Connect to the db
function connect() {
	MongoClient.connect("mongodb://" + config.host + ":" + config.db_port + "/investigationDb", function(err, db) {
		if (!err) {
			console.log("We are connected");
			return db;
		} else {
			console.log("Connection error:" + err);
		}
	});
}

var db = connect();