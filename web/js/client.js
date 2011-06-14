(function($, undefined) {

  // on document ready
  $(function() {
    if(!('WebSocket' in window)) {
      alert('Sorry, the build of your browser does not support WebSockets. Please use latest Chrome or Webkit nightly');
      return;
    }


    $('#interpreter').interpreter({
      cmdLine: '#cmd',
      webSocketUrl: 'ws://localhost:8080/'
    })
    .bind('connectionOpened.interpreter', function() {
      $('#cmd').attr('disabled', false);
    })
    .bind('connectionClosed.interpreter', function() {
      $('#cmd').attr('disabled', true);
    });
  });
})(jQuery);
