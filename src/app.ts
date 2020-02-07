import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import * as dat from 'dat.gui';
import { genMap } from './lib/genMap';
import * as SimplexNoise from 'simplex-noise';

const gui = new dat.GUI({
  name: 'Setings',
});

let simplexNoise: any;

export type Options = {
  width: number,
  height: number,
  resolution: number,
  mapScale: number,
};

const options: Options = {
  width: 500,
  height: 500,
  resolution: 5,
  mapScale: 25, // bigger => softer land features
};

const methods = {
  regenerate: seed,
};

gui.add(options, 'resolution', 5, 50, 1).onFinishChange(render);
gui.add(options, 'mapScale', 1, 100, 1).onFinishChange(render);
gui.add(methods, 'regenerate');

const colorMap = [
  {
    max: 0.1,
    color: 0x496e5, // water
  },
  {
    max: 0.15,
    color: 0xd3930a, // sand
  }, {
    max: 0.6,
    color: 0x59b513, // grass
  }, {
    max: 0.8,
    color: 0x37a80f, // dark grass
  }, {
    max: 2,
    color: 0x606b68, // mountain
  }
];

const app = new PIXI.Application({
  width: options.width,
  height: options.height,
});
document.getElementById('map').appendChild(app.view);

const timers = {
  seed: 0,
  render: 0,
};

/**
 * Generate a new seed and render the map
 */
function seed() {
  timers.seed = performance.now();
  simplexNoise = new (SimplexNoise as any).default();

  const seedTimer = performance.now() - timers.seed;
  document.getElementById('seed').innerText = `${Math.ceil(seedTimer)}ms`;

  render();
}

/**
 * Render the map with the given seed and options
 */
function render() {
  timers.render = performance.now();

  const map = genMap(simplexNoise, options);

  // Render the map
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      const value = map[x][y];

      // TODO: This should just come from the type of block at some point
      const color = colorMap.find(colors => colors.max >= value).color;

      const rectangle = new Graphics();
      rectangle.beginFill(color);
      rectangle.drawRect(0, 0, options.resolution, options.resolution);
      rectangle.endFill();
      rectangle.x = x * options.resolution;
      rectangle.y = y * options.resolution;
      app.stage.addChild(rectangle);
    }
  }

  const renderTimer = performance.now() - timers.render;
  document.getElementById('render').innerText = `${Math.ceil(renderTimer)}ms`;
}

seed();

// Enable filters on the app
app.stage.filters = [];
