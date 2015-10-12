# Rabbit IRC
![Rabbit IRC](/../screenshoot/screenshoots/server.JPG?raw=true "Rabbit IRC")

A Simple IRC Chat that is implemented by using RabbitMQ and NodeJS.

## Introduction
1. [What is RabbitMQ?] (https://www.rabbitmq.com/features.html)
2. [Installing RabbitMQ] (https://www.rabbitmq.com/download.html)

This project has two main programs: client and server although it's not quite a usual server-client scheme. In order to work, this project requires a RabbitMQ Server because the client-server communication would be done by using Queue that is provided by RabbitMQ. You may need to set up your own RabbitMQ server in order to run this project. Fortunately, RabbitMQ runs on multiple operating systems including Windows, Linux, and Mac.

## Architecture
Because the usage of socket is replaced by Queue, the architecture of this project is not quite like normal client-server chat program. The following diagram represents the architecture of this project:

![Rabbit IRC Architecture](/../screenshoot/screenshoots/architecture.png?raw=true "Rabbit IRC Architecture")

**Explanation:**

1. Server has a RPC Queue (client push request to queue with exclusive id so server can respond client's request by using that id). This RPC Queue is used for client-server communication except message (such change nick request, join request, etc).
2. Each client has its own queue. This queue is used for delivering messages.
3. Exchange is used for representating channels. Each client's queue is binded to a exchange that correspond with user's subscription of a channel.
4. Server will push message that is sent by user to exchange, and it will deliver the messages to corresponding clients' queue.

## Requirements
In order to install and run this project, you will need:
1. RabbitMQ Server 3.x+
2. NodeJS 0.8x+
3. amqplib 0.4+

## Configuration
To change server address, please make a modification to `server-tools.js` and `client-tools.js`. Replace the following line:
```
module.exports = {
	serverAddress : '167.205.32.46',

 ...
```
to match your server configuration.

## Usage
This project requires amqplib 0.4+. To install it, issue this command: (make sure you have node and npmjs installed in your machine):
```
npm install amqplib
```
Then, you can run the server by issuing following command:
```
node server
```
You can run the client by issuing following command:
```
node client
```

## Test and Execution Results
There are some tests that I've performed to this project. Followings are the results:

### Server Execution
![Rabbit IRC Server](/../screenshoot/screenshoots/server.JPG?raw=true "Rabbit IRC Server")

### Two Client Test
![Two Clients](/../screenshoot/screenshoots/twoclient.JPG?raw=true "Two Clients")

**Scenario:**

1. First client connected to server and picked a nickname.
2. Second client then joined to the server and picked a nickname.
3. First client joined #IFITB.
4. Both client then joined #Crowd.
5. First client sent a message to all channel that he joined.
6. First client sent a message to #IFITB
7. First cleint sent a message to #Crowd
8. Second client received two messages from Client 1 because he had joined #Crowd and not joined #IFITB.


### Leave Test
![Leave Test](/../screenshoot/screenshoots/leavetest.JPG?raw=true "Leave Test")

**Scenario:**

1. First client leaved #Crowd
2. First client sent messages to all channel
3. Second client didn't receive the message as first client had left #Crowd

### Three Client Test
![Three Clients](/../screenshoot/screenshoots/threeclient.JPG?raw=true "Three Clients")

**Scenario:**

1. Third client joined and pick a nick name
2. Third were members of #IFITB and #EXCLUSIVE. First client was a member of #IFITB. Second client was a member of #EXCLUSIVE. 
3. Third client sent a message to all channel.
4. All client could read the messages as third client was a member of both #IFITB and #EXCLUSIVE.
5. Second client sent a message to #EXCLUSIVE. First client sent a message to #IFITB.
6. Only third client that received BOTH messages as it was a member of #IFITB and #EXCLUSIVE.
7. First and Second client only reads message that they've sent only as they didn't share similar channels.
