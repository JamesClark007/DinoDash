class PowerUpGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, groundY) {
        super(scene.physics.world, scene);
        this.groundY = groundY;
    }

    spawnPowerUp() {
        const powerUpTypes = ['double-jump', 'fire-breath', 'fly', 'time'];
        const randomX = Phaser.Math.Between(50, game.config.width - 50);
        const randomY = this.groundY - 50 - Math.random() * 200;
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const powerUp = new PowerUp(this.scene, randomX, randomY, randomType);
        this.add(powerUp);
        return powerUp;
    }
}
