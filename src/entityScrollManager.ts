export class EntityScrollManager extends Phaser.GameObjects.GameObject {
  public static readonly gameObjectType = "entityScrollManager";

  private readonly activeSlices = new Map<
    number,
    Phaser.GameObjects.GameObject
  >();

  constructor(
    scene: Phaser.Scene,
    private readonly sliceWidth: number,
    private readonly instantiateAt: (
      start: number
    ) => Phaser.GameObjects.GameObject
  ) {
    super(scene, EntityScrollManager.gameObjectType);
  }

  preUpdate() {
    const {
      worldView: { x, width },
    } = this.scene.cameras.main;

    const visibleSliceStarts: number[] = [
      Math.floor(x / this.sliceWidth) * this.sliceWidth,
    ];
    for (
      let xSlice = visibleSliceStarts[0];
      xSlice <= x + width;
      xSlice += this.sliceWidth
    ) {
      visibleSliceStarts.push(xSlice);
    }

    const prevActiveSliceStarts = Array.from(this.activeSlices.keys());

    for (const visibleSliceStart of visibleSliceStarts) {
      if (!prevActiveSliceStarts.includes(visibleSliceStart)) {
        this.activeSlices.set(
          visibleSliceStart,
          this.instantiateAt(visibleSliceStart)
        );
      }
    }

    for (const activeSliceStart of prevActiveSliceStarts) {
      if (!visibleSliceStarts.includes(activeSliceStart)) {
        this.activeSlices.get(activeSliceStart)!.destroy();
        this.activeSlices.delete(activeSliceStart);
      }
    }
  }
}
