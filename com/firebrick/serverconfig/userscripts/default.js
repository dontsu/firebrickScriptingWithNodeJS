var dbActions = require("./../dao/crudActions");

function execute(urlParams, callback){
    dbActions.search({extention:{ $in: ["doc", "docx"] }},{}, 
    function(err, documents) {
            callback(err,documents);
    }, { sort: { createdTime: -1 , lastModified: -1 }, limit: 40 });

}

exports.execute = execute;