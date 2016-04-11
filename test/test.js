var expect=require('chai').expect,
	sinon = require('sinon'),
	redis = require('redis'),
	fs = require('fs');
	
var handlerFunctions = require('../lib/handler.js');

describe('Test function checkRouteTrack ', function() {
	var requestTrack = 'http://localhost/track',
   		requestEmpty = 'http://localhost';

         	
	it('Check request route of \'track\' should return true ', function() {
        expect(handlerFunctions.checkRouteTrack(requestTrack)).to.be.true;
	});
	it('Check request route of \'track\' should return undefined ', function() {
		expect(handlerFunctions.checkRouteTrack(requestEmpty)).to.be.undefined;
	});
});


describe('Test function getParamsFromRequest ', function() {
    var	requestTrackParams = {url : 'http://localhost/track?a=1&c=6'},
    	requestTrackEmpty = {url : 'http://localhost/track?'};

    it('Get params from request url if exists, shouild return an object', function() {
    	expect(handlerFunctions.getParamsFromRequest(requestTrackParams)).to.be.an('object');
    	expect(handlerFunctions.getParamsFromRequest(requestTrackParams)).to.eql({a:'1', c:'6'})
    });
    
	it('should return an false if params not exists ', function() {
    	expect(handlerFunctions.getParamsFromRequest(requestTrackEmpty)).to.be.null;
    });
});

describe('Test function responseCommands ', function() {

	it('Should pass response.writeHead function and check correct HTML status code', function() {
		var response = { writeHead : function () {}, end : function () {},statusCode : '' };
			response.statusCode = 200;
		var writeHead = sinon.spy(response, 'writeHead');
		
        handlerFunctions.responseCommands(response, 200);
        
        
        expect(writeHead.called).to.be.true;
        expect(writeHead.calledWith(200)).to.be.true;
        
	});

	it('Should pass response.end function and check correct body string ', function() {
		var response = { writeHead : function () {}, end : function () {}, statusCode : '' };
			response.statusCode = 200;
		var end = sinon.spy(response, 'end');
		
        handlerFunctions.responseCommands(response, 200, 'OK');
        
               
        expect(end.calledWith(response.statusCode+' '+'OK')).to.be.true;
        expect(end.called).to.be.true;
	});
});

describe('Test function sendSuccessResponse', function() {
	     	
    var res = {writeHead : function () {}, end : function () {} };        
	
	it('Check if response.end passed at responseCommands', function() {
    
		handlerFunctions.responseCommands = sinon.spy();

        handlerFunctions.sendSuccessResponse(res);

		handlerFunctions.responseCommands.restore;
        expect(handlerFunctions.responseCommands.calledWith(res, 200, 'OK')).to.be.true;
	});

	     	
	it('Check if response.end is passed at responseCommands', function() {

        handlerFunctions.responseCommands = sinon.spy();

        handlerFunctions.sendInternalServerError(res);
  
		handlerFunctions.responseCommands.restore;
        expect(handlerFunctions.responseCommands.calledWith(res, 500, 'Internal Server Error')).to.be.true;
	});

	     	
	it('Check if response.end is passed at responseCommands', function() {
       
        handlerFunctions.responseCommands = sinon.spy();

        handlerFunctions.sendPageNotFoundError(res);

		handlerFunctions.responseCommands.restore;
        expect(handlerFunctions.responseCommands.calledWith(res, 404, 'Page Not Found')).to.be.true;
	});
});

