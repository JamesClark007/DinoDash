class Dino extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, groundY) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this); // add to existing, displayList, updateList

    scene.physics.world.enableBody(this); // Add the dino to the physics world
    this.body.setCollideWorldBounds(true); // Prevent the dino from going off-screen
    this.body.setGravityY(500); // Adjust the gravity to control the dino's fall speed
    
    this.body.setSize(this.width * 0.5, this.height * 0.5);
    this.groundY = groundY;


    this.moveSpeed = 4; // pixels per frame
    this.isJumping = false;
    this.jumpHeight = 200; // adjust to change jump height
    this.jumpDuration = 500; // adjust to change the duration of the jump
    this.groundY = y; // Store the ground level position
    this.lives = 3;
    this.doubleJump = false;
    this.canDoubleJump = false;

    this.sfxJump = scene.sound.add('sfx_jump'); // add jump sfx
}


  update() {
      // left/right movement
      if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
          this.x -= this.moveSpeed;
      }
      
      if (keyRIGHT.isDown) {
          this.x += this.moveSpeed;
      }

      // jump
      if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.isJumping) {
          this.isJumping = true;
          this.sfxJump.play();
          this.jump();
      }
      if (this.y > this.groundY) {
        this.y = this.groundY;
        this.body.velocity.y = 0;
    }    
  }

  jump() {
    if (this.isJumping && this.doubleJump && this.canDoubleJump) {
      // Allow double jump
      this.canDoubleJump = false;
      this.sfxJump.play();
    } else if (!this.isJumping) {
      // Allow first jump
      this.isJumping = true;
      this.canDoubleJump = true;
      this.sfxJump.play();
    }
  
      this.scene.tweens.add({
          targets: this,
          y: this.groundY - this.jumpHeight,
          duration: this.jumpDuration / 2,
          ease: 'Quad.easeOut',
          onComplete: () => {
              this.scene.tweens.add({
                  targets: this,
                  y: this.groundY,
                  duration: this.jumpDuration / 2,
                  ease: 'Quad.easeIn',
                  onComplete: () => {
                      this.isJumping = false;
                  },
              });
          },
      });
  }
  enableDoubleJump() {
    this.doubleJump = true;
    this.setTexture('dino_with_wings'); // Change the sprite's appearance
  }
  

  increaseSpeed() {
      this.moveSpeed += 1; // You can adjust this value to change the speed increase amount
  }

  loseLife() {
    this.lives -= 1;
  }
  
}
