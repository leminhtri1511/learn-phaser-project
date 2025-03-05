import Player from "../objects/Player.js";
import Star from "../objects/Star.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/platforms/platform.png');
        this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(180, 320, 'sky');

        let ground = this.physics.add.staticGroup();
        let groundTile = ground.create(180, 620, 'ground');
        groundTile.setScale(20, 1).refreshBody(); // Kéo dài toàn bộ chiều ngang
        
        this.player = new Player(this, 180, 500); // Tạo nhân vật từ class Player

        this.stars = new Star(this); // Tạo vật phẩm từ class Star

        this.physics.add.collider(this.player, ground);
        
        // this.physics.add.collider(this.stars.group, ground); // Cho stars chạm vào mặt đất (không văng ra màn hình)
        
        // this.physics.add.overlap(this.player, this.stars.group, this.stars.collectStar, null, this);
        this.physics.add.overlap(this.player, this.stars.group, (player, star) => {
            this.stars.collectStar(star);
        }, null, this);

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    }

    update() {
        this.player.update(); // Cập nhật di chuyển nhân vật
        // this.stars.update(); // Cập nhật sao (để xóa khi rơi khỏi màn hình)
    }
    
}
