/**
* Libraries loaded:
* -> https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
* -> http://cdn.html5quintus.com/v0.2.0/quintus-all.js
* -> https://cdn.rawgit.com/cykod/Quintus/master/lib/quintus_scenes.js
* Note: To turn text js into cdn go to https://rawgit.com/
*/

// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites, Anim, Input, Scenes, Touch")
                 .setup({width: 800, height: 480})                 
                 .touch();

Q.input.touchControls({
  controls: [
    ['left', '<'],
    ['right', '>'],
    [],
    [],
    [],
    [],
    ['fire', 'a'],  
  ]
});
Q.controls();

// Manually adding in the joypad
// Q.input.joypadControls();

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
    
    this.p.x = clamp(this.p.x, 0 + (this.p.w / 2), Q.el.width - (this.p.w / 2));
  }
});

var clamp = function(value, min, max){
  return value < min ? min : (value > max ? max : value);
}

Q.Sprite.extend("Shot", {
  init: function(player){
    this._super(player, {
        sprite: "shot",
        sheet: "shot",
        speed: 200
    });
    this.add("animation");
    this.play("default");
  }  
});

Q.scene("mainLevel", function(stage) {
  console.log("Creating scene");
  var background = new Q.Sprite({ asset: backgroundUrl, 
                                 x: Q.el.width / 2, 
                                 y: Q.el.height / 2, 
                                 type: Q.SPRITE_NONE});
  stage.insert(background);
 
  var player = new Q.Player();
  stage.insert(player);
  
  var shot = new Q.Shot({x: 100, y: 100});
  stage.insert(shot);
});

var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
var playerUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/EXL-BR2-sizes.gif";
var shotUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/M484BulletCollection1.png";

Q.load([backgroundUrl, playerUrl, shotUrl], function(){  
  Q.sheet("player", playerUrl,
          {
            tilew: 29.5,  // Each tile is 31 pixels; however, I use 29.5 pixels to make it work. I need to find out why.
            tileh: 32,    // and 32 pixels tall
            sx: 89,       // start the sprites at x = 89
            sy: 166,      // and y = 166  
            w: 238,
            h: 206
           });

  Q.sheet("shot", shotUrl,{
            tilew: 15,  
            tileh: 11,    
            sx: 173,       
            sy: 142,      
            w: 520,
            h: 361
  });
  
  Q.animations("player", { default: { frames: [0, 1, 2, 3], rate: 1/4 } }); 
  Q.animations("shot", { default: { frames: [0, 1, 2, 3, 4, 5, 6], rate: 1/4 } }); 
  Q.stageScene("mainLevel");
});

