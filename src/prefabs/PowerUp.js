class PowerUp extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
      super(scene, x, y, 'rotating_orbs');
  
      // Add the power up sprite to the scene
      scene.add.existing(this);
  
      // Set the power up's type
      this.type = type;

      const powerUpTypes = ['double-jump', 'fire-breath', 'time'];
      this.powerUpType = powerUpTypes.indexOf(type);
  
      this.play(type);

      // Set the power up's default properties
      this.duration = 5000; // 5 seconds
      this.isActivated = false;
      this.isExpired = false;

  
      // Set the power up's animation based on its type
      switch (type) {
        case 'double-jump':
            this.setTexture('powerUpSpritesheet');
            this.play('double-jump');
            break;
        case 'fire-breath':
            this.setTexture('powerUpSpritesheet');
            this.play('fire-breath');
            break;
            
        case 'time':
            this.setTexture('powerUpSpritesheet');
            this.play('time');
            break;
        
    }
  }
  
    // Activate the power up
    activate(player) {

      player.activePowerUpTypes.push(this.type);


      switch (this.type) {
        case 'double-jump':
          player.canDoubleJump = true;
          player.hasDoubleJumpPowerUp = true; // Add this line
          player.enableDoubleJump();
          break;
        case 'fire-breath':
          player.canBreatheFire = true;
          break;
        case 'time':
          player.timeBoost = true;
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
      if (!this.active) return;

      switch (this.type) {
        case 'double-jump':
          player.canDoubleJump = false;
          break;
        case 'fire-breath':
          player.canBreatheFire = false;
          break;
          
        case 'time':
          // Reset the game's speed to normal
          this.scene.time.timeScale = 1;
          break;
      }
      
      player.activePowerUpTypes = player.activePowerUpTypes.filter(type => type !== this.type);

      
  
      // Set the power up's state to expired
      this.isActivated = false;
      this.isExpired = true;
  
      // Destroy the power up sprite
      this.destroy();
      player.activePowerUpType = null;
    }
  }
  