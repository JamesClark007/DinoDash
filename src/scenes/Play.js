class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 140
        };
        this.HighScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 240
        };
        this.powerUpIcons = [];
        this.collectedPowerUps = [];

    }

    preload() {
        this.load.image('ground', 'assets/dino_background.png');
        this.load.image('tree', './assets/tree.png');
        this.load.image('dino', 'assets/dino.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.image('dino_fire', 'assets/dino_fire.png');

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
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.timeSurvived = 0;

        const storedHighScore = localStorage.getItem('highScore');
        this.highScore = storedHighScore ? parseInt(storedHighScore) : 0;
        this.highScoreText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, `High Score:${this.highScore}`, this.HighScoreConfig);

        this.timerText = this.add.text(game.config.width - borderUISize - borderPadding - 150, borderUISize + borderPadding, `Time: ${this.timeSurvived}`, this.scoreConfig);

        this.timeEvent = this.time.delayedCall(1000, this.increaseTimeSurvived, [], this);
    



        //this.updateTimer();

        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.increaseTimeSurvived,
            callbackScope: this,
            loop: true
        });
        



        // this.p1Score = 0;
        let collectedPowerUps = [];
        this.collectedPowerUps = Array(3).fill(-1);

        this.powerUpSpaces = [];
        this.powerUpSpaceWidth = 40;
        this.powerUpSpacePadding = 10;
        for (let i = 0; i < 3; i++) {
            let spaceX = borderUISize + borderPadding + i * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
            let spaceY = borderUISize + borderPadding + 60;
            let space = this.add.circle(spaceX + this.powerUpSpaceWidth / 2, spaceY + this.powerUpSpaceWidth / 2, this.powerUpSpaceWidth / 2, 0x000000);
            this.powerUpSpaces.push(space);
        }

        

        this.livesText = this.add.text(borderUISize + borderPadding + 400, borderUISize + borderPadding * 2, `Life: ${this.dino.lives}`, {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            align: 'right',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 130
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
            key: 'time',
            frames: this.anims.generateFrameNumbers('rotating_orbs', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });



        this.gameOver = false;
        
    }

    fireBreath() {
        if (this.dino.hasFireBreathPowerUp) {
          this.dino.fire(500);
          this.tree.reset();
        }
    }


    updateTimer() {
        this.timerText.setText(`Time: ${this.timeSurvived}`);
    }

    increaseTimeSurvived() {
        if (this.dino.timeBoost) {
          this.timeSurvived += 3; // Increase the time by 2 when the time power-up is active
        } else {
          this.timeSurvived += 1; // Default increment of 1 second
        }
        this.updateTimer();
      }
      
    



    update() {
        if (this.gameOver || this.dino.lives === 0) {
            this.gameOver = true;
            this.highScore = Math.max(this.highScore, this.timeSurvived);
            this.highScoreText.setText(`High Score:${this.highScore}`);

            // Store the high score in local storage
            localStorage.setItem('highScore', this.highScore.toString());

            this.timeEvent.remove();
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
            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                this.dino.jump();
              }
            
            
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                if (this.dino.hasFireBreathPowerUp) {
                    this.dino.fire(500);
                    let dinoBounds = this.dino.getBounds();
                    let treeBounds = this.tree.getBounds();
                    if (Phaser.Geom.Intersects.RectangleToRectangle(dinoBounds, treeBounds)) {
                        this.tree.reset();
                    }
                }
            }
            
              

            if (Math.random() < 0.015) {
                this.powerUps.spawnPowerUp();
            }

    
            if (this.dino.lives === 0) {
                this.gameOver = true;
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or LEFT ARROW for Menu', scoreConfig).setOrigin(0.5);
                this.timeEvent.remove();
            }
        }
    
    }
    
    
        

        updateLives() {
            this.livesText.text = `Life: ${this.dino.lives}`;
        }
          
        

        
        resetPowerUpDisplay() {
            // Clear existing power-up icons
            for (let i = 0; i < this.powerUpIcons.length; i++) {
                if (this.powerUpIcons[i] !== null) {
                    this.powerUpIcons[i].destroy();
                    this.powerUpIcons[i] = null;
                }
            }
        
            // Reset collectedPowerUps array
            this.collectedPowerUps = Array(3).fill(-1);
        }
        
        
        hitObstacle(dino, obstacle) {
            if (obstacle instanceof Tree) {
                obstacle.reset();
            } else {
                obstacle.destroy();
            }
            dino.loseLife();
            dino.removeAllPowerUps();
            this.updateLives();
            this.resetPowerUpDisplay(); // Add this line
        }
        
        
        collectPowerUp(dino, powerUp) {
            powerUp.activate(dino);
        
            // Check if the collected power-up has higher priority
            let replaceIndex = -1;
            for (let i = 0; i < this.collectedPowerUps.length; i++) {
                if (this.collectedPowerUps[i] === -1 || powerUp.powerUpType < this.collectedPowerUps[i]) {
                    replaceIndex = i;
                    break;
                }
            }
            if (replaceIndex === -1) {
                powerUp.destroy();
                return;
            }
        
            // Deactivate the previous power-up
            switch (this.collectedPowerUps[replaceIndex]) {
                case 1:
                    dino.hasFireBreathPowerUp = false;
                    break;
                case 2:
                    dino.hasDoubleJumpPowerUp = false;
                    break;
            }
        
            // Activate the new power-up
            dino.activePowerUpType = powerUp.powerUpType;

            switch (powerUp.powerUpType) {
                case 1:
                    dino.hasFireBreathPowerUp = true;
                    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F, this.fireBreath, null, this);
                    break;
                case 2:
                    dino.hasDoubleJumpPowerUp = true;
                    break;
            }
        
            this.collectedPowerUps[replaceIndex] = powerUp.powerUpType;
            powerUp.destroy();
            this.updatePowerUpDisplay();
        }
        
          
        

        updatePowerUpDisplay(powerUp) {
            // Clear existing power-up icons
            for (let i = 0; i < this.powerUpIcons.length; i++) {
                if (this.powerUpIcons[i] !== null) {
                    this.powerUpIcons[i].destroy();
                    this.powerUpIcons[i] = null;
                }
            }
        
            // Add corresponding power-up icons
            for (let i = 0; i < this.collectedPowerUps.length; i++) {
                console.log(this.collectedPowerUps[i]);

                let powerUpType = this.collectedPowerUps[i]; // this always outputs -1
                if (powerUpType !== -1) {
                    let spaceX = borderUISize + borderPadding + i * (this.powerUpSpaceWidth + this.powerUpSpacePadding);
                    let spaceY = borderUISize + borderPadding + 60;
                    let icon = this.add.sprite(spaceX + this.powerUpSpaceWidth / 2, spaceY + this.powerUpSpaceWidth / 2, 'rotating_orbs').setOrigin(0.5, 0.5);
                    console.log(powerUpType);
                    switch (powerUpType) {
                        case 0:
                            icon.anims.play('double-jump');
                            break;
                        case 1:
                            icon.anims.play('fire-breath');
                            break;
                        case 2:
                            icon.anims.play('time');
                            break;
                    }
        
                    this.powerUpIcons[i] = icon;
                }
            }
        }
        

}        