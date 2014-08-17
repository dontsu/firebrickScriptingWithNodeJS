function run(urlParams, response) {
	try {
		var handler = require("./userscripts/" + urlParams.scriptName);
		response.writeHead(200, {
			"Content-Type" : "text/plain"
		});
		handler.execute(urlParams, function(error, result) {
			if (error === null) {
				response.write(JSON.stringify({
					'nodes' : result
				}));

			} else {
				response.write(JSON.stringify({
					error : error.toString()
				}));
			}
			response.end();
		});
	} catch (err) {
		response.writeHead(200, {
			"Content-Type" : "application/json"
		});
		response.write(JSON.stringify({
			error : err.toString()
		}));
		response.end();

	}
}

exports.run = run;