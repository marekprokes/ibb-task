var http = require('http'),
    fs = require('fs'),
    redis = require('redis');


var handlerFunctions = require('./lib/handler.js'),
    serverTriggers = require('./lib/triggerserver.js'),
    config = require('./config/_config.js');



var dataClient = redis.createClient(config.redis.port, config.redis.host);


var server = http.createServer( function (req, res) {

  var result, params, exportAppendFile, exportDataClient;	
	params = handlerFunctions.getParamsFromRequest(req);

	if(handlerFunctions.checkRouteTrack(req.url)) {

		if( params !== null ){
  			fs.appendFile(config.fileToSaveParams, JSON.stringify(params), function (err){ 
  				if(!err) { 
  					if ( params.count ) { 
  						dataClient.incrby('count', params.count, function (err, resultRedis){
  							if(!err) handlerFunctions.sendSuccessResponse(res);
  							else handlerFunctions.sendInternalServerError(res);
  						});
  					} else handlerFunctions.sendSuccessResponse(res);
  				} else handlerFunctions.sendInternalServerError(res);
	  		});  

  		} else handlerFunctions.sendSuccessResponse(res);

	} else handlerFunctions.sendPageNotFoundError(res);
});

serverTriggers.serverErrorEvents(server)
serverTriggers.serverStopAfterRedisError(dataClient, server);
serverTriggers.startServerAfterRedisConnect(dataClient, server, config.server.port, config.server.url);
serverTriggers.startStopConsoleCommands(server, config.server.port, config.server.url);
