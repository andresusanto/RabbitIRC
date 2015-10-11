var amqp = require('amqplib/callback_api');

module.exports = {
	serverAddress : '167.205.32.46',
	queueIdentifier : '13512028_',
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
							if (clients.indexOf(req.command) == -1){
								answer = "1";
								clients.push(req.command);
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