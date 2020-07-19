//Express related libraries
const express = require('express');
var Promise = require('promise');
var session = require('express-session');
var router = express.Router();
const url = require('url');
const querystring = require('querystring');
var server = express();
require('dotenv').config();

//Redis Stream libraries
const redis = require('redis');
var redisStore = require('connect-redis')(session);
var ioRedis = require('ioredis');

//TRG Stream related
const trgUtils  = require('./src/TrgUtils')
const utils = new trgUtils();

//ProtoBuf objects
var protobuf = require("protobufjs");
var jspb = require('google-protobuf');
//var district = require('./src/district');

//all defined in a .env file
const express_host = process.env.EXPRESS_HOST;
const express_port = process.env.EXPRESS_PORT;
const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;
var redisClient = redis.createClient(redis_port, redis_host);

//Quick test of ProtoBuf objects
/*let BCDistrict = new district();
BCDistrict.setName('British Columbia');
BCDistrict.setUuid( utils.getNewUUID() );
console.log(`District Instance :: ${BCDistrict.getName()} with UUID of ${BCDistrict.getUuid()}`)
*/

/*protobuf.load("./src/objects/district.proto", function(err, root) {
  if (err)
      throw err;

  // Obtain a message type
  var districtObj = root.lookupType("District");

  // Exemplary payload
  var _uuid = utils.generateUniqueId();
  var payload = { name: "British Columbia",uuid:_uuid };

  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  var errMsg = districtObj.verify(payload);
  if (errMsg)
      throw Error(errMsg);

  // Create a new message
  var message = districtObj.create(payload); // or use .fromObject if conversion is necessary
  
  
  // Encode a message to an Uint8Array (browser) or Buffer (node)
  var buffer = districtObj.encode(message).finish();
  // ... do something with buffer
  console.log( `buffer ${buffer}` );

  // Decode an Uint8Array (browser) or Buffer (node) to a message
  var message = districtObj.decode(buffer);
  // ... do something with message
  console.log( `message ${message.name} :: ${message.uuid}` );
  
  // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
  var key = utils.getNewUUID();
  redisClient.set(key, `{name:${message.name},uuid:${message.uuid}}`, redis.print);
  redisClient.get(key, function(error, result) {
      if(error) {
        console.log(error);
        throw error;
      }
      
      console.log('GET result ->' + result);
  });
  
});*/


/*
* Process default root index file
*/
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.get('/district',(req, res) => {
  let protobuf = require("protobufjs");
  var _query = url.parse(req.url, true).query;
  var districtId = _query.id;
  var districtName = _query.name
  key = protobuf.load("./src/objects/district.proto", function(err, root) {
    if (err)
        throw err;
  
    // Obtain a message type
    var districtObj = root.lookupType("District");
  
    // Exemplary payload
    var payload = { name: districtName, uuid: districtId };
  
    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = districtObj.verify(payload);
    if (errMsg)
        throw Error(errMsg);
  
    // Create a new message
    var message = districtObj.create(payload); // or use .fromObject if conversion is necessary
    
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = districtObj.encode(message).finish();
    // ... do something with buffer
    console.log( `buffer ${buffer}` );
  
    // Decode an Uint8Array (browser) or Buffer (node) to a message
    var message = districtObj.decode(buffer);
    // ... do something with message
    console.log( `message ${message.name} :: ${message.uuid}` );

    //Redis Stream
    var key = utils.generateUniqueId();
    redisClient.set(key, buffer, redis.print);
    redisClient.get(key, function(error, result) {
      if(error) {
        console.log(error);
        throw error;
      }
      console.log('GET result ->' + result);
    });
    
  });
  res.send(`District Data ${districtId} -- ${districtName}`);
}); 

server.get('/stream', (req, res) => {
  var _query = url.parse(req.url, true).query;
  var streamData = _query.stream;
  var key = utils.getNewUUID();
  redisClient.set(key, streamData, redis.print);
  redisClient.get(key, function(error, result) {
      if(error) {
        console.log(`Error ${error}`);
        throw error;
      }
      console.log('GET result ->' + result);
  });
  res.send(`Key ${key} :: Data ${streamData}`);
});


//listen for client event
redisClient.on('error', (err) => {
  console.log('Redis error: ', err)
});

/*server.use(session({
  secret: "SecretSessionToken",
  name: '_redisSession',
  saveUninitialized: true,
  resave: false,
  cookie: {secure: false}, 
  store: new redisStore({host: redis_host, port: redis_port, client: redisClient, ttl: 86400})
}));*/

server.listen(express_port, () => console.log(`Server listening at http://${express_host}:${express_port}`));


