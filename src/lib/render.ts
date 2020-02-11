import * as SimplexNoise from 'simplex-noise';
import * as PIXI from 'pixi.js';

import { Options } from '../model/types';
import { genMap, CELL_TYPES } from './genMap';

const TEXTURE_SIZE = 100;

type TextureCache = {
  [key: string]: PIXI.Texture;
}

export class Renderer {
  private elevationNoise: SimplexNoise;
  private moistureNoise: SimplexNoise;

  private app: PIXI.Application;
  private scene: PIXI.Graphics;
  private spriteGraphics: PIXI.Graphics;

  private textureCache: TextureCache = {};

  private timers = {
    seed: 0,
    render: 0,
  };

  constructor(private options: Options, private colorMap: any) {
    this.spriteGraphics = new PIXI.Graphics();

    this.app = new PIXI.Application({
      width: options.width,
      height: options.height,
    });

    this.scene = new PIXI.Graphics();
    this.app.stage.addChild(this.scene);

    // Render the app
    document.getElementById(this.options.mapContainerId).appendChild(this.app.view);
  }

  public seed = () => {
    this.timers.seed = performance.now();
    this.elevationNoise = new (SimplexNoise as any).default();
    this.moistureNoise = new (SimplexNoise as any).default();

    const seedTimer = performance.now() - this.timers.seed;
    document.getElementById('seed').innerText = `${Math.ceil(seedTimer)}ms`;

    this.render();
  }

  /**
   * Update the sprite cache for Pixijs
   * Basically this creates a square of the given resolution for each terrain type
   * this is then used instead of redrawing rectangles, which is a lot faster
   */
  public calculateSprites = () => {
    const textureMap: any = {
      [CELL_TYPES.FOREST]: 'conifer_forest/conifer_forest_inner',
      [CELL_TYPES.ROCK]: 'mountains/mountains_inner',
      [CELL_TYPES.ROCK+'_east']: 'mountains/mountains_east_1',
      [CELL_TYPES.ROCK+'_west']: 'mountains/mountains_west_1',
      [CELL_TYPES.ROCK+'_south']: 'mountains/mountains_south_1',
      [CELL_TYPES.ROCK+'_north']: 'mountains/mountains_north_1',
      [CELL_TYPES.ROCK+'_outer']: 'mountains/mountains_outer',
      [CELL_TYPES.WATER]: 'ocean/ocean_inner',
      [CELL_TYPES.WATER+'_east']: 'ocean/ocean_east_1',
      [CELL_TYPES.WATER+'_west']: 'ocean/ocean_west_1',
      [CELL_TYPES.WATER+'_south']: 'ocean/ocean_south_1',
      [CELL_TYPES.WATER+'_north']: 'ocean/ocean_north_1',
      [CELL_TYPES.WATER+'_outer']: 'ocean/ocean_outer_1',
      [CELL_TYPES.DEEP_WATER]: 'ocean/ocean_inner',
    };
    Object.keys(textureMap).forEach(key => {
      const texture = PIXI.Texture.from('src/assets/tiles/realistic/' + textureMap[key] + '.png');
      this.textureCache[key] = texture;
    });
    Object.keys(this.colorMap).forEach(key => {
      if (this.textureCache[key]) {
        return;
      }
      this.spriteGraphics.beginFill(this.colorMap[key]);
      this.spriteGraphics.lineStyle(0);
      this.spriteGraphics.drawRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      this.spriteGraphics.endFill();

      const region = new PIXI.Rectangle(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      const texture = this.app.renderer.generateTexture(this.spriteGraphics, 1, 1, region);
      this.textureCache[key] = texture;
    });
  }

  /**
   * Render the map with the given seed and options
   */
  public render = () => {
    this.timers.render = performance.now();

    this.scene.removeChildren()
    this.scene.clear();

    this.scene.beginFill(this.colorMap[CELL_TYPES.GRASS]);
    this.scene.lineStyle(0);
    this.scene.drawRect(0, 0, this.options.width, this.options.height);
    this.scene.endFill();

    const map = genMap(this.elevationNoise, this.moistureNoise, this.options);
    const spriteScale = 0.5;

    // Render the map
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[0].length; y++) {
        let value: any = map[x][y];

        // determine the type based on the neighbours
        const neighbours = [];
        for(let xx = 0; xx <= 2; xx++ ) {
          neighbours[xx] = [];
          for(let yy = 0; yy <= 2; yy++ ) {
            const dx = xx-1;
            const dy = yy-1;
            let isSame = true
            if (map[x + dx]) {
              isSame = map[x + dx][y + dy] === value;
            }
            neighbours[xx][yy] = isSame;
          }
        }

        if (!neighbours[1][0]) {
          value = value + '_north';
        } else if (!neighbours[1][2]) {
          value = value + '_south';
        }

        const texture = this.textureCache[value];
        const sprite = new PIXI.Sprite(texture);
        sprite.interactiveChildren = false;

        sprite.scale.set(spriteScale, spriteScale);

        sprite.position.x = x * this.options.resolution;
        sprite.position.y = y * this.options.resolution;

        this.scene.addChild(sprite);
      }
    }

    this.app.render();

    const renderTimer = performance.now() - this.timers.render;
    document.getElementById('render').innerText = `${Math.ceil(renderTimer)}ms`;
  }
}
