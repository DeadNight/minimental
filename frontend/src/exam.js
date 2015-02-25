(function() {
  var currentQuestion = 0;
  var answers = [];
  var nouns = [
    'raindrop', 'kitten', 'dog', 'package', 'string', 'bee', 'moon', 'wing', 'dress', 'nose'
  ];

  var imageNouns = [
    'bag', 'car', 'drums', 'flower', 'frog', 'key', 'pig', 'ring', 'shoe', 'well'
  ];

  var questions = [
    {
      question: '',
      template: function() {
        return [
          '<svg id="clock" viewBox="0 0 100 100">' +
          '<circle id="face" cx="50" cy="50" r="45"/>' +
          '<g id="hands" transform="translate(50, 50)">' +
          '<rect id="min" x="0" y="0" width="3" height="40" rx="2" ry="2"/>' +
          '<rect id="hour" x="-1" y="0" width="5" height="20" rx="2.5" ry="2.55"/>' +
          '</g>' +
          '</svg>'
        ];
      },
      logic: function($questionBody) {
        var origin = $('#hands').offset();
        var minLastAngle = 0;
        var hourLastAngle = 0;

        $questionBody.find('#min').on('mousedown', function(event) {
          var startPos = { left: event.clientX, top: event.clientY };
          var $body = $('body');

          $body.one('mouseup', function(event) {
            $('body').off('mousemove.min');

            var currentPos = { left: event.clientX, top: event.clientY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += minLastAngle;
            minLastAngle = angle;
          });

          $body.on('mousemove.min', function(event) {
            var currentPos = { left: event.clientX, top: event.clientY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += minLastAngle;
            $questionBody.find('#min').css('transform', 'rotate('+angle+'rad)');
          });
        });

        $questionBody.find('#hour').on('mousedown', function() {
          var startPos = { left: event.clientX, top: event.clientY };
          var $body = $('body');

          $body.one('mouseup', function(event) {
            $('body').off('mousemove.hour');

            var currentPos = { left: event.clientX, top: event.clientY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += hourLastAngle;
            hourLastAngle = angle;
          });

          $body.on('mousemove.hour', function(event) {
            var currentPos = { left: event.clientX, top: event.clientY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += hourLastAngle;
            $questionBody.find('#hour').css('transform', 'rotate('+angle+'rad)');
          });
        });
      }
    },
    {
      question: 'Time orientation',
      template: function() {
        var parts = [
          '<div>Day: <input id="day" type="number" value="1" min="1" max="31"/></div>',
          '<div>Month: <input id="month" type="number" value="1" min="1" max="12"/></div>',
          '<div>Year: <input id="year" type="number" value="1900" min="1900" max="2100"/></div>',
          '<div>Season: <select id="season">' +
              '<option>-</option>' +
              '<option>Spring</option>' +
              '<option>Summer</option>' +
              '<option>Fall</option>' +
              '<option>Winter</option>' +
              '</select></div>'
        ];
        return parts.join(' ');
      },
      logic: function($questionBody) {
        var $day = $questionBody.find('#day');
        var $month = $questionBody.find('#month');
        var $year = $questionBody.find('#year');


        $month.change(function() {
          var max = moment({ year: $year.val(), month: $month.val()-1 }).daysInMonth();
          $day.attr('max', max);
          $day.val(Math.min(max, $day.val()));
        });
      },
      result: function($questionBody) {
        var $day = $questionBody.find('#day');
        var $month = $questionBody.find('#month');
        var $year = $questionBody.find('#year');
        var $season = $questionBody.find('#season');

        return {
          date: moment({ year: $year.val(), month: $month.val()-1, day: $day.val() }).toDate(),
          season: $season.val()
        };
      }
    },
    {
      question: 'Place orientation',
      template: function() {
        var parts = [
          '<div>City: <input id="city" type="text" /></div>',
          '<div>Country: <input id="country" type="text" /></div>',
          '<div>Floor: <input id="floor" type="number" value="0" min="0" max="120"/></div>'
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
    },
    {
      question: 'Remember the next three words',
      template: function(){
        return '<p class="word"/>';
      },
      logic: function($questionBody) {
        hideSubmit();
        nouns = _.shuffle(nouns);

        var i = 0;
        setTimeout(function anonimRecurs() {
          if(i < 3) {
            $questionBody.find('.word').text(nouns[++i]);
            setTimeout(anonimRecurs, 1000);
          } else {
            $questionBody.find('.word').text('');
            showSubmit();
          }
        }, 300);
      }
    },
    {
      question: 'What is this called ?',
      template: function() {
        var parts = [
          '<div><image id="image" style="max-height: 250px;" /></div>',
          '<div><input id="name" type="text" /></div>',
          '<button id="next">Next</button>',
          '<input id="words" type="hidden"/>'
        ];
        return parts.join(' ');
      },
      logic: function($questionBody) {
        hideSubmit();
        imageNouns = _.shuffle(imageNouns);

        var i = 0;
        $questionBody.find('#image').attr('src', 'media/'+imageNouns[++i]+'.jpg');

        $questionBody.find('#next').click(function() {
          var $words = $questionBody.find('#words');
          var $name = $questionBody.find('#name');

          if(i == 1)
            $words.val($name.val());
          else
            $words.val($words.val().split(',').concat($name.val()).join());

          $name.val('');

          $questionBody.find('#image').attr('src', 'media/'+imageNouns[++i]+'.jpg');

          if(i >= 3) {
            $questionBody.find('#next').hide();
            showSubmit();
          }
        });
      },
      result: function($questionBody) {
        var $name = $questionBody.find('#name');
        var $words = $questionBody.find('#words');

        return {
          words: $words.val().split(',').concat($name.val()),
          images: imageNouns.slice(0, 3)
        };
      }
    },
    {
      question: 'What were the three words you were asked to remember ?',
      template: function() {
        var parts = [
          '<div>1: <input id="word1" type="text"/></div>',
          '<div>2: <input id="word2" type="text"/></div>',
          '<div>3: <input id="word3" type="text"/>'
        ];
        return parts.join(' ');
      },
      result: function($questionBody) {
        var $word1 = $questionBody.find('#word1');
        var $word2 = $questionBody.find('#word2');
        var $word3 = $questionBody.find('#word3');

        return {
          word1: $word1.val(),
          word2: $word2.val(),
          word3: $word3.val(),
          words: nouns.slice(0, 3)
        };
      }
    },
    {
      question: 'Subtract 7',
      template: function() {
        var parts = [
          '<div class="equation"><span id="number"/> - 7 = <input id="diff" type="text"/></div>',
          '<button id="next">Next</button>',
          '<input id="numbers" type="hidden"/>'
        ];

        return parts.join(' ');
      },
      logic: function($questionBody) {
        hideSubmit();
        var $number = $questionBody.find('#number');
        var $diff = $questionBody.find('#diff');
        var $numbers = $questionBody.find('#numbers');
        $number.text(100);

        var i = 0;
        $questionBody.find('#next').click(function() {
          var diff = parseInt($diff.val(), 10);

          if(i++ == 0)
            $numbers.val(diff);
          else
            $numbers.val($numbers.val().split(',').concat(diff).join());

          $number.text(diff || 0);
          $diff.val('')

          if(i >= 4) {
            $questionBody.find('#equation').hide();
            $questionBody.find('#next').hide();
            showSubmit();
          }
        });
      },
      result: function($questionBody) {
        var $diff = $questionBody.find('#diff');
        var $numbers = $questionBody.find('#numbers');

        return {
          numbers: $numbers.val().split(',').concat(parseInt($diff.val(), 10))
        };
      }
    },
    {
      question: 'Translate the following time to 24H formt:',
      template: function(){
        var parts = [
          '<input id="time" type="hidden"/>',
          '<div id="timeString"/>',
          '<input id="hours" type="number" min="0" max="60"/> : <input id="minutes" type="number" min="0" max="60"/>'
        ];

        return parts.join(' ');
      },
      logic: function($questionBody) {
        var hours = 1 + Math.floor(Math.random()*12);
        var ampm;
        if((Math.random() - .5) > 0)
          ampm = 'AM';
        else
          ampm = 'PM';
        var minutes = Math.floor(Math.random()*60);

        $questionBody.find('#time').val([hours,minutes,ampm]);

        $questionBody.find('#timeString').text(
          num2str(hours) + ' hours and ' + num2str(minutes) + ' minutes ' + ampm
        );
      },
      result: function($questionBody) {
        var $time = $questionBody.find('#time');
        var $hours = $questionBody.find('#hours');
        var $minutes = $questionBody.find('#minutes');

        return {
          time: $time.val(),
          hours: $hours.val(),
          minutes: $minutes.val()
        }
      }
    }
  ];

  $(function() {
    showQuestion(currentQuestion);
  });

  function showSubmit() {
    $('.submit').show();
  }

  function hideSubmit() {
    $('.submit').hide();
  }

  function showQuestion(number) {
    var question = questions[number];

    var $questionTitle = $('.question-title');
    $questionTitle.text(question.question);
    var $questionBody = $('.question-body');
    $questionBody.empty().append(question.template());

    if($.isFunction(question.logic))
      question.logic($questionBody);

    $('body .submit').one('click', function() {
      if(question.result)
        answers.push(question.result($questionBody));

      if(++currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      } else {
        $questionTitle.text('Finished!');
        hideSubmit();
        $questionBody.empty();
        console.log(answers);
      }
    });
  }
})();
