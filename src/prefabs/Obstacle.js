class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      scene.add.existing(this); // add to existing, displayList, updateList
      scene.physics.world.enableBody(this);
      this.body.setImmovable(true);
      this.body.setAllowGravity(false);
      this.body.setSize(this.width, this.height); 
      this.moveSpeed = 4; // pixels per frame
    }
  
    update() {
      // Move the obstacle to the left
      this.x -= this.moveSpeed;
  
      // Check if the obstacle is out of the screen bounds
      if (this.x < -this.width) {
        this.destroy();
      }
    }
}
