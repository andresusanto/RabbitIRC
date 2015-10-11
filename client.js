var util = require('util');
var amqp = require('amqplib/callback_api');
var tools = require('./client-tools.js');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (_text) {
	var command = _text.trim();
	if (tools.nick == ''){
		if (command.substring(0, 5) == '/nick'){
			tools.reg(command.substring(5, command.length).trim());
			console.log('Changing nick, please wait ...');
		}else{
			console.log('You must choose your nick first!');
		}
	}else{
		
	}
	
});


