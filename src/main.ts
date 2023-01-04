import "phaser";
import "./style.css";
import { SleighScene } from "./sleighScene";

export const game = new Phaser.Game({
  type: Phaser.WEBGL,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    zoom: 1,
  },

  physics: {
    default: "matter",

    matter: {
      gravity: {
        y: 1,
      },
    },
  },

  backgroundColor: "#E0F0F2",

  scene: SleighScene,
});

(window as any)._game = game;
