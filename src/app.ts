import * as PIXI from 'pixi.js';
import { Graphics, Text, TextStyle } from 'pixi.js';

declare var noise: any;

const width = 800,
      height = 800,
      resolution = 5,
      noiseScale = 25; // bigger => softer land features

const colorMap = [
  {
    max: -0.4,
    color: 0x496e5, // water
  },
  {
    max: -0.35,
    color: 0xd3930a, // sand
  }, {
    max: 0.25,
    color: 0x59b513, // grass
  }, {
    max: 0.5,
    color: 0x37a80f, // dark grass
  }, {
    max: 2,
    color: 0x606b68, // mountain
  }
];

let type = 'WebGL';
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas';
}

const app = new PIXI.Application({
  width,
  height,
});
document.body.appendChild(app.view);

function getNoise(x: number, y: number) {
  return 1 * noise.perlin2(x / (noiseScale * 1), y / (noiseScale * 1))
         +  0.5 * noise.perlin2(x / (noiseScale * 2), y / (noiseScale * 2))
         + 0.25 * noise.perlin2(x / (noiseScale * 4), y / (noiseScale * 2));
}

let min = 1;
let max = 0;

noise.seed(Math.random());

for (var x = 0; x < width / resolution; x++) {
  for (var y = 0; y < height / resolution; y++) {
    var value = getNoise(x, y);

    min = Math.min(min, value);
    max = Math.max(max, value);

    // get a color from this value
    const color = colorMap.find(colors => colors.max >= value).color;

    const rectangle = new Graphics();
    rectangle.beginFill(color);
    rectangle.drawRect(0, 0, resolution, resolution);
    rectangle.endFill();
    rectangle.x = x * resolution;
    rectangle.y = y * resolution;
    app.stage.addChild(rectangle);
  }
}

app.stage.filters = [];

// const rectangle = new Graphics();
// rectangle.lineStyle(4, 0xFF3300, 1);
// rectangle.beginFill(0x66CCFF);
// rectangle.drawRect(0, 0, 64, 64);
// rectangle.endFill();
// rectangle.x = 170;
// rectangle.y = 170;
// app.stage.addChild(rectangle);

// const textStyle = new TextStyle({
//   fontFamily: "Arial",
//   fontSize: 16,
//   fill: "#fff",
// });

// const message = new Text("Hive v1.0", textStyle);
// app.stage.addChild(message);
