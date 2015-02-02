(function() {
  var currentQuestion = 0;
  var questions = [
    {
      question: 'Time orientation',
      template: timeOrientationTemplate,
      logic: timeOrientationLogic,
      result: timeOrientationResult
    },
    {
      question: 'Place orientation',
      template: function() {
        var parts = [
          'City: <input id="city" type="text" /> ',
          'Country: <input id="country" type="text" />',
          'Floor: <input id="floor" type="number" value="0" min="0" max="120"/>'
        ];
        return parts.join(' ');
      },
      result: function($questionBody) {
        var $city = $questionBody.find('#city');
        var $country = $questionBody.find('#country');
        var $floor = $questionBody.find('#floor');

        return {
          city: $city.val(),
          country: $country.val(),
          floor: $floor.val()
        };

      }
    }
  ];

  var answers = [];

  $(function() {
    showQuestion(currentQuestion);
  });

  function showQuestion(number) {
    var question = questions[number];

    var $questionTitle = $('body .question-title');
    $questionTitle.text(question.question);
    var $questionBody = $('body .question-body');
    $questionBody.empty().append(question.template());

    if($.isFunction(question.logic))
      question.logic($questionBody);

    $('body .submit').one('click', function() {
      answers.push(question.result($questionBody));
      if(++currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      } else {
        $questionTitle.text('Finished!');
        $questionBody.empty();
        console.log(answers);
      }
    });
  }

  function timeOrientationTemplate() {
    var parts = [
      'Day: <input id="day" type="number" value="1" min="1" max="31"/> ',
      'Month: <input id="month" type="number" value="1" min="1" max="12"/>',
      'Year: <input id="year" type="number" value="1900" min="1900" max="2100"/>',
      'Season: <select id="season">' +
          '<option>-</option>' +
          '<option>Spring</option>' +
          '<option>Summer</option>' +
          '<option>Fall</option>' +
          '<option>Winter</option>' +
          '</select>'
    ];
    return parts.join(' ');
  }

  function timeOrientationLogic($questionBody) {
    var $day = $questionBody.find('#day');
    var $month = $questionBody.find('#month');
    var $year = $questionBody.find('#year');


    $month.change(function() {
      var max = moment({ year: $year.val(), month: $month.val()-1 }).daysInMonth();
      $day.attr('max', max);
      $day.val(Math.min(max, $day.val()));
    });
  }

  function timeOrientationResult($questionBody) {
    var $day = $questionBody.find('#day');
    var $month = $questionBody.find('#month');
    var $year = $questionBody.find('#year');
    var $season = $questionBody.find('#season');

    return {
      date: moment({ year: $year.val(), month: $month.val()-1, day: $day.val() }).toDate(),
      season: $season.val()
    };
  }
})();
