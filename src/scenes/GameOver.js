class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        // Display game over text
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or LEFT ARROW for Menu', this.scoreConfig).setOrigin(0.5);

        // Reset the high score if R key is pressed
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            // Reset the high score
            localStorage.setItem('highScore', '0');

            // Restart the play scene
            this.scene.start("playScene");
        }
    }
}

