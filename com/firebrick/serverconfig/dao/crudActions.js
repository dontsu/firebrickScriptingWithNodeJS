/**
 * This file will contain the db queries
 */

var mongoServer = require('./mongoserver');
var config = require("./config.json");

/*
 * Save the json to the db
 */
function save(array, callback) {
	mongoServer.getConnection(function(err, db) {
		if (!err && db !== null) {
			var collection = db.collection('folderNodes');
			var bulk = collection.initializeUnorderedBulkOp();
			for ( var i = 0; i < array.length; i++) {
				bulk.find({
					_id : array[i]._id
				}).upsert().updateOne(array[i]);
			}
			bulk.execute(function(err, result) {
				db.close();
				if (err !== null) {
					callback(err);
				} else {
					// Finish up test
					callback(null);
				}
			});
		} else {
			callback(err);
			db.close();
		}
	});
}

/*
 * Clear all the data from the database
 */
function clearDb() {
	mongoServer.getConnection(function(err, db) {
		if (db != null) {
			var collection = db.collection('folderNodes');
			if (collection != null) {
				collection.remove({}, function(err, r) {
					if (!err) {
						return new Error(err);
						console.log("Collection cleared successful");
					} else {
						console.log("Connection error:" + err);
					}
					db.close();
				});
			}
		}
	});
}

function getNodeById(nodeId, includeChildren, callback) {
	search({
		'_id' : nodeId
	}, {
		"state" : true,
		"text" : true,
		"_id" : true,
		"extention" : true,
		"parent" : true,
		"createdTime" : true,
		"lastModified" : true,
		"accessedTime" : true
	}, function(err, documents) {
		if (includeChildren && documents !== null && documents.length == 1) {
			getNodeChildren(documents[0]._id, function(err, children) {
				if (err != null) {
					callback(err, null);
				} else {
					documents[0].children = children;
					if (documents[0].parent !== null
							&& documents[0].parent.trim() !== "") {
						getNodeById(documents[0].parent, false, function(err,
								parent) {
							if (err != null) {
								callback(err, null);
							} else {
								if (parent !== null && parent.length == 1) {
									parent[0].children = documents;
									callback(null, parent);
								} else {
									callback(null, documents);
								}
							}
						});
					} else {
						callback(null, documents);
					}
				}
			});
		} else {
			callback(null, documents);
		}
		if (err != null) {
			callback(err, null);
		}
	});
}

function getNodeChildren(parent, callback) {
	search({
		'parent' : parent
	}, {
		"state" : true,
		"text" : true,
		"_id" : true,
		"extention" : true,
		"createdTime" : true,
		"lastModified" : true,
		"accessedTime" : true
	}, function(err, documents) {
		if (err != null) {
			callback(err, null);
		} else {
			callback(null, documents);
		}
	});
}

function search(condition, columns, callback, sortAndLimit) {
	mongoServer.getConnection(function(err, db) {
		if (err !== null || db === null) {
			callback(err);
		} else {
			var collection = db.collection('folderNodes');
			collection.find(condition, columns, sortAndLimit).toArray(
					function(err, documents) {
						if (err != null) {
							callback(err, null);
						} else {
							callback(null, documents);
						}
						db.close();
					});
		}
	});
}

function getNodes(callback) {
	search({
		parent : ""
	}, {
		"_id" : true
	}, function(err, documents) {
		if (err != null) {
			callback(err, null);
		} else {
			callback(null, documents);
		}
	});
}
exports.getNodes = getNodes;
exports.getNodeById = getNodeById;
exports.save = save;
exports.clearDb = clearDb;
exports.search = search;
exports.getNodeChildren = getNodeChildren;