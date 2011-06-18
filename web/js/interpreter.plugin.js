(function($, undefined){
  var options = {
    'cmdLine': undefined,
    'webSocketUrl': undefined
  };


  /**************************************************************************
   * Public API methods
   *************************************************************************/
  var methods = {
    init: function(user_options) {
      containers = this;
      if (user_options) {
        $.extend(options, user_options || {});
      }

      checkOptions();
      initWebSocket();
      bindEvents();

      return this;
    },
    execute: function(cmd) {
      executeCommand(cmd);
    },
    destroy: function() {
      containers.unbind('.interpreter');
      ws.close();

      return this;
    }
  };


  /**************************************************************************
   * Private methods
   *************************************************************************/
  var containers, ws;

  function checkOptions() {
    var needed_options = ['cmdLine', 'webSocketUrl'];
    for (var key in needed_options) {
      if (options[needed_options[key]] === undefined) {
        throw 'You must specify the ' + needed_options[key] + ' option';
      }
    }

    if (typeof options.cmdLine === 'string') {
      options.cmdLine = $(options.cmdLine);
    }
  }

  function bindEvents() {
    options.cmdLine.bind('change.interpreter', function() {
      executeCommand(options.cmdLine.val());
    });

    // trigger the 'change' event when pressing 'enter'
    options.cmdLine.bind('keypress.interpreter', function(event) {
      if (event.which === 13) { // enter key
        options.cmdLine.change();
      }
    });

    containers.bind('commandExecuted.interpreter', onCommandExecuted);
  }

  function initWebSocket() {
    ws = new WebSocket(options.webSocketUrl);

    ws.onmessage = onMessage;
    ws.onclose = function() {
      containers.trigger('connectionClosed.interpreter');
    };
    ws.onopen = function() {
      containers.trigger('connectionOpened.interpreter');
    };
  }

  function onMessage(evt) {
    var data = nl2br(evt.data);

    containers.each(function() {
      $(this).append(data);
    });
  }

  function executeCommand(cmd) {
    ws.send(cmd + '\n');

    containers.trigger('commandExecuted.interpreter', [cmd]);
  }

  function onCommandExecuted(event, cmd) {
      //$(event.target).append('&gt;&gt;&gt; ' + nl2br(cmd) + '<br />');

    options.cmdLine.val('');
  }

  function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml === false) ? '' : '<br />';

    return (str || '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }


  /**************************************************************************
   * Plugin behaviour: method calling logic
   *************************************************************************/
  $.fn.interpreter = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.interpreter');
    }
  };
})(jQuery);
