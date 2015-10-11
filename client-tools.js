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
		var req = {};
		req.request = 'nick';
		req.command = nick;
		
		this.queryServer(req, function(result){
			if (result == "1"){
				console.log("Nick Changed to " + nick);
				_acc.nick = nick;
				
				_acc.listen();
			}else{
				console.log("Nick is used by another person! Please select another!");
			}
		});
	},
	
	queryServer : function (query, callback){
		var serverIdentifier = this.serverIdentifier;
		var token = this.genToken();
		
		query.nick = this.nick;
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
					
					var query_string = JSON.stringify(query);
					ch.sendToQueue(serverIdentifier, new Buffer(query_string), { correlationId: corr, replyTo: q.queue });
				});
			});
		});
	},
	
	listen : function(){
		var nick = this.nick;
		var queueIdentifier = this.queueIdentifier;
		
		amqp.connect('amqp://' + this.serverAddress, function(err, conn) {
			conn.createChannel(function(err, ch) {
				var q = queueIdentifier + nick;

				ch.assertQueue(q, {durable: false});
				ch.consume(q, function(msg) {
				console.log(" -- %s", msg.content.toString());
				}, {noAck: true});
			});
		});
	}
	
};