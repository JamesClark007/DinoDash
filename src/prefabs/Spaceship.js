// class Spaceship extends Phaser.GameObjects.Sprite{
//     constructor(scene, x, y, texture, frame, pointValue){
//         super(scene, x, y, texture, frame);
//         scene.add.existing(this);
//         this.points = pointValue;
//         this.moveSpeed = game.settings.spaceshipSpeed;
//         this.verticalDirection = (Math.random() - 0.5) * 0.4; // Set a random vertical angle between -0.2 and 0.2
    


//     }   
//     update(){
//         // Move horizontally to the left
//         this.x -= this.moveSpeed;
    
//         // Move vertically based on the verticalDirection value
//         this.y += this.verticalDirection * this.moveSpeed;
    
//         // Wrap around the screen horizontally
//         if (this.x <= 0 - this.width) {
//             this.x = game.config.width;
//         } else if (this.x >= game.config.width + this.width) {
//             this.x = 0 - this.width;
//         }
    
//         // Clamp the vertical position to stay within the screen
//         this.y = Phaser.Math.Clamp(this.y, 0 + this.height / 2, game.config.height - this.height / 2);
//     }
    

//     reset() {
//         this.x = game.config.width;
//     }
//     increaseSpeed() {
//         this.moveSpeed += 1; // You can adjust this value to change the speed increase amount
//     }
    
// }