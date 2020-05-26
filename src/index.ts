import Phaser from 'phaser';

import MainScene from './MainScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false,
    },
  },
  scene: [MainScene],
};

new Phaser.Game(config);
