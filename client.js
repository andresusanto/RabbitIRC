var util = require('util');
var amqp = require('amqplib/callback_api');
var tools = require('./client-tools.js');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (_text) {
	var command = _text.trim();
	
	if (command.substring(0, 5) == '/exit')
		process.exit(0);
	
	
	if (tools.nick == ''){
		if (command.substring(0, 5) == '/nick'){
			var param = command.substring(5, command.length).trim();
			
			tools.reg(param);
			console.log('Changing nick, please wait ...');
		}else{
			console.log('You must choose your nick first!');
		}
	}else{
		var req = {};
		
		if (command.substring(0, 5) == '/join'){
			console.log('Sending join request, please wait ...');
			var param = command.substring(5, command.length).trim();
			
			req.request = 'join';
			req.command = param;
			
			tools.queryServer(req, function(result){
				if (result == "1"){
					console.log("You are now member of #" + param);
				}else{
					console.log("You already a member of #" + param);
				}
			});
			
		}else if (command.substring(0, 6) == '/leave'){
			console.log('Sending leave request, please wait ...');
			var param = command.substring(6, command.length).trim();
			
			req.request = 'leave';
			req.command = param;
			
			tools.queryServer(req, function(result){
				if (result == "1"){
					console.log("Leaving #" + param);
				}else{
					console.log("You are not a member of #" + param);
				}
			});
			
		}else if (command.substring(0, 1) == '@'){
			var msg_format = /@(\w+) ([\w\W]+)/;
			var msg_intent = msg_format.exec(command);
			
			console.log('Sending message to #' + msg_intent[1] + ', please wait ...');
			
			req.request = 'sendto';
			req.to = msg_intent[1];
			req.message = msg_intent[2];
			
			tools.queryServer(req, function(result){
				if (result == "1"){
					console.log("Message sent to " + msg_intent[1]);
				}else{
					console.log("You are not a member of #" + msg_intent[1]);
				}
			});
		}else if (command.substring(0, 5) == '/read'){
			if (tools.messages.length > 0){
				console.log("  -- NEW MESSAGES --");
				tools.messages.forEach(function(element){
					console.log(element);
				});
				console.log("  -- END MESSAGES --");
				tools.messages = [];
			}else{
				console.log("  -- No new message --");
			}
		}else{ // broadcast message
			console.log('Sending message to all #channel, please wait ...');
			
			req.request = 'sendall';
			req.message = command;
			
			tools.queryServer(req, function(result){
				if (result == "1"){
					console.log("Message sent!");
				}else{
					console.log("Unknown Error!");
				}
			});
		}
	}
});

console.log('RabbitIRC - (C) 2015 by 13512028 - Andre Susanto');
console.log('IF4031 - Pengembangan Aplikasi Terdistribusi');
console.log('--------------------------------------------------');
