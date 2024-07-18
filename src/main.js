const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
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
        { x: 1200, y: 450 },
        { x: 1800, y: 450 },
        { x: 2400, y: 450 },
        { x: 3000, y: 450 },
        { x: 3600, y: 450 },
        { x: 4200, y: 450 }
    ];

    enemyPositions.forEach((pos) => {
        let enemy = this.enemies.create(pos.x, pos.y, 'zombieWalk1').setScale(0.4);
        enemy.setBounce(0.2);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocityX(Phaser.Math.Between(-70, 70)); 
    });

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);

    this.anims.create({
        key: 'enemyWalk',
        frames: [
            { key: 'zombieWalk1' },
            { key: 'zombieWalk2' },
            { key: 'zombieWalk3' },
            { key: 'zombieWalk4' },
            { key: 'zombieWalk5' },
            { key: 'zombieWalk6' }
        ],
        frameRate: 10,
        repeat: -1
    });

    this.enemies.children.iterate(function (enemy) {
        enemy.anims.play('enemyWalk', true);
    });

    
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const jumpButton = document.getElementById('jump-button');

    
    let moveLeft = false;
    let moveRight = false;

   
    leftButton.addEventListener('pointerdown', () => moveLeft = true);
    leftButton.addEventListener('pointerup', () => moveLeft = false);

    rightButton.addEventListener('pointerdown', () => moveRight = true);
    rightButton.addEventListener('pointerup', () => moveRight = false);

    jumpButton.addEventListener('pointerdown', () => {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    });

   
    this.input.addPointer(3);
    this.moveLeft = moveLeft;
    this.moveRight = moveRight;

    
    leftButton.addEventListener('pointerdown', () => this.moveLeft = true);
    leftButton.addEventListener('pointerup', () => this.moveLeft = false);

    rightButton.addEventListener('pointerdown', () => this.moveRight = true);
    rightButton.addEventListener('pointerup', () => this.moveRight = false);
}

function update() {
    if (this.cursors.left.isDown || this.moveLeft) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
        this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.moveRight) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
        this.player.setFlipX(false);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    if ((this.cursors.up.isDown || this.moveUp) && this.player.body.touching.down) {
        this.player.setVelocityY(-400); 
    }

    this.background.tilePositionX = this.cameras.main.scrollX * 0.5;

    this.enemies.children.iterate(function (enemy) {
        if (enemy.body.velocity.x < 0) {
            enemy.setFlipX(true);
        } else if (enemy.body.velocity.x > 0) {
            enemy.setFlipX(false);
        }

        if (enemy.body.blocked.left) {
            enemy.setVelocityX(70);
            enemy.setFlipX(false);
        } else if (enemy.body.blocked.right) {
            enemy.setVelocityX(-70);
            enemy.setFlipX(true);
        }
    });
}

function hitEnemy(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
