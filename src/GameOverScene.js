class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}

export default GameOverScene;
