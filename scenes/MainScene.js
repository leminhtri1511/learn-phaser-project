import Player from "../objects/Player.js";
import Star from "../objects/Star.js";
import Enemy from "../objects/enemy.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/platforms/platform.png');
        this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        // this.load.spritesheet('dude', 'https://i.postimg.cc/KzWJtyXr/c-nhi.jpg', { frameWidth: 64, frameHeight: 96 });
        this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png'); // Ảnh kẻ địch

    }

    create() {
        // Thêm nền trời
        this.add.image(180, 320, 'sky');

        // Tạo mặt đất
        let ground = this.physics.add.staticGroup();
        let groundTile = ground.create(180, 620, 'ground');
        groundTile.setScale(20, 1).refreshBody();

        // Tạo nhân vật
        this.player = new Player(this, 50, 550);

        // // Tạo vật phẩm (stars)
        // this.stars = new Star(this);

        // Tạo kẻ địch
        this.enemy = new Enemy(this, this.scale.width - 50, 550);


        // Biến quản lý máu nhân vật
        this.playerHP = 3; // Nhân vật có 3 máu ban đầu
        this.hpText = this.add.text(16, 40, 'HP: ' + this.playerHP, { fontSize: '20px', fill: '#fff' });

        // Xử lý va chạm giữa các đối tượng
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemy, ground);
        this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this);

        // Xử lý khi nhân vật thu thập vật phẩm
        // this.physics.add.overlap(this.player, this.stars.group, (player, star) => {
        //     this.stars.collectStar(star);
        // }, null, this);

        // // Hiển thị điểm số
        // this.score = 0;
        // this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    }


    hitEnemy(player, enemy) {
        if (this.playerHP > 1) {
            this.playerHP--; // Giảm máu của nhân vật
            this.hpText.setText('HP: ' + this.playerHP); // Cập nhật hiển thị máu
            console.log(`Nhân vật bị tấn công! Máu còn lại: ${this.playerHP}`);

            // Rung màn hình khi bị tấn công
            this.cameras.main.shake(80, 0.01);

            // Xác định hướng va chạm dựa trên hướng di chuyển của kẻ địch
            let knockBackDirection = (enemy.body.velocity.x > 0) ? 1 : -1; // Nếu enemy đi phải -> knockBack trái, ngược lại
            player.setVelocityX(knockBackDirection * 200); // Đẩy nhân vật ra xa theo hướng ngược lại
            enemy.setVelocityX(-knockBackDirection * 200); // Đẩy kẻ địch ngược lại để tạo phản lực

            // Cả hai bị đẩy lên nhẹ để tạo cảm giác va chạm mạnh
            player.setVelocityY(-150);
            enemy.setVelocityY(-100);

            // Nhấp nháy nhân vật sau khi bị đánh
            player.setTint(0xff0000);
            enemy.setTint(0xff0000);
            this.time.delayedCall(500, () => {
                player.clearTint();
                enemy.clearTint();
            }, [], this);
        } else {
            // Nếu máu về 0, dừng game
            this.playerHP = 0;
            this.hpText.setText('HP: 0');
            console.log("Nhân vật đã hết máu! Game Over!");

            // Rung màn hình mạnh hơn khi chết
            this.cameras.main.shake(150, 0.02);

            player.setTint(0xff0000);
            player.setVelocity(0, 0);

            // Dừng enemy di chuyển
            enemy.setVelocity(0, 0);
            this.isGameOver = true;
        }
    }

    update() {
        if (!this.isGameOver) {
            this.player.update();
        }
        this.enemy.update();
        // this.stars.update(); // Cập nhật sao (để xóa khi rơi khỏi màn hình)
    }
}
