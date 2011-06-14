# Online Python REPL

Online Python [**R**ead-**E**val-**P**rint **L**oop](http://www.google.fr) based on
the real python interpreter (or a sandboxed version like
[pysandbox](https://github.com/haypo/pysandbox)).

The interpreter is executed on the server and the communication with the user
is done with WebSockets. The server software is Node.js.

## Install

* Clone the repo : `git clone git://github.com/K-Phoen/Python-REPL.git /home/**USER**/python-repl`
* Init the submodules : `git submodules update --init`
* Launch the WebSocket server : node server.js
* Open the main page (python-repl/web/index.php) in a browser and have fun !
