$(function(){
  $('.login-button').click(function() {
    $(this).prop('disabled', true);
    $.ajax({
      url: '/login',
      type: 'get',
      contentType: 'application/json',
      data: {
        user: $('#name').val()
      }
    }).done(function(data) {
      window.location = '/';
    }).error(function() {
      $(this).prop('disabled', false);
    });
  });
});
