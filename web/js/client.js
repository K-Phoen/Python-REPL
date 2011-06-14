(function($, undefined) {

  // on document ready
  $(function() {
    if(!('WebSocket' in window)) {
      alert('Sorry, the build of your browser does not support WebSockets. Please use latest Chrome or Webkit nightly');
      return;
    }


    $('#results').nodePythonInterpreter({
      cmdLine: $('#cmd'),
      webSocketUrl: 'ws://localhost:8080/'
    });
  });
})(jQuery);
