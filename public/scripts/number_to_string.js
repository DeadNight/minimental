// number to string, pluginized from http://stackoverflow.com/questions/5529934/javascript-numbers-to-words

window.num2str = function (num) {
  return window.num2str.convert(num);
}

window.num2str.ones=['','one','two','three','four','five','six','seven','eight','nine'];
window.num2str.tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
window.num2str.teens=['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];

window.num2str.convert_millions = function(num) {
  var varies = [1000000, " million ", window.num2str.convert_thousands]
  if (num >= varies[0]) {
    return this.convert_millions(Math.floor(num / varies[0])) + varies[1] + varies[2](num % varies[0]);
  }
  else {
    return varies[2](num);
  }
}

window.num2str.convert_thousands = function(num) {
  var varies = [1000, " thousand ", window.num2str.convert_hundreds]
  if (num >= varies[0]) {
    return this.convert_hundreds(Math.floor(num / varies[0])) + varies[1] + varies[2](num % varies[0]);
  }
  else {
    return varies[2](num);
  }
}

window.num2str.convert_hundreds = function(num) {
  var varies = [100, " hundred ", window.num2str.convert_tens]
  if (num >= varies[0]) {
    return this.ones[Math.floor(num / varies[0])] + varies[1] + varies[2](num % varies[0]);
  }
  else {
    return varies[2](num);
  }
}

window.num2str.convert_tens = function(num) {
  var varies = [10, " "]
  if (num < 10) return window.num2str.ones[num];
  else if (num >= 10 && num < 20) return window.num2str.teens[num - 10];
  else {
    return window.num2str.tens[Math.floor(num / 10)] + " " + window.num2str.ones[num % 10];
  }
}

window.num2str.convert = function(num) {
  if (num == 0) return "zero";
  else return this.convert_millions(num);
}