var config = {};

config.redis = {};
config.server = {};

config.server.url = '127.0.0.1';
config.server.port =  8124;

config.redis.host = '127.0.0.1';
config.redis.port = 6379;

config.fileToSaveParams = './data/saved_params.json';


module.exports = config;
