
/*
* Class: Calc the first 10000 prime numbers
*/
var Performance = function() {
  this.start = 1;
  this.amount = 10000;

  this.numbers = [];
  this.elapsedtime = 0;

  this._amount = null;
  this._elapsedtime = null;
  this._testResult = null;

  this.init = function(start, amount) {
    this.start = start || 1;
    this.amount = amount || 10000;

    this.numbers = [];
    this.elapsedtime = 0;

    this._amount = $('#amount');
    this._elapsedtime = $('#elapsedtime');
    this._testResult = $('#testResult');
    this.updateUI();

    this.tooglePanel();
  };

  this.updateUI = function() {
    this._amount.html(this.amount);
    this._elapsedtime.html(this.elapsedtime);
  };

  this.tooglePanel = function() {
    val = $("#showPerformanceTest").prop('checked');
    if (val) {
      $("#performance-area").removeClass("hidden");
    } else {
      $("#performance-area").addClass("hidden");
    }
  };

  this.startTest = function() {
      this.clearTest();

      var num = parseInt(this.start);
      var limit = parseInt(this.amount);

      var starttime = new Date().getTime();
      for(var i = 1; i <= limit; i++) {

          num = this.nextPrimeNumber(num);
          this.numbers.unshift(num);

          //this.insertNumber(num);

          num = num + 1;
      }

      for (var i = 0; i < this.numbers.length; i++) {
        this.insertNumber(this.numbers[i]);
      }

      this.elapsedtime = new Date().getTime() - starttime;
      this.updateUI();
  };

  this.nextPrimeNumber = function(num) {
      var result = false;
      while (!result) {
          result = this.isPrime(num);
          if (!result) {
              num = num + 1;
          }
      }
      return num;
  };

  this.isPrime = function(num) {
      for(var i = 2; i < num; i++)
          if(num % i === 0) return false;
      return num !== 1;
  };

  this.clearTest = function() {
      this.numbers.splice(0, this.numbers.length);
      this._testResult.html("");
      this.elapsedtime = 0;
      this.updateUI();
  };

  this.insertNumber = function(number) {
    var tag = "<div class='badge prime'>" + number + "</div>";
    this._testResult.append(tag);
  };

};
