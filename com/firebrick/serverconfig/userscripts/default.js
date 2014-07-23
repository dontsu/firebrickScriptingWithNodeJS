var crudActions = require("./../dao/crudActions");

crudActions.search({
		'_id' : 'C:/Diana stuff/canon'
	}, {
		"state" : true,
		"text" : true,
		"_id" : true,
		"extention" : true,
		"parent" : true
	}, function(err, documents) {
	//	if (documents !== null) {
		  return err + documents;  
	//	}
	}
);