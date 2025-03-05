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
        console.log("Nhân vật chạm kẻ địch!");
        player.setTint(0xff0000); // Nhân vật chuyển sang màu đỏ khi va chạm
        player.setVelocity(0, 0); // Dừng di chuyển
        this.physics.pause(); // Dừng game (có thể thay đổi thành trừ điểm hoặc mất mạng sau này)
    }

    update() {
        this.player.update(); // Cập nhật di chuyển nhân vật
        this.enemy.update(); // Cập nhật kẻ địch
        // this.stars.update(); // Cập nhật sao (để xóa khi rơi khỏi màn hình)
    }
}
