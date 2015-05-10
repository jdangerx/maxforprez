
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		this.background = this.add.sprite(0, 0, 'preloaderBackground');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		// this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

	  this.load.image('playbtn', 'images/play_button.png');
	  this.load.image('ground', 'images/ground.png');
	  this.load.image('shadow', 'images/shadow.png');
	  this.load.image('bg', 'images/shadow.png');
	  this.load.image('menubg', 'images/menu_bg.png');
          this.load.spritesheet('fridgeR', 'images/fridge/walkR.png', 260, 316);
          this.load.spritesheet('fridgeL', 'images/fridge/walkL.png', 260, 316);
          this.load.spritesheet('atkL', 'images/fridge/atkL.png', 260, 316);
          this.load.spritesheet('atkR', 'images/fridge/atkR.png', 260, 316);
          this.load.spritesheet('lawyer', 'images/lawyer/lawyer.png', 150, 216);

	},

	create: function () {

		this.state.start('Game');

	}

};
