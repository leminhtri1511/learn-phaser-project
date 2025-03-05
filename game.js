const config = {
    type: Phaser.AUTO,
    width: 360, // Chiều rộng của điện thoại
    height: 640, // Chiều cao của điện thoại
    scale: {
        mode: Phaser.Scale.FIT, // Tự động căn chỉnh
        autoCenter: Phaser.Scale.CENTER_BOTH // Căn giữa màn hình
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


const game = new Phaser.Game(config);
let player, cursors;

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/platforms/platform.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Thêm background
    this.add.image(180, 320, 'sky'); // Căn giữa với kích thước mới

    // Tạo nền tảng (Mặt đất)
    let ground = this.physics.add.staticGroup();
    ground.create(180, 620, 'ground').setScale(1.5).refreshBody();

    // Tạo nhân vật chính
    player = this.physics.add.sprite(180, 500, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Va chạm giữa nhân vật và mặt đất
    this.physics.add.collider(player, ground);

    // Điều khiển bằng bàn phím
    cursors = this.input.keyboard.createCursorKeys();
}


function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    // Kiểm tra điều kiện nhảy
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-400);
    }

    // Nếu nhân vật rơi khỏi màn hình, reset vị trí
    if (player.y > 640) {
        player.setPosition(180, 500);
    }
}