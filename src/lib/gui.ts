import * as dat from 'dat.gui';
import { Options } from '../model/types';
import { CELL_TYPES } from './genMap';

export function setupGui(options: Options, colorMap: any, methods: any, calculateSpritesAndRender: any, render: any) {
  const gui = new dat.GUI({
    name: 'Setings',
    closed: true,
  });

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
  colors.addColor(colorMap, CELL_TYPES.WATER.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.SAND.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.DRY_GRASS.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.GRASS.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.TALL_GRASS.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.FOREST.toString()).onChange(calculateSpritesAndRender);
  colors.addColor(colorMap, CELL_TYPES.ROCK.toString()).onChange(calculateSpritesAndRender);

  gui.add(methods, 'Regenerate');

  return gui;
}
