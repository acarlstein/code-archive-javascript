/**
* Libraries loaded:
* -> https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
* -> http://cdn.html5quintus.com/v0.2.0/quintus-all.js
* -> https://cdn.rawgit.com/cykod/Quintus/master/lib/quintus_scenes.js
* Note: To turn text js into cdn go to https://rawgit.com/
* Warning: If one of the sources for the resources (such the images being used), it stop existing or it is not available, this code will not work.
*/

var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
var player1WalkUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/p1_walk.png";
var player2WalkUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/p2_walk.png";
var resourcesUrlList = [backgroundUrl, player1WalkUrl, player2WalkUrl];

// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites, Anim, UI, 2D, Input, Scenes, Touch")
                 .setup({width: 800, height: 480})  
                 .controls();

Q.Sprite.extend("Background", {
  init: function(background){
    this._super(background, { 
      asset: backgroundUrl, 
      x: Q.el.width / 2, 
      y: Q.el.height / 2, 
      collisionLayer: 0,
      z: 0,
      type: Q.SPRITE_NONE
    });
  }
});

Q.Sprite.extend("Player1", {
  init: function(player){
    this._super(player, { 
      sprite: "player1", 
      sheet: "player1", 
      speed: 50,
      z: 1,
      type: Q.SPRITE_FRIENDLY
    });
    this.p.x = this.p.w;
    this.p.y = (Q.el.height / 2) - this.p.h;
    this.add("animation");
    this.play("default");
    this.on("hit", "collision");
  },
  "step" : function(dt){
    this.p.x += this.p.speed * dt;
    this.stage.collide(this);
  }, 
  "collision" : function(col){
    console.log(col.obj);
    if (col.obj.isA("Player2")){
      col.obj.destroy();
      this.destroy();
      Q.clearStages();
      Q.stageScene("level1");
    }
  }
});

Q.Sprite.extend("Player2", {
  init: function(player){
    this._super(player, { 
      sprite: "player2", 
      sheet: "player2", 
      speed: 50,
      flip: "x",
      z: 1,
      type: Q.SPRITE_ENEMY
    });
    this.p.x = Q.el.width - this.p.w;
    this.p.y = (Q.el.height / 2) - this.p.h;
    this.add("animation");
    this.play("default");
  },
  "step" : function(dt){
    this.p.x -= this.p.speed * dt;
  }
});

Q.scene("level1", function(stage){
  stage.insert(new Q.Background());
  //stage.insert(new Q.Repeater({asset: backgroundUrl}));
  //stage.collisionLayer(new Q.Background());
  //stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(255,0,0,1)"}));
  //stage.insert(new Q.Sprite({asset: backgroundUrl}));
  //stage.insert(new Q.Repeater({asset: backgroundUrl, speedX: 0, x: 0, y: 0, z: 0}));
  
  stage.insert(new Q.Player1());
  stage.insert(new Q.Player2());
});

var playerSheet = {
    tilew: 66, tileh: 92,    
    sx: 0, sy: 0,      
    w: 256, h: 512
};

var playerAnimationFrame = {
  default: {
    frames: [0, 1, 2, 4],
    rate: 1/4
  }
};

Q.load(resourcesUrlList, function(){  
  Q.sheet("player1", player1WalkUrl, playerSheet);
  Q.sheet("player2", player2WalkUrl, playerSheet);
  Q.animations("player1", playerAnimationFrame);
  Q.animations("player2", playerAnimationFrame);
  Q.clearStages();
  Q.stageScene("level1");
});

