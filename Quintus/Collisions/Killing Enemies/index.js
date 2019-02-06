/**
* Libraries loaded:
* -> https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
* -> http://cdn.html5quintus.com/v0.2.0/quintus-all.js
* -> https://cdn.rawgit.com/cykod/Quintus/master/lib/quintus_scenes.js
* Note: To turn text js into cdn go to https://rawgit.com/
* Warning: If one of the sources for the resources (such the images being used), it stop existing or it is not available, this code will not work.
*/

var backgroundUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/bg5.jpg";
var playerUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/EXL-BR2-sizes.gif";
var shotUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/M484BulletCollection1.png";
var alienUrl = "http://www.elblender.com/wordpress/wp-content/uploads/2016/11/spaceship.png";
var resourcesUrlList = [backgroundUrl, playerUrl, shotUrl, alienUrl];

// Include Sprite module and set game's canvas size
var Q = Quintus().include("Sprites, Anim, 2D, Input, Scenes, Touch")
                 .setup({width: 800, height: 480})                 
                 .touch()
                 .controls();

Q.Sprite.extend("Player", {
  init: function(player){    
    this._super(player, {      
      sprite: "player",
      sheet: "player",
      x: Q.el.width / 2,
      type: Q.SPRITE_FRIENDLY,
      collisionMask: SPRITE_SHOT,
      speed: 10
    });
    this.p.y = Q.el.height - this.p.h;
    this.add("animation");
    this.play("default");
    this.add("Gun");
    this.on("hit", "hit");
    this.on("hit.sprite", "hitSprite");
  },
  step: function(dt){
    this.stage.collide(this);
    if (Q.inputs['left']){
      this.p.x -= this.p.speed;
    }else if (Q.inputs['right']){
       this.p.x += this.p.speed;
    }    
    this.p.x = clamp(this.p.x, 0 + (this.p.w / 2), Q.el.width - (this.p.w / 2));
  },
  hit: function(col){
    //console.log(col.obj.isA("Sprite"));
    console.log("hit");
    console.log(col.obj);
  },
  hitSprite: function(col){
    console.log("hit.sprite");
    console.log(col.obj);
  }
});

var clamp = function(value, min, max){
  return value < min ? min : (value > max ? max : value);
}

var SPRITE_SHOT = 64;
Q.Sprite.extend("Shot", {
  init: function(player){
    this._super(player, {
        sprite: "shot",
        sheet: "shot",
        speed: 200,
        type: SPRITE_SHOT
    });
    this.add("animation");
    this.play("default");
  },
  step: function(dt){
    this.p.y -= this.p.speed * dt;
    if (this.p.y > Q.el.height || this.p.y < -10){
      this.destroy();
    }
  }
});

Q.component("Gun", {
  added: function(){
    this.entity.p.shots=[];
    this.entity.p.canFire = true;
    this.entity.on("step", "handleFiring");
  },
  extend: {
    handleFiring: function(dt){
      var entity = this;
      for (var i = entity.p.shots.length - 1; i >= 0; --i){
        if(entity.p.shots[i].isDestroyed){
          entity.p.shots.splice(i, 1);  // Removed shot!
        }
      }
      if (Q.inputs['fire']
         && entity.p.type == Q.SPRITE_FRIENDLY){        
        entity.fire(Q.SPRITE_FRIENDLY);          
      }
             
    },
    fire: function(){  
      var chance = Math.floor(Math.random() * 101);
      
      if (Q.inputs['fire'] || chance < 50){        
        var entity = this;
        if (!entity.p.canFire) return;
        
        var friendlyShotSetting = {x: entity.p.x, 
                                   y: entity.p.y - 50,
                                   speed: 200,
                                   type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY};

        var enemyShotSetting = {x: entity.p.x, 
                                 y: entity.p.y + entity.p.h,
                                 speed: -200,
                                 type: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY};

        var shotSetting = (entity.p.type == Q.SPRITE_FRIENDLY) ? friendlyShotSetting : enemyShotSetting; 
        var shot = Q.stage().insert(new Q.Shot(shotSetting));
        entity.p.shots.push(shot);
        entity.p.canFire = false;
        setTimeout(function(){
          entity.p.canFire = true;
        }, 500);
      }
    }
  }
});

