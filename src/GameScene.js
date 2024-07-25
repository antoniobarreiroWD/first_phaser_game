let lives = 3;
let croissants = [];
let invulnerable = false;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('ground1', 'assets/ground1.png');
        this.load.spritesheet('player', 'assets/dude4.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('zombieWalk1', 'assets/catrinacut1.png');
        this.load.image('zombieWalk2', 'assets/catrinacut7.png');
        this.load.image('zombieWalk3', 'assets/catrinacut1.png');
        this.load.image('zombieWalk4', 'assets/catrinacut7.png');
        this.load.image('zombieWalk5', 'assets/catrinacut1.png');
        this.load.image('zombieWalk6', 'assets/catrinacut7.png');
        this.load.image('croissant', 'assets/chili2.png');
        this.load.image('hazard', 'assets/cactus2.png');
        this.load.image('explosion1', 'assets/cactus2.png');
        this.load.image('explosion2', 'assets/cactus3.png');
        this.load.image('explosion3', 'assets/cactus4.png');
        this.load.image('explosion4', 'assets/cactus5.png');
        this.load.image('flag1', 'assets/flag2.png');
        this.load.image('flag2', 'assets/flag3.png');
        this.load.image('flag3', 'assets/flag4.png');
        this.load.image('sombrero1', 'assets/sombrero.png');
        this.load.image('sombrero2', 'assets/sombrero3.png');
        this.load.image('sombrero3', 'assets/sombrero4.png');

        this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.wav');
        this.load.audio('jumpSound', 'assets/audio/jump.wav');
        this.load.audio('hitSound', 'assets/audio/hit.wav');
        this.load.audio('explosionSound', 'assets/audio/explosion.wav');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 7000, 600, 'sky').setOrigin(0, 0);
        this.platforms = this.physics.add.staticGroup();
        let ground = this.add.tileSprite(4000, 590, 9000, 64, 'ground1');
        this.physics.add.existing(ground, true);
        ground.body.setSize(9000, 64);
        ground.body.setOffset(0, 0);
        this.platforms.add(ground);

        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(60, 128, false);
        this.player.body.setOffset((this.player.width - 60) / 2, 0);

        this.sombrero = this.add.sprite(0, 0, 'sombrero1').setScale(0.2);
        this.sombrero.setOrigin(0.45, 0.4);
        this.sombrero.setVisible(false);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'sombreroWalk',
            frames: [
                { key: 'sombrero1' },
                { key: 'sombrero2' },
                { key: 'sombrero3' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, 6500, 600);
        this.cameras.main.startFollow(this.player);

        this.physics.world.setBounds(0, 0, 6500, 600);

        this.enemies = this.physics.add.group({
            immovable: false,
            allowGravity: true
        });

        let enemyPositions = [
            { x: 600, y: 450 }, //posiciones
            { x: 1500, y: 450 },
            { x: 2500, y: 450 },
            { x: 3500, y: 450 },
            { x: 4500, y: 450 }

        ];

        enemyPositions.forEach((pos) => {
            let enemy = this.enemies.create(pos.x, pos.y, 'zombieWalk1').setScale(0.4); //tamaño
            enemy.setBounce(0.2);
            enemy.setCollideWorldBounds(true);
            let velocity = Phaser.Math.Between(0, 1) === 0 ? 40 : -40;
            enemy.setVelocityX(velocity);
            enemy.body.setSize(enemy.width * 0.3, enemy.height * 0.43); // colisiones
        });

        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

        this.anims.create({
            key: 'enemyWalk',
            frames: [
                { key: 'zombieWalk1' },
                { key: 'zombieWalk2' },
            ],
            frameRate: 5,
            repeat: -1
        });

        this.enemies.children.iterate(function (enemy) {
            enemy.anims.play('enemyWalk', true);
        });

        this.adjustCameraZoom();

        let croissantX = window.innerWidth < 1200 ? -250 : 50;
        let croissantY = window.innerWidth < 1200 ? -100 : 50;

        for (let i = 0; i < lives; i++) {
            let croissant = this.add.image(croissantX + i * 40, croissantY, 'croissant').setScale(0.05);
            croissant.setScrollFactor(0);
            croissants.push(croissant);
        }

        this.hazards = this.physics.add.staticGroup();
        let hazard1 = this.add.tileSprite(1000, 540, 300, 64, 'hazard');
        this.physics.add.existing(hazard1, true);
        hazard1.body.setSize(90, 110);
        hazard1.body.setOffset(100, -60);
        this.hazards.add(hazard1);

        let hazard2 = this.add.tileSprite(2000, 540, 300, 64, 'hazard');
        this.physics.add.existing(hazard2, true);
        hazard2.body.setSize(90, 110);
        hazard2.body.setOffset(100, -60);
        this.hazards.add(hazard2);

        let hazard3 = this.add.tileSprite(3000, 540, 300, 64, 'hazard');
        this.physics.add.existing(hazard3, true);
        hazard3.body.setSize(90, 110);
        hazard3.body.setOffset(100, -60);
        this.hazards.add(hazard3);

        let hazard4 = this.add.tileSprite(4000, 540, 300, 64, 'hazard');
        this.physics.add.existing(hazard4, true);
        hazard4.body.setSize(90, 110);
        hazard4.body.setOffset(100, -60);
        this.hazards.add(hazard4);



        

        this.physics.add.collider(this.player, this.hazards, this.hitHazard, null, this);
        this.physics.add.overlap(this.enemies, this.hazards, this.enemyDetectHazard, null, this);

        this.anims.create({
            key: 'explosion',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' }
            ],
            frameRate: 7,
            repeat: -1
        });

        this.hazards.children.iterate(function (hazard) {
            let explosion = this.add.sprite(hazard.x, hazard.y - 32, 'explosion1').setScale(0.4);
            explosion.anims.play('explosion', true);
            console.log('Explosion added at:', hazard.x, hazard.y);
        }, this);

        this.anims.create({
            key: 'flagWave',
            frames: [
                { key: 'flag1' },
                { key: 'flag2' },
                { key: 'flag3' },
            ],
            frameRate: 5,
            repeat: -1
        });

        this.flag = this.add.sprite(6400, 501, 'flag1').setScale(2);
        this.flag.play('flagWave');

        this.physics.add.existing(this.flag, true);
        this.physics.add.collider(this.flag, this.platforms);
        this.physics.add.overlap(this.player, this.flag, this.reachFlag, null, this);

        this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5, loop: true });
        this.backgroundMusic.play();

        this.jumpSound = this.sound.add('jumpSound');
        this.hitSound = this.sound.add('hitSound');
        this.explosionSound = this.sound.add('explosionSound');
    }

    update() {
        let isSmallScreen = window.innerWidth < 990;
        let sombreroYOffset = isSmallScreen ? -60 : -this.player.height / 2;

        if (this.cursors.left.isDown || joystickPosition.x < 0) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.sombrero.anims.play('sombreroWalk', true);
            this.player.setFlipX(true);
            this.sombrero.setFlipX(true);
            if (isSmallScreen) {
                this.sombrero.setPosition(this.player.x  - 10, this.player.y + sombreroYOffset);
            } else {
                this.sombrero.setPosition(this.player.x - 10, this.player.y + sombreroYOffset);
            }
        } else if (this.cursors.right.isDown || joystickPosition.x > 0) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            this.sombrero.anims.play('sombreroWalk', true);
            this.player.setFlipX(false);
            this.sombrero.setFlipX(false);
            this.sombrero.setPosition(this.player.x + 10, this.player.y + sombreroYOffset);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            this.sombrero.setTexture('sombrero1');
            this.sombrero.setPosition(this.player.x, this.player.y + sombreroYOffset);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
            this.jumpSound.play();
        }

        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;

        const enemySpeed = 70;
        this.enemies.children.iterate(function (enemy) {
            if (enemy.body.velocity.x === 0) {
                enemy.setVelocityX(Phaser.Math.Between(0, 1) ? enemySpeed : -enemySpeed);
            }

            enemy.setFlipX(enemy.body.velocity.x < 0);

            if (enemy.body.blocked.left) {
                enemy.setVelocityX(enemySpeed);
            } else if (enemy.body.blocked.right) {
                enemy.setVelocityX(-enemySpeed);
            }

            if (!enemy.anims.isPlaying) {
                enemy.anims.play('enemyWalk', true);
            }
        });

        if (invulnerable) {
            this.player.setAlpha(this.player.alpha === 1 ? 0.5 : 1);
        } else {
            this.player.setAlpha(1);
        }

        this.sombrero.setVisible(true);
    }

    hitEnemy(player, enemy) {
        if (!invulnerable) {
            lives -= 1;
            croissants[lives].destroy();
            this.hitSound.play();
            console.log(`Vidas restantes: ${lives}`);
            if (lives <= 0) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                let gameOver = true;
            } else {
                invulnerable = true;
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        invulnerable = false;
                    },
                    callbackScope: this
                });
            }
        }
    }

    hitHazard(player, hazard) {
        if (!invulnerable) {
            lives -= 1;
            croissants[lives].destroy();
            this.explosionSound.play();
            console.log(`Vidas restantes: ${lives}`);
            if (lives <= 0) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                let gameOver = true;
            } else {
                invulnerable = true;
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        invulnerable = false;
                    },
                    callbackScope: this
                });
            }
        }
    }

    enemyDetectHazard(enemy, hazard) {
        enemy.setVelocityX(-enemy.body.velocity.x);
    }

    adjustCameraZoom() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (width < 990) {
            this.cameras.main.setZoom(0.5);
        } else {
            this.cameras.main.setZoom(1);
        }
    }

    reachFlag(player, flag) {
        this.physics.pause();
        player.setTint(0x00ff00);
        player.anims.play('turn');
        let style = { font: "40px Arial", fill: "#fff" };
        let text = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y, "Nivel Completado", style);
        text.setOrigin(0.5);
    }
}

export default GameScene;