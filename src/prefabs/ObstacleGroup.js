class ObstacleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.spawnObstacle(scene);
    }

    spawnObstacle(scene) {
        const x = scene.game.config.width + 100; // Spawn obstacle off the screen
        const y = Phaser.Math.Between(borderUISize + borderPadding,
             game.config.height - borderUISize - borderPadding); 
             
        const rockHeight = scene.textures.get('rock').getSourceImage().height;
        

        const obstacle = new Obstacle(scene, x, y, 'rock'); // Replace 'obstacle' with the desired texture name
        this.add(obstacle);

        // Create a timed event to spawn the next obstacle
        const spawnDelay = Phaser.Math.Between(1000, 5000); // Adjust the values to change the frequency of obstacles
        scene.time.delayedCall(spawnDelay, () => {
            this.spawnObstacle(scene);
        });
    }

    update() { // Add update method to update all obstacles in the group
        this.getChildren().forEach(obstacle => {
            obstacle.x -= 5;
            obstacle.update();
    
            //obstacle.setVelocityX(-50); // Set the obstacle's x velocity to move it from right to left more slowly

    
            if (obstacle.x + obstacle.width < 0) {
                obstacle.destroy();
            }
        });
    }
    
    
}