Q.Sprite.extend("Alien", {
  init: function(player){
    this._super(player, {
      sprite: "alien",
      sheet: "alien",
      x: Q.el.width / 2,
      type: Q.SPRITE_ENEMY,
      speed: 200
    });
    //this.p.x = clamp(this.p.x, 0 + (this.p.w / 2), Q.el.width - (this.p.w / 2));
    this.p.y = this.p.h;
    this.add("animation");
    this.play("default");
    this.add("AIBasic"); //Uncomment 
  }
});

Q.component("AIBasic", {
  added: function(){
    this.entity.changeDirections();
    this.entity.on("step", "move");
    this.entity.on("step", "tryToFire");
    this.entity.add("Gun");
  },
  extend: {
    changeDirections: function(){
      var entity = this;
      //var numberOfSeconds = Math.floor(Math.random() * 6) + 1;
      var numberOfSeconds = Math.floor(seededRandom() * 4) + 1;
      var numberOfMilliSeconds =  numberOfSeconds * 1000; 
      setTimeout(function(){
        entity.p.speed = -entity.p.speed;
        entity.changeDirections();
      }, numberOfMilliSeconds);
    },
    move: function(dt){
      var entity = this;
      entity.p.x -= entity.p.speed * dt;
      if (entity.p.x < 0 + (entity.p.w / 2) 
         || entity.p.x > Q.el.width - (entity.p.w/2)){
        entity.p.speed = -entity.p.speed;
      }
    },
    tryToFire: function(){
      var entity = this;      
      var player = Q("Player").first();
      if (!player) return;      
      if (player.p.x + player.p.w > entity.p.x 
         && player.p.x - player.p.w < entity.p.x){
        this.fire(Q.SPRITE_ENEMY);
      }
    }
  }
});

// Better Random function that allows seeding.
function seededRandom(){ 
  var seed = Math.random() * Math.PI * 2;
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

Q.scene("mainLevel", function(stage) {  
    
  var background = new Q.Sprite({ asset: backgroundUrl, 
                                 x: Q.el.width / 2, 
                                 y: Q.el.height / 2, 
                                 layerIndex: 0,
                                 type: Q.SPRITE_NONE});
  stage.insert(background);
 
  var player = new Q.Player();

  stage.insert(player);
  
  stage.insert(new Q.Shot());
  
  stage.insert(new Q.Alien());
 
});

var defaultAnimationFrame =  { 
  default: { 
    frames: [0, 1, 2, 3], 
    rate: 1/4 
  } 
};

//Q.preload(resourcesUrlList);

Q.load(resourcesUrlList, function(){  
   
  Q.sheet("player", playerUrl,{
    tilew: 29.5,  // Each tile is 31 pixels; however, I use 29.5 pixels to make it work. I need to find out why.
    tileh: 32,    // and 32 pixels tall
    sx: 89,       // start the sprites at x = 89
    sy: 166,      // and y = 166  
    w: 238,
    h: 206
  });
  
  Q.sheet("shot", shotUrl,{
            tilew: 11,  
            tileh: 11,    
            sx: 173,       
            sy: 142,      
            w: 520,
            h: 361
  });
    
  Q.sheet("alien", alienUrl,{
            tilew: 50,  
            tileh: 25,    
            sx: 50,       
            sy: 30,      
            w: 250,
            h: 55
  });  
  
  Q.clear();
  
  Q.animations("player", defaultAnimationFrame);  
  Q.animations("shot",  { 
  default: { 
    frames: [0], 
    rate: 1/4 
  } 
}); 
  Q.animations("alien", defaultAnimationFrame);   
  
  Q.clearStages();
  Q.stageScene("mainLevel");
    
});

