import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';
import { genMap, CELL_TYPES } from './lib/genMap';
import * as SimplexNoise from 'simplex-noise';

const gui = new dat.GUI({
  name: 'Setings',

});

let elevationNoise: any;
let moistureNoise: any;

export type Options = {
  width: number,
  height: number,
  resolution: number,
  mapScale: number,
  moistureScale: number,
  rockElevation: number,
  waterElevation: number,
  minimumWaterMoisture: number,
  sandElevation: number,
  grassMinimumMoisture: number,
  tallGrassMinimumMoisture: number,
  forestMinimumMoisture: number,
  forestMinimumElevation: number,
};

const options: Options = {
  width: 800,
  height: 600,
  resolution: 5,
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

const methods = {
  regenerate: seed,
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

const rendering = gui.addFolder('Rendering');
rendering.open();
rendering.add(options, 'resolution', 1, 50, 1).onChange(render);
rendering.add(options, 'mapScale', 1, 100, 1).onChange(render);
rendering.add(options, 'moistureScale', 1, 100, 1).onChange(render);

const dist = gui.addFolder('Distribution');
dist.open();
dist.add(options, 'waterElevation', 1, 100, 1).onChange(render);
dist.add(options, 'minimumWaterMoisture', 1, 100, 1).onChange(render);
dist.add(options, 'sandElevation', 1, 100, 1).onChange(render);
dist.add(options, 'rockElevation', 1, 100, 1).onChange(render);
dist.add(options, 'grassMinimumMoisture', 1, 100, 1).onChange(render);
dist.add(options, 'tallGrassMinimumMoisture', 1, 100, 1).onChange(render);
dist.add(options, 'forestMinimumMoisture', 1, 100, 1).onChange(render);
dist.add(options, 'forestMinimumElevation', 1, 100, 1).onChange(render);

const colors = gui.addFolder('Colors');
colors.open();
colors.addColor(colorMap, CELL_TYPES.WATER.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.SAND.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.DRY_GRASS.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.GRASS.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.TALL_GRASS.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.FOREST.toString()).onChange(render);
colors.addColor(colorMap, CELL_TYPES.ROCK.toString()).onChange(render);

gui.add(methods, 'regenerate');

const app = new PIXI.Application({
  width: options.width,
  height: options.height,
});
document.getElementById('map').appendChild(app.view);

const renderer = app.stage;
const scene = new PIXI.Graphics();
renderer.addChild(scene);

const timers = {
  seed: 0,
  render: 0,
};

/**
 * Generate a new seed and render the map
 */
function seed() {
  timers.seed = performance.now();
  elevationNoise = new (SimplexNoise as any).default();
  moistureNoise = new (SimplexNoise as any).default();

  const seedTimer = performance.now() - timers.seed;
  document.getElementById('seed').innerText = `${Math.ceil(seedTimer)}ms`;

  render();
}

/**
 * Render the map with the given seed and options
 */
function render() {
  timers.render = performance.now();

  scene.clear();

  const map = genMap(elevationNoise, moistureNoise, options);

  // Render the map
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      const value: CELL_TYPES = map[x][y];

      // TODO: This should just come from the type of block at some point
      const color: number = colorMap[value] || CELL_TYPES.GRASS;

      scene.beginFill(color);
      scene.drawRect(
        x * options.resolution,
        y * options.resolution,
        options.resolution,
        options.resolution
      );
    }
  }

  const renderTimer = performance.now() - timers.render;
  document.getElementById('render').innerText = `${Math.ceil(renderTimer)}ms`;
}

seed();

// Enable filters on the app
app.stage.filters = [];
