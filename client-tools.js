var amqp = require('amqplib/callback_api');

module.exports = {
	serverAddress : '167.205.32.46',
	queueIdentifier : '13512028_',
	serverIdentifier : '13512028_server_',
	nick : '',
	
	genToken : function(){
		return Math.random().toString() + Math.random().toString() + Math.random().toString();
	},
	
	reg : function (nick){
		var _acc = this;
		this.queryServer("nick " + nick, function(result){
			if (result == "1"){
				console.log("Nick Changed to " + nick);
				_acc.nick = nick;
			}else{
				console.log("Nick is used by another person! Please select another!");
			}
		});
	},
	
	queryServer : function (query, callback){
		var serverIdentifier = this.serverIdentifier;
		var token = this.genToken();
		amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
			conn.createChannel(function(err, ch) {
				ch.assertQueue('', {exclusive: true}, function(err, q) {
					var corr = token;

					ch.consume(q.queue, function(msg) {
						if (msg.properties.correlationId == corr) {
							callback(msg.content.toString());
							setTimeout(function() { conn.close() }, 500);
						}
					}, {noAck: true});

					ch.sendToQueue(serverIdentifier, new Buffer(query), { correlationId: corr, replyTo: q.queue });
				});
			});
		});
	},
	
	send : function(queueName, text){
			var queueIdentifier = this.queueIdentifier;
			amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
				conn.createChannel(function(err, ch) {
					var q = queueIdentifier + queueName;

					ch.assertQueue(q, {durable: false});
					ch.sendToQueue(q, new Buffer(text));
					console.log(" [x] Sent 'Hello World!'" + q);
				});
			});	
	},
	listen : function(){
		amqp.connect('amqp://167.205.32.46', function(err, conn) {
		  conn.createChannel(function(err, ch) {
			var q = 'hello';

			ch.assertQueue(q, {durable: false});
			ch.consume(q, function(msg) {
			  console.log(" [x] Received %s", msg.content.toString());
			}, {noAck: true});
		  });
		});
	}
	
};