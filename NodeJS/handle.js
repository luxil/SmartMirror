const handle = function (req, res) {
	res.writeHead(200, {
		'content-type': 'text/html'
	});
	
	res.write('Hallo Node.js!');
	res.end();
};

module.exports = handle;

// in der Konsole npm install express --save--save-exact eingeben für die aktuelle Version