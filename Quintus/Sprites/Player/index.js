
// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites")
                 .setup({width: 800, height: 480});

var shipUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/Spaceship_tut.png";

Q.Sprite.extend("Player", {
  init: function(player){    
    this._super(player, {
      //assetUrl: shipUrl,
      asset: shipUrl,
      x: Q.el.width / 2,
      y: Q.el.height / 2,
      type: Q.SPRITE_FRIENDLY,
      speed: 10
    });
  }
});

var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
Q.load([backgroundUrl, shipUrl], function(){  
  var background = new Q.Sprite({ asset: backgroundUrl, 
                                  x: Q.el.width / 2, 
                                  y: Q.el.height / 2, 
                                  type: Q.SPRITE_NONE});
  var player = new Q.Player();
  Q.gameLoop(function(dt){
    Q.clear();
    background.render(Q.ctx);    
    player.render(Q.ctx);
  });
});

