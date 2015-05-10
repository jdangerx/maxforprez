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
    var bg = this.game.add.sprite(0, 0, "ground");
    this.numEnemies = 5;
    bg.scale.y = 2;
    this.p = this.game.add.group();
    this.player = this.p.create(this.game.width/2, this.game.height/2, "fridgeR");
    this.player.anchor.set(0.5, 0.5);
    this.player.leftRight = "right";
    this.player.accreditations = 3;
    this.funds = 0
    this.score = this.game.add.text(this.game.width/2,
                                    this.game.height/4,
                                    "Campaign Funding: $" + this.funds);
    this.score.anchor.set(0.5, 0.5);
    this.creds = this.game.add.text(this.game.width/2,
                                    this.game.height/3,
                                    "Accreditations: " + this.player.accreditations);
    this.creds.anchor.set(0.5, 0.5);
    this.game.physics.arcade.enable(this.p);
    this.e = this.game.add.group();
    for (var i = 0; i < this.numEnemies; i++) {
      this.spawnEnemy();
    }

    window.setInterval(function() {
      this.e.forEach(function(e) {
        this.game.physics.arcade.moveToObject(e, this.player, 50);
      }.bind(this));
    }.bind(this), 1000);

    this.initCtls();
  },

  updateScore: function() {
    this.score.text = "Campaign Funding: $" + this.funds;
    this.creds.text = "Accreditations: " + this.player.accreditations;
  },

  initCtls: function() {
    var keyMap = {
      "y": 89,
      "o": 79,
      "b": 66,
      ",": 188,
    };

    var maxvel = 70;
    var keyVels = {
      "y": new Phaser.Point(maxvel, maxvel),
      "o": new Phaser.Point(-maxvel, maxvel),
      "b": new Phaser.Point(maxvel, -maxvel),
      ",": new Phaser.Point(-maxvel, -maxvel),
    };
    this.ctl = {};
    var atkKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
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
    var avgSep = this.player.width;
    console.log(this.player.leftRight);
    this.e.forEach(function(e) {
      // if ((e.position.y - this.player.position.y > this.player.height/4) ||
          // (e.position.y - this.player.position.y < 0)) {
        // return;
      // }
      if (this.player.leftRight === "right") {
        window.setTimeout(function() {
          this.player.loadTexture("fridgeR");
        }.bind(this), 200);
        this.player.loadTexture("atkR");
        if ((this.player.position.x > e.position.x) ||
            (e.position.x - this.player.position.x > this.player.width * 1.5)) {
          return;
        }
      } else if (this.player.leftRight === "left") {
        this.player.loadTexture("atkL");
        window.setTimeout(function() {
          this.player.loadTexture("fridgeL");
        }.bind(this), 200);
        if ((this.player.position.x < e.position.x) ||
            (this.player.position.x - e.position.x > this.player.width * 1.5)) {
          return;
        }
      }
      e.destroy();
      this.funds += Math.random() * 5000 | 0;
      this.updateScore();
      window.setTimeout(function() {
        this.spawnEnemy();
        this.spawnEnemy();
      }.bind(this), 1000);
    }.bind(this));

  },

  spawnEnemy: function() {
    var randY = Math.random();
    var randX = Math.round(Math.random());
    var enemy = this.e.create(randX * this.game.width, randY * this.game.height, "lawyer");
    enemy.anchor.set(0.5, 0.5);
    this.game.physics.arcade.enable(enemy);
  },

  update: function () {
    this.player.velocity *= 0.98;
    if (this.player.body.velocity.x > 0 && this.player.leftRight !== "right") {
      this.player.leftRight = "right";
      this.player.loadTexture("fridgeR");
    } else if (this.player.body.velocity.x < 0 && this.player.leftRight !== "left") {
      this.player.leftRight = "left";
      this.player.loadTexture("fridgeL");
    }
    this.game.physics.arcade.collide(this.player, this.e, this.loseAccreditation.bind(this));
  },

  loseAccreditation: function () {
    this.player.accreditations -= 1;
    console.log(this.player.accreditations);
    this.updateScore();
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
