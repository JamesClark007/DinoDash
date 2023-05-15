// James Clark
// Endless Runner
// 30 hours

// TODO

// make dino jump higher without changing the grondY x just change jumpheight

// add a power up that lets you double jump ./ wings that let you fly for the double jump
// fix the timer, fix the game over menu

// fix the easy and hard mode and add a medium mode, also maybe add an insane mode with 
// ./ score multipliers for each difficulty

// add a 'psudo boss' ./ enemies that you can kill with a fire breath attack

// add a health boost that add time

// ././ add a store where you can spend points for new skins/power ups

/*

Properly transition between Scenes and allow the player to restart w/out having to reload the page (5) not yet

Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (5)

Have looping background music (5)

Use a minimum of three sound effects for key mechanics, UI, and/or significant events appropriate to your game design (5)

Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (5)

Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (5)

Include in-game credits for all roles, assets, music, etc. (5)

 */







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
  }
  
let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP;