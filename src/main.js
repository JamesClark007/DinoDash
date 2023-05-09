// James Clark
// Endless Runner
// 30 hours

// TODO

// 1. fix the ground system

// add obstacles X


// add a power up that lets you double jump ./ wings that let you fly for the double jump
// fix the timer, fix the game over menu

// fix the easy and hard mode and add a medium mode, also maybe add an insane mode with 
// ./ score multipliers for each difficulty

// add a 'psudo boss' ./ enemies that you can kill with a fire breath attack

// add a health boost that add time

// ././ add a store where you can spend points for new skins/power ups







let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    scene: [ Menu, Play ],

    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false,
      },
    },

    callbacks: {
      postBoot: function (game) {
          game.registry.set('highScoreManager', highScoreManager);
        }
    }
  }
  
let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP;