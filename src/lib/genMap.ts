import { Options } from "../model/types";
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
  DRY_GRASS = 'DRY_GRASS',
  TALL_GRASS = 'TALL_GRASS',
};

export type Map = Array<Array<CELL_TYPES>>;

/**
 * Terrain is generated using two noise values, one for elevation and one for moisture
 * Elevation determines rocks and water. Moisture is used to introduce variance in the
 * space between water and rocks.
 *
 * Around mountains there should be tall grass
 * Forests should appear far from rocks, in places where moisture is not too large
 */
function getTerrain(o: Options, elevation: number, moisture: number): CELL_TYPES {
  const e = elevation * 100; // elevation [0, 100]
  const m = moisture * 100;  // moisture [0, 100]

  if (e < o.waterMaxElevation / 3) return CELL_TYPES.DEEP_WATER;
  if (e < o.waterMaxElevation) return CELL_TYPES.WATER;
  if (e < o.waterMaxElevation + o.sandMaxElevation) return CELL_TYPES.SAND;

  if (e > o.rockMinElevation) return CELL_TYPES.ROCK;
  if (e > o.rockMinElevation - o.sandMaxElevation) return CELL_TYPES.TALL_GRASS;

  if (m < o.grassMinMoisture) return CELL_TYPES.DRY_GRASS;
  if (e < o.forestMaxElevation && m > o.forestMinMoisture && m < o.forestMaxMoisture) return CELL_TYPES.FOREST;
  if (e > o.tallGrassMinElevation && m > o.tallGrassMinMoisture) return CELL_TYPES.TALL_GRASS;

  return CELL_TYPES.GRASS;
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
      const elevationValue = getNoise(elevationNoise, x, y, options.mapScale);
      const moistureValue = getNoise(moistureNoise, x, y, options.moistureScale);

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
function getNoise(simplexNoise: SimplexNoise, x: number, y: number, noiseScale: number) {
  const noiseValue = simplexNoise.noise2D(
      x / noiseScale,
      y / noiseScale
    );
  return noiseValue / 2 + 0.5;
}
