import sleighUrl from "./images/sleigh.png";
import { PerlinNoise, PerlinOctave } from "./perlinNoise";

export class SleighScene extends Phaser.Scene {
  private static readonly snowPadding = 50;

  private sleigh?: Phaser.Physics.Matter.Image;
  private readonly noise: PerlinNoise;

  private readonly perlinOctaves: PerlinOctave[] = [
    {
      amplitude: 200,
      interval: 900,
    },
    {
      amplitude: 70,
      interval: 500,
    },
    {
      amplitude: 20,
      interval: 100,
    },
  ];

  private readonly totalPerlinAmplitude: number = this.perlinOctaves.reduce(
    (result, { amplitude }) => result + amplitude,
    0
  );

  constructor() {
    super({
      physics: {
        default: "matter",
        matter: {
          gravity: {
            y: 2.5,
          },
        },
      },
    });

    this.noise = new PerlinNoise(
      this.perlinOctaves,
      new Date().getMilliseconds()
    );
  }

  private getSnowVerts() {
    const numVerts = 75;
    const verts: { x: number; y: number }[] = [];

    for (let i = 0; i < numVerts; i++) {
      const x = (i / (numVerts - 1)) * this.game.canvas.width;
      verts.push({
        x,
        y: this.noise.sample(x),
      });
    }

    for (let i = numVerts - 1; i >= 0; i--) {
      const x = (i / (numVerts - 1)) * this.game.canvas.width;
      verts.push({
        x,
        y: this.totalPerlinAmplitude + SleighScene.snowPadding,
      });
    }

    return verts;
  }

  private createSnowPart() {
    const snowVerts = this.getSnowVerts();

    return this.matter.add.gameObject(
      this.add.polygon(0, 0, snowVerts, 0xffffff, 1),
      {
        shape: {
          type: "fromVerts",
          verts: snowVerts,
        },
        isStatic: true,
      }
    ) as Phaser.Physics.Matter.Image;
  }

  preload() {
    this.load.image("sleigh", sleighUrl);
  }

  create() {
    this.input.keyboard?.on("keydown-R", () => {
      this.scene.restart();
    });

    const sleighImage = this.add.image(
      300,
      this.noise.sample(300) - 200,
      "sleigh"
    );

    this.sleigh = (
      this.matter.add.gameObject(sleighImage) as Phaser.Physics.Matter.Image
    )
      .setFriction(0)
      .setScale(0.5)
      .setBounce(0.2);

    this.cameras.main.startFollow(this.sleigh);
    this.cameras.main.followOffset.set(this.game.canvas.width / -2 + 300, 0);
    this.cameras.main.setBounds(0, 0, Number.POSITIVE_INFINITY, 0);

    const snowPart = this.createSnowPart();

    snowPart.setPosition(
      snowPart.width / 2,
      this.game.canvas.height - snowPart.height / 2
    );
  }

  update() {
    this.sleigh!.applyForce(new Phaser.Math.Vector2(0.02, 0));
  }
}
