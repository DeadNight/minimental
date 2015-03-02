(function() {
  var currentQuestion = 0;
  var answers = [];
  var nouns = [
    'raindrop', 'kitten', 'table', 'school', 'string', 'bee', 'moon', 'family', 'dress', 'camp'
  ];
  var imageNouns = [
    'bag', 'car', 'drum', 'flower', 'balloon', 'key', 'pig', 'ring', 'shoe', 'well'
  ];

  var questions = [
    {
      question: 'What is the current date and season ?',
      template: function() {
        var parts = [
          '<div><label for="day">Day:</label> <input id="day" type="number" min="1" max="31"/></div>',
          '<div><label for="month">Month:</label> <input id="month" type="number" min="1" max="12"/></div>',
          '<div><label for="year">Year:</label> <input id="year" type="number" min="1900" max="2100"/></div>',
          '<div><label for="season">Season:</label> <select id="season">' +
            '<option></option>' +
            '<option>Spring</option>' +
            '<option>Summer</option>' +
            '<option>Fall</option>' +
            '<option>Winter</option>' +
            '</select>' +
          '</div>'
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
      validate: function($questionBody) {
        var $day = $questionBody.find('#day');
        var $month = $questionBody.find('#month');
        var $year = $questionBody.find('#year');

        return $day[0].validity.valid && $month[0].validity.valid && $year[0].validity.valid
      },
      result: function($questionBody) {
        var $day = $questionBody.find('#day');
        var $month = $questionBody.find('#month');
        var $year = $questionBody.find('#year');
        var $season = $questionBody.find('#season');
        var now = moment()

        return {
          day: $day.val(),
          month: $month.val(),
          year: $year.val(),
          season: $season.val(),
          date: {
            day: now.get('date'),
            month: now.get('month') + 1,
            year: now.get('year')
          }
        };
      }
    },
    {
      question: 'Where are you now ?',
      template: function() {
        var parts = [
          '<div><label for="city">City:</label> <input id="city" type="text" /></div>',
          '<div><label for="country">Country:</label> <input id="country" type="text" /></div>',
          '<div><label for="floor">Floor:</label> <input id="floor" type="number"/></div>'
        ];
        return parts.join(' ');
      },
      validate: function($questionBody) {
        var $floor = $questionBody.find('#floor');

        return $floor[0].validity.valid
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
        return [
          '<p class="word"/>',
          '<button id="show">Show</button>'
        ];
      },
      logic: function($questionBody) {
        hideSubmit();
        nouns = _.shuffle(nouns);

        $questionBody.find('#show').one('click', function() {
          $(this).hide();

          var i = 0;
          setTimeout(function anonimRecurs() {
            if(i < 3) {
              $questionBody.find('.word').text(nouns[i++]);
              setTimeout(anonimRecurs, 2000);
            } else {
              $questionBody.find('.word').text('');
              showSubmit();
            }
          }, 300);
        });
      }
    },
    {
      question: 'What is this called ?',
      template: function() {
        var parts = [
          '<div><image id="image" style="max-height: 230px;" /></div>',
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
        $questionBody.find('#image').attr('src', '/images/'+imageNouns[i++]+'.jpg');

        $questionBody.find('#next').click(function() {
          var $words = $questionBody.find('#words');
          var $name = $questionBody.find('#name');

          if(i == 1)
            $words.val($name.val());
          else
            $words.val($words.val().split(',').concat($name.val()).join());

          $name.val('');
          $name.focus();

          $questionBody.find('#image').attr('src', '/images/'+imageNouns[i++]+'.jpg');

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
          '<div><label for="word1">1:</label> <input id="word1" type="text"/></div>',
          '<div><label for="word2">2:</label> <input id="word2" type="text"/></div>',
          '<div><label for="word3">3:</label> <input id="word3" type="text"/>'
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
          '<div class="equation"><label for="diff"><span id="number"/> - 7 =</label>' +
            '<input id="diff" type="text" required pattern="\\d*"/></div>',
          '<button id="next">Next</button>',
          '<input id="numbers" type="hidden"/>'
        ];

        return parts.join(' ');
      },
      logic: function($questionBody) {
        hideSubmit();
        var validate = this.validate;

        var $number = $questionBody.find('#number');
        var $diff = $questionBody.find('#diff');
        var $numbers = $questionBody.find('#numbers');
        $number.text(100);

        $questionBody.find('#next').prop('disabled', true);
        $questionBody.find('input, select').on('input', function() {
          $questionBody.find('#next').prop('disabled', !$diff[0].validity.valid);
        });

        var i = 0;
        $questionBody.find('#next').click(function() {
          var diff = parseInt($diff.val(), 10);

          if(i++ == 0)
            $numbers.val(diff);
          else
            $numbers.val($numbers.val().split(',').concat(diff).join());

          $number.text(diff || 0);
          $diff.val('');
          $diff.focus();
          $questionBody.find('#next').prop('disabled', true);

          if(i >= 4) {
            $questionBody.find('#equation').hide();
            $questionBody.find('#next').hide();
            showSubmit(function(){ return validate($questionBody) });
          }
        });
      },
      validate: function($questionBody) {
        var $diff = $questionBody.find('#diff');

        return $diff[0].validity.valid
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
      question: 'Write the following time in 24H format:',
      template: function(){
        var parts = [
          '<input id="time" type="hidden"/>',
          '<div id="timeString"/>',
          '<input id="hours" type="number" required min="0" max="59"/> : <input id="minutes" type="number" required min="0" max="59"/>'
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
      validate: function($questionBody) {
        var $hours = $questionBody.find('#hours');
        var $minutes = $questionBody.find('#minutes');

        return $hours[0].validity.valid && $minutes[0].validity.valid
      },
      result: function($questionBody) {
        var $time = $questionBody.find('#time');
        var $hours = $questionBody.find('#hours');
        var $minutes = $questionBody.find('#minutes');

        return {
          time: $time.val(),
          hours: $hours.val(),
          minutes: $minutes.val()
        };
      }
    },
    {
      question: 'Move the hands of the clock to the given time: ',
      template: function() {
        // http://www.3quarks.com/en/SVGClock/#source
        return [
          '<input id="time" type="hidden"/>',
          '<div id="timeDisplay"></div>',
          '<svg id="clock" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" version="1.1" baseProfile="full" width="200px" height="200px" viewBox="0 0 200 200" hola_ext_inject="disabled">' +
              '<defs>' +
              '<!-- three hour stroke (DIN 41091.1) -->' +
              '<symbol id="threeHourStroke">' +
              '<line x1="100" y1="0" x2="100" y2="30" style="stroke:#333; stroke-width:8.4; stroke-linecap:butt"/>' +
              '</symbol>' +
              '<!-- hour stroke (DIN 41091.1) -->' +
              '<symbol id="hourStroke">' +
              '<line x1="100" y1="0" x2="100" y2="24" style="stroke:#333; stroke-width:8.4; stroke-linecap:butt"/>' +
              '</symbol>' +
              '<!-- minute stroke (DIN 41091.1) -->' +
              '<symbol id="minuteStroke">' +
              '<line x1="100" y1="0" x2="100" y2="8" style="stroke:#333; stroke-width:3.6; stroke-linecap:butt"/>' +
              '</symbol>' +
              '<!-- quarter strokes -->' +
              '<symbol id="quarterStrokes">' +
              '<use xlink:href="#threeHourStroke"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate( 6, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(12, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(18, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(24, 100, 100)"/>' +
              '<use xlink:href="#hourStroke" transform="rotate(30, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(36, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(42, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(48, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(54, 100, 100)"/>' +
              '<use xlink:href="#hourStroke" transform="rotate(60, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(66, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(72, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(78, 100, 100)"/>' +
              '<use xlink:href="#minuteStroke" transform="rotate(84, 100, 100)"/>' +
              '</symbol>' +
              '<!-- visible dial circle -->' +
              '<clipPath id="dialCircle">' +
              '<circle cx="100" cy="100" r="100"/>' +
              '</clipPath>' +
              '</defs>' +
              '<g id="link">' +
              '<circle cx="100" cy="100" r="100" style="fill:#ffffff; stroke:none"/>' +
              '</g>' +
              '<!-- dial -->' +
              '<g clip-path="url(#dialCircle)">' +
              '<use xlink:href="#quarterStrokes"/>' +
              '<use xlink:href="#quarterStrokes" transform="rotate( 90, 100, 100)"/>' +
              '<use xlink:href="#quarterStrokes" transform="rotate(180, 100, 100)"/>' +
              '<use xlink:href="#quarterStrokes" transform="rotate(270, 100, 100)"/>' +
              '</g>' +
              '<!-- minute hand -->' +
              '<g id="minuteHand" visibility="visible" transform="rotate(0, 100, 100)">' +
              '<polygon points="95.5,11.5 100,7 104.5,11.5 104.5,122 95.5,122" style="fill:#222; stroke:none"/>' +
              '</g>' +
              '<!-- hour hand -->' +
              '<g id="hourHand" visibility="visible" transform="rotate(0, 100, 100)">' +
              '<polygon points="94,46 100,40 106,46 106,118 94,118" style="fill:#222; stroke:none"/>' +
              '</g>' +
              '<g xmlns="http://www.w3.org/2000/svg" id="axisCover" style="fill:#222">' +
              '<circle id="axisCoverCircle" cx="100" cy="100" r="7" style="stroke:none"/>' +
              '</g>' +
              '</svg>'
        ];
      },
      logic: function($questionBody) {
        var hours = 1 + Math.floor(Math.random()*12);
        var ampm;
        if((Math.random() - .5) > 0)
          ampm = 'AM';
        else
          ampm = 'PM';
        var minutes = Math.floor(Math.random()*60);
        if(String(minutes).length < 2)
          minutes = '0' + minutes;

        $questionBody.find('#timeDisplay').text(hours+':'+minutes+' '+ampm);
        $questionBody.find('#time').val([hours,minutes,ampm]);

        var origin = $('#axisCoverCircle').offset();
        var minLastAngle = 0;
        var hourLastAngle = 0;

        $questionBody.find('#minuteHand').on('mousedown', function(event) {
          var startPos = { left: event.pageX, top: event.pageY };
          var $body = $('body');

          $body.one('mouseup', function(event) {
            $('body').off('mousemove.min');

            var currentPos = { left: event.pageX, top: event.pageY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += minLastAngle;
            minLastAngle = angle;
          });

          $body.on('mousemove.min', function(event) {
            var currentPos = { left: event.pageX, top: event.pageY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += minLastAngle;
            angle = angle * 360 / (2*Math.PI);
            $questionBody.find('#minuteHand').attr('transform', 'rotate('+angle+', 100, 100)');
          });
        });

        $questionBody.find('#hourHand').on('mousedown', function() {
          var startPos = { left: event.pageX, top: event.pageY };
          var $body = $('body');

          $body.one('mouseup', function(event) {
            $('body').off('mousemove.hour');

            var currentPos = { left: event.pageX, top: event.pageY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += hourLastAngle;
            hourLastAngle = angle;
          });

          $body.on('mousemove.hour', function(event) {
            var currentPos = { left: event.pageX, top: event.pageY };
            var angle = Math.atan2(currentPos.top - origin.top, currentPos.left - origin.left);
            angle -= Math.atan2(startPos.top - origin.top, startPos.left - origin.left);
            angle += hourLastAngle;
            angle = angle * 360 / (2*Math.PI);
            $questionBody.find('#hourHand').attr('transform', 'rotate('+angle+', 100, 100)');
          });
        });
      },
      result: function($questionBody) {
        var $time = $questionBody.find('#time');
        var $hourHand = $questionBody.find('#hourHand');
        var $minuteHand = $questionBody.find('#minuteHand');

        var hourHand = parseInt($hourHand.attr('transform').match(/rotate\((-?\d+(?:.\d+)?), 100, 100\)/)[1], 10);
        var minuteHand = parseInt($minuteHand.attr('transform').match(/rotate\((-?\d+(?:.\d+)?), 100, 100\)/)[1], 10);

        if(hourHand < 0)
          hourHand += 360;

        if(minuteHand < 0)
          minuteHand += 360;

        return {
          time: $time.val(),
          hourHand: hourHand / 30,
          minuteHand: minuteHand / 6
        };
      }
    }
  ];

  $(function() {
    $('.back').click(function() {
      window.location = '/';
    });

    showQuestion(currentQuestion);
  });

  function showSubmit(validate) {
    $('.submit').show();
    if($.isFunction(validate))
      $('.submit').prop('disabled', !validate());
    else
      $('.submit').prop('disabled', false);
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

    $questionBody.find('input:eq(0)').focus();

    if($.isFunction(question.validate)) {
      $('.submit').prop('disabled', !question.validate($questionBody));
      $questionBody.find('input, select').on('input', function() {
        $('.submit').prop('disabled', !question.validate($questionBody));
      });
    } else {
      $('.submit').prop('disabled', false);
    }

    $('.submit').one('click', function() {
      if(question.result)
        answers.push(question.result($questionBody));

      if(++currentQuestion < questions.length) {
        if(currentQuestion == questions.length - 1)
          $('.submit').text('Finish');
        showQuestion(currentQuestion);
      } else {
        $questionTitle.text('Finished!');
        hideSubmit();
        $questionBody.text('Saving Exam');

        $.ajax({
          url: '/exam',
          method: 'post',
          contentType: 'application/json',
          data: JSON.stringify(answers),
          dataType: 'json'
        }).done(function(data) {
          $questionBody.text('Result: '+ JSON.stringify(data));
        }).error(function(err) {
          $questionBody.text('Error: '+ err);
        }).always(function() {
          $('.back').show();
        });
      }
    });
  }
})();
