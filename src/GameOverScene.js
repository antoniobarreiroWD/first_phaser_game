class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        let titleStyle = { fontSize: '48px', fill: '#fff' };
        let buttonStyle = { fontSize: '32px', fill: '#fff' };

        if (window.innerWidth < 800) {
            titleStyle.fontSize = '32px';
            buttonStyle.fontSize = '24px';
        }

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', titleStyle).setOrigin(0.5);
        let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Restart', buttonStyle).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}

export default GameOverScene;