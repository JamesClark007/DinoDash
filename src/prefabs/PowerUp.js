class PowerUp extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
      super(scene, x, y, type);
  
      // Add the power up sprite to the scene
      scene.add.existing(this);
  
      // Set the power up's type
      this.type = type;
  
      // Set the power up's default properties
      this.duration = 5000; // 5 seconds
      this.isActivated = false;
      this.isExpired = false;
  
      // Set the power up's animation based on its type
      switch (type) {
        case 'double-jump':
          this.setTexture('doubleJumpPowerUp');
          break;
        case 'fire-breath':
          this.setTexture('fireBreathPowerUp');
          break;
        case 'fly':
          this.setTexture('flyPowerUp');
          break;
        case 'time':
          this.setTexture('timePowerUp');
          break;
        default:
          // If an invalid type is specified, default to the double jump power up
          this.setTexture('doubleJumpPowerUp');
          break;
      }
    }
  
    // Activate the power up
    activate(player) {
      switch (this.type) {
        case 'double-jump':
          player.canDoubleJump = true;
          break;
        case 'fire-breath':
          player.canBreatheFire = true;
          break;
        case 'fly':
          player.canFly = true;
          break;
        case 'time':
          // Increase the game's speed by 50% for the duration of the power up
          this.scene.time.timeScale = 1.5;
          break;
      }
  
      // Set the power up's state to activated
      this.isActivated = true;
  
      // Start a timer to expire the power up after its duration has elapsed
      this.scene.time.delayedCall(this.duration, () => {
        this.expire(player);
      });
    }
  
    // Expire the power up
    expire(player) {
      switch (this.type) {
        case 'double-jump':
          player.canDoubleJump = false;
          break;
        case 'fire-breath':
          player.canBreatheFire = false;
          break;
        case 'fly':
          player.canFly = false;
          break;
        case 'time':
          // Reset the game's speed to normal
          this.scene.time.timeScale = 1;
          break;
      }
  
      // Set the power up's state to expired
      this.isActivated = false;
      this.isExpired = true;
  
      // Destroy the power up sprite
      this.destroy();
    }
  }
  