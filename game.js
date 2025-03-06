import MainScene from "./scenes/MainScene.js";

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [MainScene] // Load scene chính
};

const game = new Phaser.Game(config);


