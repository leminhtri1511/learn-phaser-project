export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true); // Không ra khỏi màn hình
        this.setBounce(1); // Khi chạm tường, đổi hướng
        this.setVelocityX(100); // Bắt đầu di chuyển sang phải
    }

    update() {
        // Nếu chạm vào rìa màn hình, đổi hướng
        if (this.body.blocked.right) {
            this.setVelocityX(-100); // Đổi hướng sang trái
        } else if (this.body.blocked.left) {
            this.setVelocityX(100); // Đổi hướng sang phải
        }
    }

    // update() {
    //     let distance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

    //     if (distance < 200) { // Nếu nhân vật ở gần (dưới 200px)
    //         if (this.scene.player.x < this.x) {
    //             this.setVelocityX(-100); // Di chuyển về phía nhân vật
    //         } else {
    //             this.setVelocityX(100);
    //         }
    //     } else {
    //         // Nếu nhân vật không ở gần, di chuyển qua lại như bình thường
    //         if (this.body.blocked.right) {
    //             this.setVelocityX(-100);
    //         } else if (this.body.blocked.left) {
    //             this.setVelocityX(100);
    //         }
    //     }
    // }
}
