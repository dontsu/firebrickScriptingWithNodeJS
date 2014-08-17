/**
 * New node file
 */
var os = require('os');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;

function getList(callback) {
	var osName = os.platform();
	if (osName.indexOf('win') > -1) {
		getListForWin(callback);
	} else if (osName.indexOf('linux') > -1) {
		getListForLinux(callback);
	} else {
		callback(null, "Not supported");
	}
}

function getListForWin(callback) {

	exec("wmic logicaldisk get name, drivetype, size", function(error, stdout,
			stderr) {
		if (error !== null) {
			callback(error);
		} else {
			var rawResult = stdout.split("\n");
			var mapedResult = [];
			var j = 0;
			for ( var i = 1; i < rawResult.length; i++) {
				if (rawResult[i].trim() != "") {
					rawResult[i] = rawResult[i].replace("       ", "  ");
					var splitResult = rawResult[i].trim().split("  ");
					if (splitResult[0].trim() == '5' && splitResult[4] != null
							&& splitResult[4].trim() != '') {
						mapedResult[j] = splitResult[2].trim();
						j++;
					}
				}
			}
			callback(error, mapedResult);
		}

	});
}

function getListForLinux(callback) {

	exec("df -h", function(error, stdout, stderr) {
		if (error !== null) {
			callback(error);
		} else {
			var rawResult = stdout.split("\n");
			var mapedResult = [];
			var j = 0;
			for ( var i = 1; i < rawResult.length; i++) {
				if (rawResult[i].trim() != "") {
					var splitResult = rawResult[i].trim().split(" ");
					if (splitResult[0].trim().indexOf('/dev') > -1
							&& splitResult[1] != null
							&& splitResult[1].trim() != '0') {
						mapedResult[j] = splitResult[0].trim();
						j++;
					}
				}
			}
			callback(error, mapedResult);
		}

	});
}
exports.getList = getList;