var sys    = require('sys'),
    ws     = require('./lib/vendor/node_ws/ws'),
    util   = require('util'),
    spawn  = require('child_process').spawn,
    daemon = require('./lib/vendor/node_daemon/daemon'),
    fs     = require('fs');

/**
 * Constants definition.
 *
 * You'll find here the port used to create the WebSocket server.
 */
var PORT      = process.ARGV[3] || 8080,
    DEBUG     = false,
    LOCK_FILE = '/tmp/node_python_repl.pid';


// Handle start/stop commands
var pid;

// try to determine if the deamon is already running or not.
try {
  pid = parseInt(fs.readFileSync(LOCK_FILE));
} catch (e) { } // an undefined pid means that the server is not running

switch(process.argv[2]) {
	case 'stop':
    if (isNaN(pid) || pid === undefined) {
      console.log('Nothing to do: no server is running.');
    } else {
  		process.kill(pid);
    }

		process.exit(0);
		break;

	case 'start':
    if (!isNaN(pid) && pid !== undefined) {
      console.log('The server is already running !');
      process.exit(0);
    }

		pid = daemon.start();
		daemon.lock(LOCK_FILE);
		daemon.closeIO();
		break;

	default:
		console.log('Usage: [start|stop]');
		process.exit(0);
}


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
  websocket.on('connect', function(resource) {
    // the "-u" option enables the unbuffered mode and the "-i" option forces
    // the interactive mode.
    //python = spawn('python2', ['-u', './lib/interpreter.py']);
    python = spawn('python2', ['-u', '-i']);

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
  .on('data', function(data) {
    python.stdin.write(data);
    websocket.write(data);

    console.log('Received: ' + data);
  })

  /**
   * Send a SIGTERM signal to the python process when the connection is closed.
   */
  .on('close', function() {
    python.kill();
    console.log('Connection closed.');
  });
}).listen(PORT);
