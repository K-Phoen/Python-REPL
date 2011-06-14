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
      connectCommandLine();

      return this;
    },
    execute: function(cmd) {
      executeCommand(cmd);
    },
    destroy: function() {
      ws.close();

      containers.unbind('.interpreter');
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

  function connectCommandLine() {
    options.cmdLine.bind('change.interpreter', function() {
      executeCommand(options.cmdLine.val());
    });

    containers.bind('commandExecuted.interpreter', onCommandExecuted);
  }

  function initWebSocket() {
    ws = new WebSocket(options.webSocketUrl);

    ws.onmessage = onMessage;
    ws.onclose = onClose;
    ws.onopen = onOpen;
  }

  function onOpen() {
    console.warn('Connected !');
    options.cmdLine.attr('disabled', false);
  }

  function onClose() {
    console.warn('Connection closed');
    options.cmdLine.attr('disabled', true);
  }

  function onMessage(evt) {
    var data = evt.data;

    // dirty hack to remove the last '>>> ' from the interpreter output
    if (data.substring(data.length - 4, data.length) === '>>> ') {
      data = data.substring(0, data.length - 4);
    }

    data = nl2br(data);
    containers.each(function() {
      $(this).append(data);
    });
  }

  function executeCommand(cmd) {
    ws.send(cmd + '\n');

    containers.trigger('commandExecuted.interpreter', [cmd]);
  }

  function onCommandExecuted(event, cmd) {
      $(event.target).append('&gt;&gt;&gt; ' + nl2br(cmd) + '<br />');

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