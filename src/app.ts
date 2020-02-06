import * as PIXI from 'pixi.js';
import { Graphics, Text, TextStyle } from 'pixi.js';

let type = 'WebGL';
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas';
}

const app = new PIXI.Application({
  width: 512,
  height: 512,
});
document.body.appendChild(app.view);

// app.stage.filters = [new PIXI.filters.BlurFilter()];

const rectangle = new Graphics();
rectangle.lineStyle(4, 0xFF3300, 1);
rectangle.beginFill(0x66CCFF);
rectangle.drawRect(0, 0, 64, 64);
rectangle.endFill();
rectangle.x = 170;
rectangle.y = 170;
app.stage.addChild(rectangle);

const textStyle = new TextStyle({
  fontFamily: "Arial",
  fontSize: 16,
  fill: "#fff",
});

const message = new Text("Hive v1.0", textStyle);
app.stage.addChild(message);
