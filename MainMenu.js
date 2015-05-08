
BasicGame.MainMenu = function (game) {

	this.bg;
	this.spriteTopLeft;
	this.spriteTopRight;
	this.spriteBottomLeft;
	this.spriteBottomRight;

};

BasicGame.MainMenu.prototype = {

	create: function () {

	  this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');

	  this.playbtn = this.add.sprite(this.game.width/2, this.game.height/2, 'playbtn');
	  this.playbtn.anchor.set(0.5, 0.5);
          this.playbtn.inputEnabled = true;
          this.playbtn.events.onInputUp.add(function(){
            this.state.start("Game");
          }.bind(this));

	},

	update: function () {
	},

	resize: function (width, height) {

	  this.bg.width = width;
	  this.bg.height = height;

	  this.spriteMiddle.x = this.game.world.centerX;
	  this.spriteMiddle.y = this.game.world.centerY;

	}

};
