import Phaser from 'phaser';

import skyImg from './assets/sky.png';
import groundImg from './assets/platform.png';
import starImg from './assets/star.png';
import bombImg from './assets/bomb.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeLeftImg from './assets/generated/dude/walk-w.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeRightImg from './assets/generated/dude/walk-e.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeImg from './assets/generated/dude/walk-s.png';

class MainScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  stars!: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  bombs!: Phaser.Physics.Arcade.Group;
  gameOver = false;

  preload() {
    this.load.image('sky', skyImg);
    this.load.image('ground', groundImg);
    this.load.image('star', starImg);
    this.load.image('bomb', bombImg);
    this.load.spritesheet('dudeLeft', dudeLeftImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('dudeRight', dudeRightImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('dude', dudeImg, {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.3);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dudeLeft', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 0}],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dudeRight', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70},
    });

    this.stars.children.iterate(child => {
      (child as Phaser.Physics.Arcade.Image).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.8)
      );
    });

    this.physics.add.collider(this.stars, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    );

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    );
  }

  update() {
    if (this.gameOver) {
      return;
    }
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursors.up?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(
    _player: Phaser.GameObjects.GameObject,
    star: Phaser.GameObjects.GameObject
  ) {
    (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate(_child => {
        const child = _child as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });

      const x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  hitBomb() {
    this.physics.pause();

    this.player.setTint(0xff0000);

    this.player.anims.play('turn');

    this.gameOver = true;
  }
}

export default MainScene;
