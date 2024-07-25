class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Las aventuras de Mairim', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        let playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Play', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default TitleScene;
