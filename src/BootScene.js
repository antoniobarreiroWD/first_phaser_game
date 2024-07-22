// BootScene.js
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Carga los recursos necesarios para la escena inicial
        this.load.image('sky', 'assets/sky.png');
        // Puedes cargar otros recursos aquí si es necesario
    }

    create() {
        // Transición a GameScene
        this.scene.start('GameScene');
    }
}

export default BootScene;
