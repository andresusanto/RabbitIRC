var amqp = require('amqplib/callback_api');

module.exports = {
	serverAddress : '167.205.32.46',
	queueIdentifier : '13512028_',
	serverIdentifier : '13512028_server_',
	
	rpcListen : function(){
		serverIdentifier = this.serverIdentifier;
		amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
			conn.createChannel(function(err, ch) {
				var q = serverIdentifier;

				ch.assertQueue(q, {durable: false});
				ch.prefetch(1);
				ch.consume(q, function (msg) {
				//	var n = parseInt(msg.content.toString());
					var n = "1";//msg.content.toString() + " appended!";
					ch.sendToQueue(msg.properties.replyTo, new Buffer(n), {correlationId: msg.properties.correlationId});

					ch.ack(msg);
				});
			});
		});
	}
};