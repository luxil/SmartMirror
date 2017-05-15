const http = require('http');
		path = require('path');

//const handle = require('./handle')
//const handle = require('./server/handle') mit Ordnerstruktur
//const handle = require('.test')
const express = require('express');

const clientDirectory= path.join(__dirname, 'client');

const app = express();

app.use('/', express.static(clientDirectory));

app.get('/', (req, res) => {
	res.send('Hallo Node.js!!');
	
});

const server = http.createServer(app);

server.listen(3000, () => {
	console.log('Server listen on port 3000.');
});