(function($, undefined){
  $.fn.nodePythonInterpreter = function(method) {
    var options = {
      'cmdLine': undefined,
      'webSocketUrl': undefined
    };


    /**************************************************************************
     * Public API methods
     *************************************************************************/
    var methods = {
      init: function(user_options) {
        if (user_options) {
          $.extend(options, user_options || {});
        }

        checkOptions();
        initWebSocket();
        connectCommandLine();

        return this;
      },
      destroy: function() {
        return this;
      }
    };


    /**************************************************************************
     * Private methods
     *************************************************************************/
    var containers = this,
        ws;

    function checkOptions() {
      var needed_options = ['cmdLine', 'webSocketUrl'];
      for (var key in needed_options) {
        if (options[needed_options[key]] === undefined) {
          throw 'You must specify the ' + needed_options[key] + ' option';
        }
      }
    }

    function connectCommandLine() {
      options.cmdLine.change(function() {
        onNewCommand(options.cmdLine.val());
      });
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

    function onNewCommand(cmd) {
      ws.send(cmd + '\n');
      containers.each(function() {
        $(this).append('&gt;&gt;&gt; ' + nl2br(cmd) + '<br />');
      });

      options.cmdLine.val('');
    }

    function nl2br (str, is_xhtml) {
      var breakTag = (is_xhtml === false) ? '' : '<br />';

      return (str || '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }


    /**************************************************************************
     * Plugin behaviour
     *************************************************************************/
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.nodePythonIntepreter');
    }
  };
})(jQuery);
