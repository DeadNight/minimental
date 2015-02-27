/**
 * Created by nirleibo on 2/27/15.
 */

var express = require('express');
var router = express.Router();

/* GET exam page. */
router.get('/', function(req, res, next) {
  res.render('exam', {
    page: 'exam',
    title: 'Mini-Mental Exam',
    scripts: [
      'bower_components/underscore/underscore-min.js',
      'bower_components/moment/min/moment.min.js',
      'scripts/number_to_string.js',
      'scripts/exam.js'
    ],
    stylesheets: ['/style/exam.css']
  })
});

router.post('/', function(req, res, next) {
  var answers = req.body;
  var score = [];

  // Question #1
  var q = 0;
  var question1 = answers[q];
  score[q] = 0;

  if(question1.day) {
    if(question1.day == question1.date.day) {
      score[q] += 1;
    } else if(Math.abs(question1.day - question1.date.day) <= 1) {
      score[q] += 0.5;
    }
  }

  if(question1.month) {
    if(question1.month == question1.date.month) {
      score[q] += 1;
    } else if(Math.abs(question1.month - question1.date.month) <= 1) {
      score[q] += 0.5;
    }
  }

  if(question1.year) {
    if(question1.year == question1.date.year) {
      score[q] += 1;
    } else if(Math.abs(question1.year - question1.date.year) <= 1) {
      score[q] += 0.5;
    }
  }

  if(question1.season) {
    if((question1.season.toLowerCase() == 'spring' && question1.date.month in [3, 4])
        || (question1.season.toLowerCase() == 'summer' && question1.date.month in [5, 6, 7, 8])
        || (question1.season.toLowerCase() == 'fall' && question1.date.month in [9, 10])
        || (question1.season.toLowerCase() == 'winter' && question1.date.month in [11, 12, 1, 2])) {
      score[q] += 1;
    }
  }

  // Question #2
  var q = 1;
  var question2 = answers[q];
  score[q] = 0;

  var city = 'rishon lezion';
  if(question2.city.toLowerCase() == city) {
    score[q] += 1;
  } else {
    var mistakes = {
      i: ['ea', 'ee', 'y'],
      o: ['oo'],
      le: ['l'],
      z: ['ts', 'tz']
    };

    if(spellingMistake(question2.city, city, mistakes)) {
      score[q] += 0.5;
    }
  }

  var country = 'israel';
  if(question2.country.toLowerCase() == country) {
    score[q] += 1;
  } else {
    var mistakes = {
      ae: ['ea'],
      s: ['z'],
      el: ['le']
    };

    if(spellingMistake(question2.country, country, mistakes)) {
      score[q] += 0.5;
    }
  }

  var floor = 0;
  if(question2.floor) {
    if(question2.floor == floor) {
      score[q] += 1;
    } else if(Math.abs(question2.floor - floor) <= 1) {
      score[q] += 0.5;
    }
  }

  // Question 4
  var q = 2;
  var question4 = answers[q];
  score[q] = 0;

  var synonyms = {
    car: 'auto',
    flower: 'rose'
  };

  var mistakes = {
    bag: {
      a: ['e']
    },
    car: {
      a: ['u']
    },
    auto: {
      u: ['o'],
      t: ['tt'],
      au: ['o']
    },
    drum: {
      u: ['a']
    },
    flower: {
      o: ['a'],
      owe: ['ou']
    },
    rose: {
      s: ['z'],
      se: ['es', 'ez']
    },
    balloon: {
      a: ['u'],
      ll: ['l'],
      oo: ['o', 'u']
    },
    key: {
      k: ['c'],
      ey: ['ea', 'ee', 'i', 'ei']
    },
    pig: {
      i: ['ea', 'ee', 'y']
    },
    ring: {
      i: ['ea', 'ee', 'y']
    },
    shoe: {
      oe: ['oo', 'u', 'o']
    },
    well: {
      e: ['a'],
      ll: ['l']
    }
  };

  for(var w in question4.words) {
    if(!question4.words[w])
      continue;
    var word = question4.words[w].toLowerCase().replace(/s$/, '');
    var image = question4.images[w];
    console.log(word, image);
    if(word == image) {
      score[q] += 1;
    } else if(spellingMistake(word, image, mistakes[image])) {
      score[q] += 0.5;
    } else if(image in synonyms) {
      var image = synonyms[image];
      if(word == image) {
        score[q] += 1;
      } else if(spellingMistake(word, image, mistakes[image])) {
        score[q] += 0.5;
      }
    }
  }

  res.json({score: score});
});

function spellingMistake(input, actual, mistakes) {
  for(var m in mistakes) {
    var mistake = mistakes[m];
    console.log(input.toLowerCase().replace(RegExp('('+ mistake.join('|') +')'), m));
    if(input.toLowerCase().replace(RegExp('('+ mistake.join('|') +')', 'g'), m) == actual) {
      return true;
      break;
    }
  }
  return false;
}

module.exports = router;
