var fs = require('fs');

queryToJSON = function(jsonPath) {
	
	jsonPath = jsonPath;
	
	this.update = function(content) {
		
		content = String(content);
		
		//console.log(content.join(','))
		
		fs.writeFile(jsonPath, content, function(err) {
			
			if (err) throw err;
			
			console.log('success! wrote to ' + jsonPath)
		});
	};
}

module.exports = queryToJSON();