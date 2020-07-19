# Overview

This Nodejs implements the Redis Stream library.  This provides an API for any client and pass data to the stream and save to an end source.

## Install

You will need to install the latest NodeJS version.  Run the following command to install the required libraries

```
npm install
```

## Start Application

Run the command below in a separate terminal

```
npm start
```

You will the message on the console if the server runs successfully

```
Server listening at http://localhost:8080
```


## API Usage

Then enter the URL in the browser

```
https://localhost:8080/
```

To pass a stream data, use the following URI

```
http://localhost:8080/data?stream={district:001,name:northern%20california}
```

## Redis CLI

Open a terminal and start Redis with command below

```
redis-server
```

Open another terminal and run the following command

```
redis-cli
```
The `monitor` Redis command will output any activities against the DB

```
monitor
```

## Active TO DO Items

1. Auto generate key value - should have a "utils" type of class with such functions
2. Design and create API's with the Express server
3. Design and create to make the web UI be more useable for usage such as format and create the data feed to `stream.js`.  Add features so users can view data in being added in the databse similar to Ethereum's Blockchain "EtherScan" or "Block Explorer"; call it `Stream Explorer`.
4. Get config infor for index.js from config file

## Redis Key Pattern

{namespace}:{version}:{data-category}:{identifier}

namespace - unique space area to avoid collision
version - version of the data
data-category - denotes logically the data or collection of data stored at the key.  A collection of data with similar meaning 
identifier - optionalto use.  collection of data-category(ies)

## Redis and ProtoBuf

1. Create a file with extension `*.proto`.  The command below is using the `protoc` compiler that will take the proto file containing the message and generate the Javascript object

```
protoc --js_out=../ district.proto
```
