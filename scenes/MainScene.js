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
        this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png'); // Ảnh kẻ địch
    }

    create() {
        // Đảm bảo trạng thái game được reset
        this.isGameOver = false;
        this.isHit = false;

        // Thêm nền trời
        this.add.image(180, 320, 'sky');

        // Tạo mặt đất
        let ground = this.physics.add.staticGroup();
        let groundTile = ground.create(180, 620, 'ground');
        groundTile.setScale(20, 1).refreshBody();

        // Tạo nhân vật
        this.player = new Player(this, 50, 550);

        // Biến kiểm soát trạng thái bị đánh
        this.isHit = false;

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
        this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);



        // Xử lý khi nhân vật thu thập vật phẩm
        // this.physics.add.overlap(this.player, this.stars.group, (player, star) => {
        //     this.stars.collectStar(star);
        // }, null, this);

        // // Hiển thị điểm số
        // this.score = 0;
        // this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    }

    hitEnemy(player, enemy) {
        if (this.isHit || this.isGameOver) return; // Nếu vừa bị đánh hoặc game over, bỏ qua

        this.isHit = true;

        if (this.playerHP > 1) {
            this.playerHP--;
            this.hpText.setText('HP: ' + this.playerHP);
            console.log(`Nhân vật bị tấn công! Máu còn lại: ${this.playerHP}`);

            // Rung màn hình khi bị tấn công
            this.cameras.main.shake(80, 0.01);

            // Đẩy nhân vật ra xa
            let knockBackDirection = (enemy.body.velocity.x > 0) ? 1 : -1;
            player.setVelocityX(knockBackDirection * 200);
            enemy.setVelocityX(-knockBackDirection * 200);

            // Đẩy lên nhẹ
            player.setVelocityY(-150);
            enemy.setVelocityY(-100);

            // Nhấp nháy nhân vật
            player.setTint(0xff0000);
            enemy.setTint(0xff0000);
            this.time.delayedCall(500, () => {
                player.clearTint();
                enemy.clearTint();
            }, [], this);

            this.time.delayedCall(500, () => {
                this.isHit = false;
            }, [], this);

        } else {
            this.gameOver("Nhân vật hết máu");
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.velocity.y > 0 && player.body.bottom < enemy.body.top + 5) {
            console.log("💥 Kẻ địch bị tiêu diệt!");
    
            // Vô hiệu hóa va chạm để tránh lỗi tiếp tục va chạm sau khi bị tiêu diệt
            enemy.body.enable = false;
    
            // Xóa kẻ địch khỏi game
            enemy.destroy();
    
            // Phản hồi cho nhân vật: bật lên nhẹ
            player.setVelocityY(-200);
    
            // Tăng điểm số
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
    
            // Kiểm tra nếu tất cả kẻ địch đã bị tiêu diệt
            let enemiesLeft = this.children.getChildren().some(child => child instanceof Enemy);
            if (!enemiesLeft) {
                this.youWon();
            }
        } else {
            this.hitEnemy(player, enemy);
        }
    }
    

    youWon() {
        if (this.isGameOver) return; // Nếu game đã kết thúc, không làm gì nữa
        this.isGameOver = true; // Đánh dấu trạng thái game over

        console.log("🎉 YOU WON!");

        // Dừng tất cả chuyển động
        this.physics.pause();

        // Hiển thị thông báo chiến thắng
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'YOU WON!', {
            fontSize: '40px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Tạo nút Play Again
        let playAgainButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Play Again', {
            fontSize: '25px',
            fill: '#ffffff',
            backgroundColor: '#00ff00',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Khi bấm nút Play Again, reset lại game đúng cách
        playAgainButton.on('pointerdown', () => {
            this.scene.restart(); // Dùng cách này để đảm bảo mọi thứ được reset đúng cách
        });
    }


    gameOver(reason) {
        if (this.isGameOver) return; // Nếu game đã kết thúc, không làm gì nữa
        this.isGameOver = true; // Đánh dấu trạng thái game over

        console.log("🔥 Game Over! Lý do:", reason);

        // Dừng tất cả chuyển động
        this.physics.pause();

        // Hiển thị thông báo Game Over
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'GAME OVER', {
            fontSize: '40px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Tạo nút Restart
        let restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Restart', {
            fontSize: '25px',
            fill: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Khi bấm nút Restart, reset lại game đúng cách
        restartButton.on('pointerdown', () => {
            this.scene.restart(); // Dùng cách này để đảm bảo mọi thứ được reset đúng cách
        });
    }


    restartGame() {
        console.log("🔄 Restarting game...");
    
        // Reset trạng thái game
        this.isGameOver = false;
        this.isHit = false;
        this.playerHP = 3;
    
        // Xóa văn bản Game Over và nút Restart nếu có
        this.children.each((child) => {
            if (child.type === "Text") {
                child.destroy();
            }
        });
    
        // Bật lại vật lý
        this.physics.resume();
    
        // Reset hiển thị máu
        this.hpText.setText('HP: ' + this.playerHP);
    
        // Reset nhân vật
        this.player.setPosition(50, 550);
        this.player.setTint(0xffffff);
    
        // Xóa và tạo lại enemy
        if (this.enemy) {
            this.enemy.destroy();
        }
        this.enemy = new Enemy(this, this.scale.width - 50, 550);
        this.physics.add.collider(this.enemy, this.ground);
        this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);
    
        console.log("✅ Game restarted!");
    }
    

    update() {
        if (!this.isGameOver) {
            this.player.update();
        }
        this.enemy.update();
        // this.stars.update(); // Cập nhật sao (để xóa khi rơi khỏi màn hình)
    }
}
