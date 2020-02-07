import { Options } from "../app";
import * as SimplexNoise from 'simplex-noise';

export enum CELL_TYPES {
  ANT = -1,
  COLONY = -2,
  GRASS = 0,
  FOREST = 1,
  WATER = 2,
  DEEP_WATER = 3,
  ROCK = 4,
  SAND = 5,
};

const RANGES = {
  [CELL_TYPES.GRASS]: [0, 1],
};

export type Map = Array<Array<CELL_TYPES>>;


/**
 * Map generation
 * Support for elevation and moisture
 */
export const genMap = (simplexNoise: SimplexNoise, options: Options): Map => {
  const map: Map = [];

  const elevationMap: Array<Array<number>> = [];
  const moistureMap: Array<Array<number>> = [];

  for (let x = 0; x < options.width / options.resolution; x++) {
    map[x] = [];

    for (let y = 0; y < options.height / options.resolution; y++) {
      const value = getNoise(simplexNoise, x, y, options);

      // TODO Calculate type of block for this coordinates
      map[x][y] = value;
    }
  }

  return map;
};

/**
 * Get noise in the [0, 1] range
 * @param x
 * @param y
 */
function getNoise(simplexNoise: SimplexNoise, x: number, y: number, options: Options) {
  const noiseValue = simplexNoise.noise2D(
      x / options.mapScale,
      y / options.mapScale
    );
  return noiseValue / 2 + 0.5;
}
