class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    

    create() {
       
        document.fonts.ready.then(() => {
            this.createTitleScene();
        });
    }

    createTitleScene() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

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
            fill: '#f5a623', 
            fontFamily: 'Ranchers',
            backgroundColor: 'black', 
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        };

        if (width < 999) {
            titleStyle.fontSize = '32px';
            buttonStyle.fontSize = '24px';
        }

        if (width < 420) {
            titleStyle.fontSize = '18px';
            buttonStyle.fontSize = '16px';
        }

        this.titleText = this.add.text(width / 2, height / 2 - 100, 'Las aventuras de Mairim', titleStyle).setOrigin(0.5);

        this.playButton = this.add.text(width / 2, height / 2 + 100, 'Play', buttonStyle).setOrigin(0.5);

        this.playButton.setInteractive();
        this.playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        let width = gameSize.width;
        let height = gameSize.height;

        this.titleText.setPosition(width / 2, height / 2 - 100);
        this.playButton.setPosition(width / 2, height / 2 + 100);
    }
}

export default TitleScene;
