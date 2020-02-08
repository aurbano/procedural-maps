export type Options = {
  width: number,
  height: number,
  mapContainerId: string,

  resolution: number,
  mapScale: number,
  moistureScale: number,

  waterMaxElevation: number,
  sandMaxElevation: number,

  rockMinElevation: number,

  grassMinMoisture: number,
  tallGrassMinElevation: number,
  tallGrassMinMoisture: number,

  forestMinMoisture: number,
  forestMaxMoisture: number,
  forestMaxElevation: number,
};
