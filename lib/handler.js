var url = require('url'),  
    fs = require('fs'),
    sinon = require('sinon');

var exports = module.exports;

var checkRouteTrack = function (urlData) {
    if (url.parse(urlData).pathname == '/track') return true;
};

var getParamsFromRequest = function (req){
    var gotParams; 
    if( !Object.keys(gotParams = url.parse(req.url, true).query).length ) {	
 		return null; 
    } else { 
    	return gotParams; 
    }
};

var responseCommands = function (res, statusCode, body){
	res.writeHead(statusCode , {'Content-Type': 'text/plain'}); 
    res.end(res.statusCode+' '+body);
};

var sendSuccessResponse = function(res){
	exports.responseCommands(res, 200, 'OK');
};
var sendInternalServerError = function(res){
	exports.responseCommands(res, 500, 'Internal Server Error');
};
var sendPageNotFoundError = function (res){
	exports.responseCommands(res, 404, 'Page Not Found');
};


exports.checkRouteTrack = checkRouteTrack;
exports.getParamsFromRequest = getParamsFromRequest;
exports.responseCommands = responseCommands;
exports.sendSuccessResponse = sendSuccessResponse;
exports.sendInternalServerError = sendInternalServerError;
exports.sendPageNotFoundError = sendPageNotFoundError;