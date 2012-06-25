(function($) {
  var t_login = _.template(
    "<div>" +
      "<strong><%= _.escape(nick) %></strong> joined the room" +
    "</div>"
  );

  var t_logout = _.template(
    "<div>" +
      "<strong><%= _.escape(nick) %></strong> left the room" +
    "</div>"
  );

  var t_chat = _.template(
    "<div>" +
      "<strong><%= _.escape(nick) %>: </strong> <%= _.escape(chat) %>" +
    "</div>"
  );

  $(function () {
    var $nick = $('.chatster input.nick');
    var $login = $('.chatster .login');
    var $chat = $('.chatster .chat');
    var $area = $chat.find('.area');
    var $text = $chat.find('form.text');

    $login.submit(function () {
      $login.fadeOut(function () {
        $chat.fadeIn();
      });

      var socket = io.connect('/');
      socket.emit('login', $nick.val());
      $area.append(t_login({ nick: $nick.val() }));

      socket.on('login', function(nick) {
        $area.append(t_login({ nick: nick }));
      });

      socket.on('logout', function(nick) {
        $area.append(t_logout({ nick: nick }));
      });

      socket.on('chat', function(data) {
        $area.append(t_chat(data));
      });

      $text.submit(function() {
        var $input = $(this).find('input.text');
        var text = $input.val();
        if (text.length !== 0) {
          socket.emit('chat', text);
          $input.val('');
          $area.append(t_chat({ nick: $nick.val(), chat: text }));
        }
        return false;
      });

      return false;
    });
  });
}(jQuery));
