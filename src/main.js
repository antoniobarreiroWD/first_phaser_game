import BootScene from './BootScene.js';
import GameScene from './GameScene.js';

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
    scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);


function resumeAudioContext() {
    if (game.sound.context.state === 'suspended') {
        game.sound.context.resume();
    }
}

window.addEventListener('click', resumeAudioContext);
window.addEventListener('touchstart', resumeAudioContext);

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.innerHeight > window.innerWidth) {
            requestFullScreen();
        }
        game.scale.resize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        if (game.scene.getScene('GameScene')) {
            game.scene.getScene('GameScene').adjustCameraZoom();
        }
    }, 500);
});

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    if (game.scene.getScene('GameScene')) {
        game.scene.getScene('GameScene').adjustCameraZoom();
    }
});

window.game = game;
