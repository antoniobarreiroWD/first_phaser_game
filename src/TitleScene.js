class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        let titleStyle = { fontSize: '48px', fill: '#fff' };
        let buttonStyle = { fontSize: '32px', fill: '#fff' };

        if (window.innerWidth < 800) {
            titleStyle.fontSize = '32px';
            buttonStyle.fontSize = '24px';
        }

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Las aventuras de Mairim', titleStyle).setOrigin(0.5);
        let playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Play', buttonStyle).setOrigin(0.5);
        
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default TitleScene;