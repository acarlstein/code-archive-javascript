/*
  Author and source code: http://www.dofactory.com/javascript/state-design-pattern
  Modified by: Alejandro Carlstein

  Below is an example on how to implement the state pattern in javascript for educational purposes.
*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  var TrafficLight = function(){
    var currentState = new Red(this);  
    this.change = function(state){    
      sleep(1000).then(() => {
        $(".circle").removeClass("lighten");
        currentState = state;     
        currentState.go();      
      });
    };
    
    this.start = function () {
      currentState.go();
    };;
  };
  
  var Red = function(light){
    this.light = light; 
    this.go = function(){  
      $(".red").toggleClass("lighten");
      light.change(new Green(light));
    };
  };
  
  var Green = function(light){
    this.light = light;
    this.name = "green";
    this.go = function(){    
      $(".green").toggleClass("lighten");
      light.change(new Yellow(light));
    };
  };
  
  var Yellow = function(light){
    this.light = light;
    this.name = "yellow";
    this.go = function(){
      $(".yellow").toggleClass("lighten");
      light.change(new Red(light));
    };
  };
  
  function run() {
      var light = new TrafficLight();
      light.start();   
  }
  
  (function() {
    run();
  })();
  
  