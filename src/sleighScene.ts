import { EntityScrollManager } from "./entityScrollManager";
import sleighUrl from "./images/sleigh.png";
import { PerlinNoise, PerlinOctave } from "./perlinNoise";

export class SleighScene extends Phaser.Scene {
  private static readonly snowPadding = 10;
  private static readonly snowWidth = 500;

  private sleigh?: Phaser.Physics.Matter.Image;
  private noise: PerlinNoise;

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

  private getSnowVerts(xStart: number) {
    const numVerts = 75;
    const verts: { x: number; y: number }[] = [];

    for (let i = 0; i < numVerts; i++) {
      const x = (i / (numVerts - 1)) * SleighScene.snowWidth;
      verts.push({
        x,
        y: this.noise.sample(x + xStart),
      });
    }

    verts.push({
      x: SleighScene.snowWidth,
      y: this.totalPerlinAmplitude + SleighScene.snowPadding,
    });
    verts.push({
      x: 0,
      y: this.totalPerlinAmplitude + SleighScene.snowPadding,
    });

    return verts;
  }

  private createSnowPart(xStart: number) {
    const snowVerts = this.getSnowVerts(xStart);

    const snow = this.matter.add.gameObject(
      this.add.polygon(0, 0, snowVerts, 0xffffff, 1),
      {
        shape: {
          type: "fromVerts",
          verts: snowVerts,
        },
        isStatic: true,
        collisionFilter: {
          group: -1,
        },
      }
    ) as Phaser.Physics.Matter.Image;

    const { centerOffset } = snow.body as MatterJS.BodyType;

    snow.setPosition(
      xStart + centerOffset.x,
      this.game.canvas.height -
        this.totalPerlinAmplitude -
        SleighScene.snowPadding +
        centerOffset.y
    );

    return snow;
  }

  preload() {
    this.load.image("sleigh", sleighUrl);
  }

  create() {
    this.noise = new PerlinNoise(
      this.perlinOctaves,
      new Date().getMilliseconds()
    );

    this.input.keyboard?.on("keydown-R", () => {
      this.scene.restart();
    });

    const sleighInitialX = 300;

    this.add.existing(
      new EntityScrollManager(this, SleighScene.snowWidth, (x) =>
        this.createSnowPart(x)
      )
    );

    const sleighImage = this.add.image(
      sleighInitialX,
      this.noise.sample(sleighInitialX) +
        this.game.canvas.height -
        SleighScene.snowPadding -
        500,
      "sleigh"
    );

    this.sleigh = (
      this.matter.add.gameObject(sleighImage, {
        shape: {
          type: "fromVerts",
          verts: [
            {
              x: 201,
              y: 118,
            },
            {
              x: 189,
              y: 133,
            },
            {
              x: 168,
              y: 141,
            },
            {
              x: 2,
              y: 140,
            },
            {
              x: 6,
              y: 67,
            },
            {
              x: 91,
              y: 2,
            },
            {
              x: 111,
              y: 2,
            },
            {
              x: 176,
              y: 75,
            },
          ],
        },
      }) as Phaser.Physics.Matter.Image
    )
      .setFriction(0, 0.02)
      .setBounce(0.2);

    this.cameras.main.startFollow(this.sleigh);
    this.cameras.main.followOffset.set(this.game.canvas.width / -2 + 300, 0);
    this.cameras.main.setBounds(0, 0, Number.POSITIVE_INFINITY, 0);
  }

  update() {
    this.sleigh!.thrust(0.02);
  }
}
