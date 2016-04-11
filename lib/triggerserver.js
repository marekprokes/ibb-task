var exports = module.exports;
var stopped = false;

var serverStopAfterRedisError = function serverStopAfterRedisError (dataClient, server){
  dataClient.on("error", function (err) {
	 server.close(function(){
   	  	console.log('Redis Connection error.');
    	});
  });
}

var startServer = function startServer (server, port, url){
		server.listen(port, url, function(){
			console.log('Server now running on url:port :  '+url+':'+port+' ');
			console.log('Type "stop" to stop server.');
			process.stdin.resume();
      stopped = false;
		});	
}

var startServerAfterRedisConnect = function startServerAfterRedisConnect(dataClient, server, port, url){
	dataClient.on("connect", function (){	
		if(!stopped) startServer(server, port, url);
    else console.log( 'Server was stopped, type "start" to start server.');
	});
}
var serverErrorEvents = function serverErrorEvents(server){
  server.on('error', (err) => {  
    if (err.code == 'EADDRINUSE') {
  		console.log('Error Server on this port is running. You can type "start" to reconnection.');
    } else console.log(err);
  });
}


var startStopConsoleCommands = function startStopConsoleCommands(server,port,url){ 
	process.stdin.on('data', (data) => {
		var	command = data.toString().trim();
   			if ( command == 'stop'){
   				server.close( function(){
   					console.log('Server was stopped! You can type "start" to start server.');
            stopped = true;
   				}); 
   			}  	

   			if ( command == 'start'){
          		startServer(server,port,url);
   			}
   });
}
exports.startStopConsoleCommands = startStopConsoleCommands;
exports.serverErrorEvents = serverErrorEvents;
exports.serverStopAfterRedisError = serverStopAfterRedisError;
exports.startServerAfterRedisConnect = startServerAfterRedisConnect;