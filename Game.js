BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

  create: function () {
    var bg = this.game.add.sprite(0, this.game.height, "ground");
    this.numEnemies = 5;
    bg.position.y -= bg.height;
    this.p = this.game.add.group();
    this.player = this.p.create(this.game.width/2, this.game.height/2, "player");
    this.player.anchor.set(0.5, 0.5);
    this.player.leftRight = "right";
    this.player.accreditations = 3;

    this.game.physics.arcade.enable(this.p);
    this.e = this.game.add.group();
    for (var i = 0; i < this.numEnemies; i++) {
      this.spawnEnemy();
    }
    this.game.physics.arcade.enable(this.e);

    window.setInterval(function() {
      this.e.forEach(function(e) {
        this.game.physics.arcade.moveToObject(e, this.player, 50);
      }.bind(this));
    }.bind(this), 1000);

    this.initCtls();
  },

  initCtls: function() {
    var keyMap = {
      "j": 74,
      "i": 73,
      "o": 79,
      "l": 76,
      ",": 188,
      "m": 77
    };

    var maxvel = 70;
    var keyVels = {
      "j": new Phaser.Point(maxvel, 0),
      "i": new Phaser.Point(maxvel*0.2, maxvel*0.9),
      "o": new Phaser.Point(-maxvel*0.5, maxvel*0.7),
      "l": new Phaser.Point(-maxvel, 0),
      ",": new Phaser.Point(-maxvel*0.2, -maxvel*0.9),
      "m": new Phaser.Point(maxvel*0.5, -maxvel*0.7)
    };
    this.ctl = {};
    var atkKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    atkKey.onDown.add(this.attack.bind(this));

    for (var key in keyMap) {
      if (keyMap.hasOwnProperty(key)) {
        this.ctl[key] = this.game.input.keyboard.addKey(keyMap[key]);

        this.ctl[key].onUp.add(function(key) {
          this.player.body.velocity = new Phaser.Point(0, 0);
        }.bind(this, key));

        this.ctl[key].onHoldCallback = function(key) {
          this.player.body.velocity = keyVels[key];
        }.bind(this, key);

      }
    }
  },

  attack: function() {
    console.log(this.player.leftRight);
    var reach = this.player.leftRight === "left"? -50 : 50;
    this.e.forEach(function(e) {
      // if (Math.abs(e.position.y - this.player.position.y) > this.player.height) {
        // return;
      // }
      if (e.position.x - this.player.position.x > reach) {
        return;
      }
      e.kill();
      // die, and set timeout to spawn new
    }.bind(this));

  },

  spawnEnemy: function() {
    var randY = Math.random();
    var randX = Math.round(Math.random());
    var enemy = this.e.create(randX * this.game.width, randY * this.game.height, "player");
    enemy.alpha = 0.4;
    enemy.anchor.set(0.5, 0.5);
  },

  update: function () {
    this.player.velocity *= 0.98;
    if (this.player.body.velocity.x > 0) {
      this.player.leftRight = "right";
    } else if (this.player.body.velocity.x < 0) {
      this.player.leftRight = "left";
    }
    this.game.physics.arcade.collide(this.player, this.e, this.loseAccreditation.bind(this));
  },

  loseAccreditation: function () {
    this.player.accreditations -= 1;
    console.log(this.player.accreditations);
    // play anim
    if (this.player.accreditations === 0) {
      this.quitGame();
    }
  },

  quitGame: function (pointer) {

    //	Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //	Then let's go back to the main menu.

    // countdown
    this.state.start('MainMenu');

  }

};
