class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.scoreConfig = {
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

    }

    preload() {
        this.load.image('ground', 'assets/dino_background.png');
        this.load.image('dino', 'assets/dino.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.audio('sfx_jump', 'assets/dino_jump.mp3');
        this.load.image('dino_with_wings', 'assets/dino_with_wings.png');
        this.load.spritesheet('rotating_orbs', 'assets/rotating_orbs.png', { frameWidth: 32, frameHeight: 32 });
            
        // Define the animation for each power-up orb
        this.anims.create({
            key: 'powerUpOrb1',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'powerUpOrb2',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'powerUpOrb3',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'powerUpOrb4',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'powerUpOrb5',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 16, end: 19 }),
            frameRate: 8,
            repeat: -1
        });
    }
    
    create() {

        const groundY = game.config.height - borderUISize - borderPadding;
        this.ground = this.add.tileSprite(0, groundY+40, game.config.width, game.config.height, 'ground').setOrigin(0, 1);


    
        this.dino = new Dino(this, game.config.width / 2, groundY, 'dino').setOrigin(0.5, 1);

        this.obstacles = new ObstacleGroup(this, groundY);


        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


        this.p1Score = 0;
        let collectedPowerUps = [];

        this.powerUpSpaces = [];
        this.powerUpSpaceWidth = 40;
        this.powerUpSpacePadding = 10;
        for (let i = 0; i < 4; i++) {
            let spaceX = borderUISize + borderPadding + i * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
            let spaceY = borderUISize + borderPadding;
            let space = this.add.sprite(spaceX, spaceY, 'powerUpSpace').setOrigin(0, 0);
            this.powerUpSpaces.push(space);
        }


        const highScoreManager = this.registry.get('highScoreManager');

        if (highScoreManager.getHighScore() === 0) {
            highScoreManager.setHighScore(0);
        }

        this.livesText = this.add.text(borderUISize + borderPadding + 400, borderUISize + borderPadding * 2, `Life: ${this.dino.lives}`, {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            align: 'right',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 150
        });
        

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
            borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);

       this.highScoreText = this.add.text(borderUISize + borderPadding + 200,
           borderUISize + borderPadding*2,
           `${highScoreManager.getHighScore()}`, this.scoreConfig);

        

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
        if (this.gameOver || this.dino.lives === 0) {
            const highScoreManager = this.registry.get('highScoreManager');
            this.gameOver = true;
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.timeEvent.remove();

            
            highScoreManager.setHighScore(this.p1Score);
            this.scene.restart();
        }

        
        if (!this.gameOver) {
            this.dino.update();
            this.ground.tilePositionX += 4;
            this.obstacles.update();
            this.physics.add.collider(this.dino, this.obstacles, this.hitObstacle, null, this);
    
            if (this.remainingTime <= 0 || this.dino.lives === 0) {
                this.gameOver = true;
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or LEFT ARROW for Menu', scoreConfig).setOrigin(0.5);
                this.timeEvent.remove();
            }
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

        updateLives() {
            this.livesText.text = `Life: ${this.dino.lives}`;
        }
          
        
        decreaseRemainingTime() {
            this.remainingTime -= 1;
            this.timeText.destroy();
            this.updateTimer();
        }
        
        hitObstacle(dino, obstacle) {
            dino.loseLife();
            this.updateLives();
            obstacle.destroy();
        }
        
        addScore(points) {
            this.p1Score += points;
            this.scoreLeft.text = this.p1Score;
            if (this.p1Score > this.registry.get('highScoreManager').getHighScore()) {
                this.highScoreText.text = this.p1Score;
            }
        }
}        