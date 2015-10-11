var amqp = require('amqplib/callback_api');

module.exports = {
	serverAddress : '167.205.32.46',
	queueIdentifier : '13512028_',
	channelIdentifier : '13512028_channel_',
	serverIdentifier : '13512028_server_',
	clients : [],
		
	send : function(queueName, text){
			var queueIdentifier = this.queueIdentifier;
			amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
				conn.createChannel(function(err, ch) {
					var q = queueIdentifier + queueName;

					ch.assertQueue(q, {durable: false});
					ch.sendToQueue(q, new Buffer(text));
					//console.log(" [x] Sent 'Hello World!'" + q);
				});
			});	
	},
	
	listen : function(){
		clients = this.clients;
		serverIdentifier = this.serverIdentifier;
		channelIdentifier = this.channelIdentifier;
		queueIdentifier = this.queueIdentifier;
		
		amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
			conn.createChannel(function(err, ch) {
				var q = serverIdentifier;

				ch.assertQueue(q, {durable: false});
				ch.prefetch(1);
				ch.consume(q, function (msg) {
					var answer = "0";
					var req = JSON.parse(msg.content.toString());
					
					switch (req.request){
						case 'nick':
							if (clients[req.command] == undefined){
								answer = "1";
								clients[req.command] = [];
							}else{
								answer = "0";
							}
							break;
						
						case 'join':
							if (clients[req.nick].indexOf(req.command) == -1){
								ch.assertExchange(channelIdentifier + req.command, 'fanout', {durable: false});
								ch.bindQueue(queueIdentifier + req.nick, channelIdentifier + req.command, '');
								clients[req.nick].push(req.command);
								answer = "1";
							}else{
								answer = "0";
							}
							break;
						
						case 'leave':
							if (clients[req.nick].indexOf(req.command) != -1){
								ch.assertExchange(channelIdentifier + req.command, 'fanout', {durable: false});
								ch.unbindQueue(queueIdentifier + req.nick, channelIdentifier + req.command, '');
								
								clients[req.nick].splice(clients[req.nick].indexOf(req.command));
								answer = "1";
							}else{
								answer = "0";
							}
							break;
							
						case 'sendto':
							if (clients[req.nick].indexOf(req.to) != -1){
								ch.publish(channelIdentifier + req.to, '', new Buffer('[' + req.nick + ']\t' + req.message));
								answer = "1";
							}else{
								answer = "0";
							}
							break;
						
					}
					
					ch.sendToQueue(msg.properties.replyTo, new Buffer(answer), {correlationId: msg.properties.correlationId});
					ch.ack(msg);
				});
			});
		});
	}
};