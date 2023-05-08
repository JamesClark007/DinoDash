class Dino extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this); // add to existing, displayList, updateList
    this.moveSpeed = 2; // pixels per frame
    this.isJumping = false;
    this.jumpHeight = 100; // adjust to change jump height
    this.jumpDuration = 500; // adjust to change the duration of the jump
    this.groundY = y; // Store the ground level position

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
  }

  jump() {
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

  increaseSpeed() {
      this.moveSpeed += 1; // You can adjust this value to change the speed increase amount
  }
}
