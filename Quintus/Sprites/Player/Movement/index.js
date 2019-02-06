
// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites, Anim, Input")
                 .setup({width: 800, height: 480})
                 .controls();

// w: 31, h:32, left: 89, top: 166, right: 120, bottom: 198
var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
var playerUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/EXL-BR2-sizes.gif";

var playerJsonUrl = "https://api.myjson.com/bins/41gei";
Q.Sprite.extend("Player", {
  init: function(player){    
    this._super(player, {
      //asset: playerUrl,
      sprite: "player",
      sheet: "player",
      x: Q.el.width / 2,
      y: Q.el.height / 2,
      type: Q.SPRITE_FRIENDLY,
      speed: 10
    });
    
    this.add("animation");
    this.play("default");
  },
  step: function(dt){
    if (Q.inputs['left']){
      this.p.x -= this.p.speed;
    }else if (Q.inputs['right']){
       this.p.x += this.p.speed;
    }
    
    if (Q.inputs['up']){
       this.p.y -= this.p.speed;
    }else if (Q.inputs['down']){
      this.p.y += this.p.speed;
    } 
  }
});

Q.load([backgroundUrl, playerUrl, playerJsonUrl], function(){  
  var background = new Q.Sprite({ asset: backgroundUrl, 
                                  x: Q.el.width / 2, 
                                  y: Q.el.height / 2, 
                                  type: Q.SPRITE_NONE});
  Q.sheet("player", playerUrl,
          {
            tilew: 29.5,  // Each tile is 31 pixels; however, I use 29.5 pixels to make it work. I need to find out why.
            tileh: 32,    // and 32 pixels tall
            sx: 89,       // start the sprites at x = 89
            sy: 166,      // and y = 166  
            w: 238,
            h: 206
           });

  Q.compileSheets(playerUrl, playerJsonUrl);
  Q.animations("player", { default: { frames: [0, 1, 2, 3], rate: 1/4 } }); 
  var player = new Q.Player();
  
  Q.gameLoop(function(dt){
    Q.clear();
    background.render(Q.ctx); 
    //player.play("default"); // You can use play here too.
    player.update(dt);
    player.render(Q.ctx); 
  });
});

