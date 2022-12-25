import sleighUrl from "./images/sleigh.png";

export class SleighScene extends Phaser.Scene {
  private static readonly snowHeightMax = 40;
  private static readonly snowPadding = 50;

  private sleigh?: Phaser.Physics.Matter.Image;

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
  }

  private getSnowVerts() {
    const numVerts = 20;
    const verts: { x: number; y: number }[] = [];

    for (let i = 0; i < numVerts; i++) {
      verts.push({
        x: (i / (numVerts - 1)) * this.game.canvas.width,
        y: Phaser.Math.Between(0, SleighScene.snowHeightMax),
      });
    }

    verts.push(
      {
        x: this.game.canvas.width,
        y: SleighScene.snowHeightMax + SleighScene.snowPadding,
      },
      { x: 0, y: SleighScene.snowHeightMax + SleighScene.snowPadding }
    );

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
    const sleighImage = this.add.image(
      300,
      this.game.canvas.height / 2,
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
