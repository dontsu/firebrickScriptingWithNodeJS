var dbActions = require("./../dao/crudActions");

function execute(urlParams, callback){
    dbActions.getNodeById(urlParams.nodeId, true, function(err, documents) {
        if (err !== null) {
            callback(err);  
        } else{
            callback(err,documents);
        }
    });

}

exports.execute = execute;