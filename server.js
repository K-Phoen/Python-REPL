var sys   = require('sys'),
    ws    = require('./lib/vendor/node_ws/ws'),
    util  = require('util'),
    spawn = require('child_process').spawn;

/**
 * Constants definition.
 *
 * You'll find here the port used to create the WebSocket server.
 */
var PORT = process.ARGV[2] || 8080;
var DEBUG = false;


/**
 * Utility functions
 */

console.log = DEBUG ? console.log : function() {};


/**
 * Websocket server creation and requests handling.
 */
ws.createServer(function(websocket) {
  var python;

  /**
   * When a new client shows up, create a new python instance to play with.
   */
  websocket.addListener('connect', function(resource) {
    python = spawn('python', ['-i', '-u']);

    python.stdout.on('data', function (data) {
      websocket.write(data);
      console.log('Sent (stdout): ' + data);
    });

    python.stderr.on('data', function (data) {
      websocket.write(data);
      console.log('Sent (stderr): ' + data);
    });

    python.on('exit', function (code) {
      websocket.write('python exit: ' + code);
      console.log('python exit: ' + code);
    });
  })

  /**
   * Send the data received through the websockect connection into the stdin
   * file descriptor.
   */
  .addListener('data', function(data) {
    python.stdin.write(data);
    console.log('Received: ' + data);
  })

  /**
   * Send a SIGTERM signal to the python process when the connection is closed.
   */
  .addListener('close', function() {
    python.kill();
    console.log('Connection closed.');
  });
}).listen(PORT);
