import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { Tile } from "./Tile";

@playCanvasScript("TileManager")
export class TileManager extends ScriptTypeBase {
  @attrib({
    type: "asset",
    assetType: "template",
  })
  tile: pc.Asset;

  private pairs = 10; // 10 max level, 2 min
  private tilesPerRow = 4;
  private tileSize = 1;
  private gap = 0.2; // gap between tiles
  private tiles: pc.Entity[] = [];

  protected tileScript: Tile;

  initialize(): void {
    // Create tiles
    for (let i = 0; i < this.pairs * 2; i++) {
      const tile = (this.tile.resource as pc.Template).instantiate();
      this.tileScript = this.getScript<Tile>(tile, Tile.scriptName);
      console.log("tileScript", this.tileScript);
      // for every 2 tiles set the same face
      this.tileScript.setFace(Math.floor(i / 2));
      this.tiles.push(tile);

      // Calculate row and column indices
      const row = Math.floor(i / this.tilesPerRow);
      const col = i % this.tilesPerRow;

      tile.setLocalPosition(
        col * (this.tileSize + this.gap),
        0,
        row * (this.tileSize + this.gap)
      );

      this.entity.addChild(tile);
    }

    // Re-center tiles
    const numRows = (this.pairs * 2) / this.tilesPerRow;
    this.entity.setLocalPosition(
      (-this.tilesPerRow / 2) * (this.tileSize + this.gap) +
        (this.tileSize + this.gap) / 2,
      0,
      (-1 * ((numRows - 1) * (this.tileSize + this.gap))) / 2
    );

    // TODO: Adjust camera zoom
    // TODO: Shuffle tiles
  }
}
