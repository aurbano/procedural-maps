import { CELL_TYPES } from './lib/genMap';
import { Options } from './model/types';
import { Renderer } from './lib/render';
import { setupGui } from './lib/gui';

const options: Options = {
  width: 800,
  height: 600,
  mapContainerId: 'map',

  resolution: 5,
  mapScale: 25, // bigger => softer land features
  moistureScale: 25, // bigger => softer land features

  waterMaxElevation: 15,
  sandMaxElevation: 2,

  rockMinElevation: 80,

  grassMinMoisture: 16,
  tallGrassMinElevation: 70,
  tallGrassMinMoisture: 40,

  forestMinMoisture: 40,
  forestMaxMoisture: 40,
  forestMaxElevation: 50,
};

const colorMap: any = {
  [CELL_TYPES.ANT]: 0x4611aa,
  [CELL_TYPES.COLONY]: 0xe51476,
  [CELL_TYPES.DEEP_WATER]: 0x077dbc,
  [CELL_TYPES.WATER]: 0x0a90d8,
  [CELL_TYPES.SAND]: 0xcea244,
  [CELL_TYPES.DRY_GRASS]: 0x73bb33,
  [CELL_TYPES.GRASS]: 0x59b513,
  [CELL_TYPES.TALL_GRASS]: 0x37a80f,
  [CELL_TYPES.FOREST]: 0x317515,
  [CELL_TYPES.ROCK]: 0x393f3e,
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
