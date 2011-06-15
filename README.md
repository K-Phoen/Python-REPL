# Online Python REPL

Online Python [**R**ead-**E**val-**P**rint **L**oop](http://en.wikipedia.org/wiki/Read-eval-print_loop) based on
the real python interpreter (or a sandboxed version like
[pysandbox](https://github.com/haypo/pysandbox)).

The interpreter is executed on the server and the communication with the user
is done with WebSockets. The server software is Node.js.

## Install

* Clone the repo: `git clone git://github.com/K-Phoen/Python-REPL.git`
* Init the submodules: `git submodules update --init`
* Build the daemon.node submodule:
  * `cd Python-REPL && node-waf configure build`
  * copy the previously built module to the daemon.node root directory:
    `cp build/default/daemon.node .`
  * Go back to the Python-REPL root directory : `cd ../../../`
* Launch the WebSocket server: `node server.js start`
* Open the main page (Python-REPL/web/index.html) in a browser and have fun!

## Demo

Coming soon ...
