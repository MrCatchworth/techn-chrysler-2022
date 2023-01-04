import { cosineInterpolate } from "./cosineInterpolate";
import { intHash } from "./intHash";

export interface PerlinOctave {
  interval: number;
  amplitude: number;
}

export class PerlinNoise {
  constructor(
    private readonly octaves: PerlinOctave[],
    private readonly seed: number
  ) {}

  private getRandomValue(x: number): number {
    return Math.abs(intHash(x + this.seed)) / 2 ** 31;
  }

  sample(x: number): number {
    let value = 0;

    for (const { interval, amplitude } of this.octaves) {
      const octaveStart = Math.floor(x / interval) * interval;
      const octaveEnd = octaveStart + interval;

      const valueAtStart = this.getRandomValue(octaveStart) * amplitude;
      const valueAtEnd = this.getRandomValue(octaveEnd) * amplitude;

      const fractionFromStart = (x - octaveStart) / interval;

      value += cosineInterpolate(valueAtStart, valueAtEnd, fractionFromStart);
    }

    return value;
  }
}
