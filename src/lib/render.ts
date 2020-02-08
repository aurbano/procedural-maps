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
    Object.keys(this.colorMap).forEach(key => {
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

    const map = genMap(this.elevationNoise, this.moistureNoise, this.options);
    const spriteScale = this.options.resolution / TEXTURE_SIZE;

    // Render the map
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[0].length; y++) {
        const value: CELL_TYPES = map[x][y];
        const texture = this.textureCache[value];
        const sprite = new PIXI.Sprite(texture);
        sprite.interactiveChildren = false;

        sprite.scale.set(spriteScale, spriteScale)

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
