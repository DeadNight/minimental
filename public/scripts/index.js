(function() {
  $(function() {
    $('.history-button').click(function() {
      window.location = '/exam/history';
    });

    $('.exam-button').click(function() {
      window.location = '/exam';
    });

    $('.logout-button').click(function() {
      $(this).prop('disabled', true);
      $.ajax({
        url: '/logout',
        type: 'get'
      }).done(function(data) {
        window.location = '/';
      }).error(function() {
        $(this).prop('disabled', false);
      });
    });
  });
})();
