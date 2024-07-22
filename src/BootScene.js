
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        
        this.load.image('sky', 'assets/sky.png');
        
    }

    create() {
        
        this.scene.start('GameScene');
    }
}

export default BootScene;
