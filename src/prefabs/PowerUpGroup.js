class PowerUpGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, groundY) {
        super(scene.physics.world, scene);
        this.groundY = groundY;
    }

    spawnPowerUp() {
        const powerUpTypes = ['double-jump', 'fire-breath', 'time'];
        let availablePowerUpTypes = powerUpTypes.filter(
            (type) => !this.scene.collectedPowerUps.includes(powerUpTypes.indexOf(type))
        );
    
        if (availablePowerUpTypes.length === 0) {
            // If the dino has collected all power-up types, no power-up will be spawned
            return;
        }
    
        const powerUpType = Phaser.Math.RND.pick(availablePowerUpTypes);
        const powerUpX = Phaser.Math.Between(50, game.config.width - 50); // Modified value
        
        const powerUpY = Phaser.Math.Between(
            game.config.height / 2 - borderUISize - borderPadding,
            game.config.height - borderUISize - borderPadding
        );
    
        const powerUp = new PowerUp(this.scene, powerUpX, powerUpY, powerUpType);
        this.add(powerUp);
        this.scene.physics.world.enable(powerUp);
    }
    

}
