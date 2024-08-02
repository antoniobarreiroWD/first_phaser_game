class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        let titleStyle = { 
            fontSize: '48px', 
            fill: '#fff',
            fontFamily: 'Ranchers',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#333', blur: 5, stroke: true, fill: true }
        };
        let buttonStyle = { 
            fontSize: '32px', 
            fill: '#fff',
            fontFamily: 'Ranchers',
         };

        if (window.innerWidth < 990) {
            titleStyle.fontSize = '32px';
            buttonStyle.fontSize = '24px';
        }

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', titleStyle).setOrigin(0.5);
        let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Restart', buttonStyle).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            window.location.reload();
        });
    }
}

export default GameOverScene;
