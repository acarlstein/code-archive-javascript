// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites")
                 .setup({width: 800, height: 480});

Q.load([], function(){  
  Q.gameLoop(function(dt){
    // Magic goes here
  });
});

