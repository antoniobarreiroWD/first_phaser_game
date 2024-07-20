const config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let lives = 3;
let croissants = [];
let invulnerable = false;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground1', 'assets/ground1.png');
    this.load.spritesheet('player', 'assets/dude4.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('zombieWalk1', 'assets/Walk1.png');
    this.load.image('zombieWalk2', 'assets/Walk2.png');
    this.load.image('zombieWalk3', 'assets/Walk3.png');
    this.load.image('zombieWalk4', 'assets/Walk4.png');
    this.load.image('zombieWalk5', 'assets/Walk5.png');
    this.load.image('zombieWalk6', 'assets/Walk6.png');
    this.load.image('croissant', 'assets/croissant.png'); 
}

function create() {
    this.background = this.add.tileSprite(0, 0, 4800, 600, 'sky').setOrigin(0, 0);
    this.platforms = this.physics.add.staticGroup();
    let ground = this.add.tileSprite(2400, 590, 4800, 64, 'ground1');
    this.physics.add.existing(ground, true);
    ground.body.setSize(4800, 64);
    ground.body.setOffset(0, 0);
    this.platforms.add(ground);

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(60, 128, false);
    this.player.body.setOffset((this.player.width - 60) / 2, 0);

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

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 4800, 600);
    this.cameras.main.startFollow(this.player);

    this.physics.world.setBounds(0, 0, 4800, 600);

    this.enemies = this.physics.add.group({
        immovable: false,
        allowGravity: true
    });

    let enemyPositions = [
        { x: 600, y: 450 },
        { x: 1500, y: 450 },
    ];

    enemyPositions.forEach((pos) => {
        let enemy = this.enemies.create(pos.x, pos.y, 'zombieWalk1').setScale(0.4);
        enemy.setBounce(0.2);
        enemy.setCollideWorldBounds(true);
        let velocity = Phaser.Math.Between(0, 1) === 0 ? 40 : -40;
        enemy.setVelocityX(velocity);
    });

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);

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

    adjustCameraZoom();

    
    for (let i = 0; i < lives; i++) {
        let croissant = this.add.image(50 + i * 40, 50, 'croissant').setScale(0.1);
        croissant.setScrollFactor(0);
        croissants.push(croissant);
    }
}

function update() {
    if (window.innerWidth >= 768) {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    }

    this.background.tilePositionX = this.cameras.main.scrollX * 0.5;

    const enemySpeed = 70;
    this.enemies.children.iterate(function (enemy) {
        if (!enemy.body.velocity.x) {
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
}

function hitEnemy(player, enemy) {
    if (!invulnerable) {
        lives -= 1;
        croissants[lives].destroy(); 
        console.log(`Vidas restantes: ${lives}`);
        if (lives <= 0) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
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

function adjustCameraZoom() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 768) {
        game.scene.scenes[0].cameras.main.setZoom(0.75);
    } else {
        game.scene.scenes[0].cameras.main.setZoom(1);
    }
}

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    adjustCameraZoom();
});

window.game = game;
