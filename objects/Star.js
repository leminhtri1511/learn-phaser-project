export default class Star {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 50, y: 0, stepX: 60 }
        });

        this.group.children.iterate(function (star) {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    collectStar(star) {
        star.disableBody(true, true); // Ẩn sao nhưng không ảnh hưởng nhân vật
    
        this.scene.score += 10;
        this.scene.scoreText.setText('Score: ' + this.scene.score);
    
        if (this.group.countActive(true) === 0) {
            this.group.children.iterate((star) => {
                star.enableBody(true, star.x, 0, true, true);
            });
        }
    }

    
    
}
