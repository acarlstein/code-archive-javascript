// 

/**
 * [ Design Patterns: Chain of Responsibility ]
 * Original Source: http://www.dofactory.com/javascript/chain-of-responsibility-design-pattern\
 */

// Module Pattern: log helper 
var log = (function() {
    // Private 
    var log = "";
  
    // Public API
    return {
      add: function(msg) { 
        log += msg + "<BR>\n"; 
      }, show: function() { 
        console.log(log); 
        document.getElementById("result").innerHTML = log;
        log = ""; 
      }
    }
  })();
  
  // Chain of Responsibility Pattern
  var ATM = function(amount) {
      this.amount = amount;
      log.add("[Account: $" + amount + "]\n");
  }
   
  ATM.prototype = {
    
      deposit: function(bill){
        log.add("Deposit: $" + bill);   
        this.amount += bill;
        return this;
      }
    
      , balance: function(){
        log.add("Balance: $" + this.amount);      
        return this;
      }
    
      , get: function(bill) {
          var count = Math.floor(this.amount / bill);
          this.amount -= count * bill;
          log.add("Dispense: " + count + " bills of $" + bill + " bills");
          return this;
      }
    
  }
   
  function run() {
    console.log("run()");
    
    var atm = new ATM(378);
    
    atm.get(100);
    atm.balance();
    
    // These two lines do the same thing
    atm.deposit(200).balance();
    // atm['deposit'](200)['balance']();
   
    atm.get(100).get(50).get(20).get(10).get(5).get(1);
   
    log.show();
  }
  
  