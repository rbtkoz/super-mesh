'use strict';

var chalk = require('chalk'),
    app = require('./routes/configure/');

var server = require('http').createServer();

server.on('request', app); // Attach the Express Application

var port = 7777;
server.listen(process.env.PORT || port, function() {
    console.log(chalk.blue('Server started on port', chalk.magenta(port)));
});



