import { Options } from "../app";
import * as SimplexNoise from 'simplex-noise';

export enum CELL_TYPES {
  ANT = 'ANT',
  COLONY = 'COLONY',
  GRASS = 'GRASS',
  FOREST = 'FOREST',
  WATER = 'WATER',
  DEEP_WATER = 'DEEP_WATER',
  ROCK = 'ROCK',
  SAND = 'SAND',
  DESERT = 'DESERT',
  TALL_GRASS = 'TALL_GRASS',
};

export type Map = Array<Array<CELL_TYPES>>;

function getTerrain(options: Options, elevation: number, moisture: number): CELL_TYPES {
  const e = elevation * 100;
  const m = moisture * 100;

  if (e < options.waterElevation) return CELL_TYPES.WATER;
  if (e < options.waterElevation + options.sandElevation) return CELL_TYPES.SAND;

  if (e > options.waterElevation + options.sandElevation+ options.rockElevation) {
    return CELL_TYPES.ROCK;
  }

  if (m < options.grassMinimumMoisture) return CELL_TYPES.DESERT;
  if (m < options.grassMinimumMoisture + options.tallGrassMinimumMoisture) return CELL_TYPES.GRASS;
  if (m < options.grassMinimumMoisture + options.tallGrassMinimumMoisture + options.forestMinimumMoisture) return CELL_TYPES.TALL_GRASS;
  return CELL_TYPES.FOREST;
}

/**
 * Map generation
 * Support for elevation and moisture
 */
export const genMap = (elevationNoise: SimplexNoise, moistureNoise: SimplexNoise, options: Options): Map => {
  const map: Map = [];

  const elevationMap: Array<Array<number>> = [];
  const moistureMap: Array<Array<number>> = [];

  for (let x = 0; x < options.width / options.resolution; x++) {
    map[x] = [];

    for (let y = 0; y < options.height / options.resolution; y++) {
      const elevationValue = getNoise(elevationNoise, x, y, options);
      const moistureValue = getNoise(moistureNoise, x, y, options);

      // Now use the noise values to determine the block type
      const terrainType = getTerrain(options, elevationValue, moistureValue);

      map[x][y] = terrainType;
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
