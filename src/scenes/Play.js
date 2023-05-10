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
        this.load.image('tree', './assets/tree.png');
        this.load.image('dino', 'assets/dino.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.audio('sfx_jump', 'assets/dino_jump.mp3');
        this.load.image('dino_with_wings', 'assets/dino_with_wings.png');
        this.load.spritesheet('rotating_orbs', 'assets/rotating_orbs.png', { frameWidth: 32, frameHeight: 32 });
        this.load.on('filecomplete', (key, type, data) => {
            if (key === 'rotating_orbs') {
                console.log('Spritesheet loaded successfully');
            }
        });
        
            
    }
    
    create() {

        const groundY = game.config.height - borderUISize - borderPadding;
        this.ground = this.add.tileSprite(0, groundY+40, game.config.width, game.config.height, 'ground').setOrigin(0, 1);


    
        this.dino = new Dino(this, game.config.width / 2,
         groundY + 30, 'dino', groundY).setOrigin(0.5, 1);

        this.obstacles = new ObstacleGroup(this, groundY);

        this.tree = new Tree(this, game.config.width,
            groundY - 80, 'tree', 0).setOrigin(0,0);
            
        this.powerUps = new PowerUpGroup(this, groundY);

        this.physics.add.collider(this.dino, this.obstacles, this.hitObstacle, null, this);
        this.physics.add.collider(this.dino, this.tree, this.hitObstacle, null, this);
        this.physics.add.collider(this.dino, this.powerUps, this.collectPowerUp, null, this);
        


        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


        this.p1Score = 0;
        let collectedPowerUps = [];
        this.collectedPowerUps = Array(4).fill(-1);

        this.powerUpSpaces = [];
        this.powerUpSpaceWidth = 40;
        this.powerUpSpacePadding = 10;
        for (let i = 0; i < 4; i++) {
            let spaceX = borderUISize + borderPadding + i * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
            let spaceY = borderUISize + borderPadding + 60;
            let space = this.add.circle(spaceX + this.powerUpSpaceWidth / 2, spaceY + this.powerUpSpaceWidth / 2, this.powerUpSpaceWidth / 2, 0xFFFFFF);
            this.powerUpSpaces.push(space);
        }



        // const highScoreManager = this.registry.get('highScoreManager');

        // if (highScoreManager.getHighScore() === 0) {
        //     highScoreManager.setHighScore(0);
        // }

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


        // Define the animation for each power-up orb
        this.anims.create({
            key: 'double-jump',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'fire-breath',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'time',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1
        });
    
        

    //     this.scoreLeft = this.add.text(borderUISize + borderPadding,
    //         borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);

    //    this.highScoreText = this.add.text(borderUISize + borderPadding + 200,
    //        borderUISize + borderPadding*2,
    //        `${highScoreManager.getHighScore()}`, this.scoreConfig);

        

        this.gameOver = false;

        // scoreConfig.fixedWidth = 0;
        

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
            //const highScoreManager = this.registry.get('highScoreManager');
            this.gameOver = true;
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.timeEvent.remove();

            
            // highScoreManager.setHighScore(this.p1Score);
            this.scene.restart();
        }

        
        if (!this.gameOver) {
            this.dino.update();
            this.tree.update();
            this.ground.tilePositionX += 4;
            this.obstacles.update();

            this.powerUps.children.each(powerUp => {
                if (powerUp.x <= 0 - powerUp.width) {
                    powerUp.destroy();
                }
            });

            if (Math.random() < 0.06) {
                this.powerUps.spawnPowerUp();
            }
    


    
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
            if (obstacle instanceof Tree) {
                obstacle.reset();
            }
            else{
                obstacle.destroy(); // this
            }

            dino.loseLife();
            this.updateLives();

        }
        
        // addScore(points) {
        //     this.p1Score += points;
        //     this.scoreLeft.text = this.p1Score;
        //     if (this.p1Score > this.registry.get('highScoreManager').getHighScore()) {
        //         this.highScoreText.text = this.p1Score;
        //     }
        // }

        generatePowerUpOrb(index) {
            let spaceX = borderUISize + borderPadding + index * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
            let spaceY = borderUISize + borderPadding + 40; // Same Y value as the power-up spaces
            let orb = this.add.sprite(spaceX + this.powerUpSpaceWidth / 2, spaceY + this.powerUpSpaceWidth / 2, 'rotating_orbs').setOrigin(0.5, 0.5);
            orb.anims.play(`powerUpOrb${index + 1}`);
            return orb;
        }

        updatePowerUpUI() {
            for (let i = 0; i < this.collectedPowerUps.length; i++) {
                let powerUpType = this.collectedPowerUps[i];
                if (powerUpType !== -1) {
                    this.powerUpSpaces[i].destroy();
                    let spaceX = borderUISize + borderPadding + i * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
                    let spaceY = borderUISize + borderPadding + 60;
                    let space = this.add.sprite(spaceX + this.powerUpSpaceWidth / 2, spaceY + this.powerUpSpaceWidth / 2, 'rotating_orbs').setOrigin(0.5, 0.5);
                    
                    switch (powerUpType) {
                        case 0:
                            space.anims.play('double-jump');
                            break;
                        case 1:
                            space.anims.play('fire-breath');
                            break;
                        case 2:
                            space.anims.play('fly');
                            break;
                        case 3:
                            space.anims.play('time');
                            break;
                    }
                    
                    this.powerUpSpaces[i] = space;
                }
            }
        }
        

        collectPowerUp(dino, powerUp) {
            // Add collection logic here
            powerUp.activate(dino);
            powerUp.destroy();
            for (let i = 0; i < this.collectedPowerUps.length; i++) {
                if (this.collectedPowerUps[i] === -1) {
                    this.collectedPowerUps[i] = powerUp.powerUpType;
                    break;
                }
            }
            this.updatePowerUpUI();
        
        }
}        