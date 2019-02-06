// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites")
                 .setup({width: 800, height: 480});

var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
Q.load([backgroundUrl], function(){  
    var options = { 
      asset: backgroundUrl, 
      x: Q.el.width / 2, 
      y: Q.el.height / 2, 
      type: Q.SPRITE_NONE
    };
    var background = new Q.Sprite(options);
  Q.gameLoop(function(dt){
    Q.clear();
    background.render(Q.ctx);    
  });
});

