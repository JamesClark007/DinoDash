// class SmallSpaceship extends Spaceship {
//     constructor(scene, x, y, texture, frame, pointValue) {
//         super(scene, x, y, texture, frame, pointValue);
//         //scene.add.existing(this);
//         // Customize the size (e.g., 0.5 for half the size)
//         this.setScale(0.1);
//         this.setAngle(-90);
//         this.points = pointValue;
//         // Increase the speed (e.g., 1.5 times faster)
//         this.moveSpeed = game.settings.spaceshipSpeed * 1.5;
//     }

//     update(){
//         this.x -= this.moveSpeed;
//         if(this.x <= 0 - this.width){
//             this.x = game.config.width;
//         }
//     }
//     reset() {
//         this.x = game.config.width;
//     }
// }
