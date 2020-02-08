import { CELL_TYPES } from './lib/genMap';
import { Options } from './model/types';
import { Renderer } from './lib/render';
import { setupGui } from './lib/gui';

const options: Options = {
  width: 800,
  height: 600,
  mapContainerId: 'map',
  resolution: 20,
  mapScale: 25, // bigger => softer land features
  moistureScale: 25, // bigger => softer land features
  waterElevation: 15, // incremental percentage of water
  sandElevation: 5,
  minimumWaterMoisture: 20,
  rockElevation: 70,
  grassMinimumMoisture: 16,
  tallGrassMinimumMoisture: 30,
  forestMinimumMoisture: 33,
  forestMinimumElevation: 30,
};

const colorMap: any = {
  [CELL_TYPES.ANT]: 0x4611aa,
  [CELL_TYPES.COLONY]: 0xe51476,
  [CELL_TYPES.DEEP_WATER]: 0x496e5,
  [CELL_TYPES.WATER]: 0x496e5,
  [CELL_TYPES.SAND]: 0xcea244,
  [CELL_TYPES.DRY_GRASS]: 0x73bb33,
  [CELL_TYPES.GRASS]: 0x59b513,
  [CELL_TYPES.TALL_GRASS]: 0x37a80f,
  [CELL_TYPES.FOREST]: 0x317515,
  [CELL_TYPES.ROCK]: 0x606b68,
};

// Setup the Renderer
const renderer = new Renderer(options, colorMap);

const methods = {
  Regenerate: renderer.seed,
};

function calculateSpritesAndRender() {
  renderer.calculateSprites();
  renderer.render();
}

setupGui(options, colorMap, methods, calculateSpritesAndRender, renderer.render);

/**
 * Initial render
 */
renderer.calculateSprites();
renderer.seed();
