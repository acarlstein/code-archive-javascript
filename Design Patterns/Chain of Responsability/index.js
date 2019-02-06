document.getElementById("container").innerHTML += "<p>Welcome!</p>";

var jLite = function(id){
  console.log("jLite()");
  this.container = document.getElementById(id);
};

jLite.prototype = {
 
  insertParagraph: function(text){
    console.log("insertParagraph()");
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    this.container.appendChild(p);
    return this;
  }
  
  , border: function(style){
    this.container.style["border"] = style;
    return this;
  }
  
  , background: function(color){
    this.container.style["background-color"] = color;
    return this;
  }
  
}  

function run(){  
  console.log("run()");
  var jdiv = new jLite("container");
  jdiv.insertParagraph("Thank you!")
      .border("2px solid black")
      .insertParagraph("You're welcome!")
      .background("gray");     
}
