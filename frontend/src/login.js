$(function(){
  $('.login-button').click(function() {
    $(this).prop('disabled', true);
    $.ajax({
      url: 'http://localhost:3000/login',
      type: 'get',
      contentType: 'application/json',
      data: {
        user: $('#name').val()
      }
    }).done(function(data) {
      window.location = 'exam.html';
    }).error(function() {
      $(this).prop('disabled', false);
    });
  });
});
