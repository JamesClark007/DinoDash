class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('ground', 'assets/dino_background.png');
        this.load.image('dino', 'assets/dino.png');

        this.load.audio('sfx_jump', 'assets/dino_jump.mp3');

        
        
    }
      
    create() {
        const groundY = game.config.height - borderUISize - borderPadding;
        this.ground = this.add.tileSprite(0, groundY, game.config.width, 480, 'ground').setOrigin(0, 1);

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    
        this.dino = new Dino(this, game.config.width / 2, groundY, 'dino').setOrigin(0.5, 1);

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                 start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;

        const highScoreManager = this.registry.get('highScoreManager');

        if (highScoreManager.getHighScore() === 0) {
            highScoreManager.setHighScore(0);
        }

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };

        this.scoreLeft = this.add.text(borderUISize + borderPadding,
             borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        this.highScoreText = this.add.text(borderUISize + borderPadding + 200,
            borderUISize + borderPadding*2,
            `${highScoreManager.getHighScore()}`, scoreConfig);
        

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        

        this.remainingTime = game.settings.gameTimer;

        this.updateTimer();

        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.decreaseRemainingTime,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            const highScoreManager = this.registry.get('highScoreManager');
            highScoreManager.setHighScore(this.p1Score);
            this.scene.restart();
        }
        if (!this.gameOver) {
            this.dino.update();
        }
    
        this.ground.tilePositionX += 4;

        
        if (this.remainingTime <= 0) {
                this.gameOver = true;
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or LEFT ARROW for Menu', scoreConfig).setOrigin(0.5);
                this.timeEvent.remove();
        }
    }
        
        updateTimer() {
            let timeText = this.remainingTime.toString();
            this.timeText = this.add.text(game.config.width - borderUISize - borderPadding - 100, borderUISize + borderPadding * 2, timeText, {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                align: 'right',
                padding: { top: 5, bottom: 5 },
                fixedWidth: 100
            });
        }
        
        decreaseRemainingTime() {
            this.remainingTime -= 1;
            this.timeText.destroy();
            this.updateTimer();
        }
        
        addScore(points) {
            this.p1Score += points;
            this.scoreLeft.text = this.p1Score;
            if (this.p1Score > this.registry.get('highScoreManager').getHighScore()) {
                this.highScoreText.text = this.p1Score;
            }
        }
}        