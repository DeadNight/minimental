$(function(){
  $('.logout-button').click(function() {
    $(this).prop('disabled', true);
    $.ajax({
      url: '/logout',
      type: 'get',
    }).done(function(data) {
      window.location = '/';
    }).error(function() {
      $(this).prop('disabled', false);
    });
  });
});
