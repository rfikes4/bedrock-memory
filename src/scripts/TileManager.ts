import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { Tile } from "./Tile";

@playCanvasScript("Tiles")
export class Tiles extends ScriptTypeBase {
  @attrib({
    type: "asset",
    assetType: "template",
  })
  tile: pc.Asset;

  private pairs = 4; // 10 max level, 2 min
  private tilesPerRow = 4;
  private tileSize = 1;
  private gap = 0.2; // gap between tiles
  private tiles: pc.Entity[] = [];
  public flippedPair: pc.Entity[] = [];
  private pairedTiles: pc.Entity[] = [];
  protected checkingPair = false; // use this to prevent flipping more than 2 tiles at a time
  private resetFlipTimeout = 500;

  initialize(): void {
    TileManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Tiles>(this.entity, Tiles.scriptName)
    );
    // Create tiles

    this.createTiles();
    this.shuffleTiles();
    this.recenterTiles();

    // Re-center tiles

    // TODO: Adjust camera zoom
  }

  createTiles(): void {
    for (let i = 0; i < this.pairs * 2; i++) {
      const tile = (this.tile.resource as pc.Template).instantiate();
      tile.name = `Tile_${i}_Face_${Math.floor(i / 2) + 1}`;
      // tile.
      const tileScript = this.getScript<Tile>(tile, Tile.scriptName);
      // For every 2 tiles set the same face
      tileScript.setFace(Math.floor(i / 2));
      this.tiles.push(tile);

      this.entity.addChild(tile);
    }
  }

  recenterTiles(): void {
    const numRows = (this.pairs * 2) / this.tilesPerRow;
    this.entity.setLocalPosition(
      (-this.tilesPerRow / 2) * (this.tileSize + this.gap) +
        (this.tileSize + this.gap) / 2,
      0,
      (-1 * ((numRows - 1) * (this.tileSize + this.gap))) / 2
    );
  }

  shuffleTiles(): void {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }

    this.positionTiles();
  }

  positionTiles(): void {
    for (let i = 0; i < this.tiles.length; i++) {
      // Calculate row and column indices
      const row = Math.floor(i / this.tilesPerRow);
      const col = i % this.tilesPerRow;

      this.tiles[i].setLocalPosition(
        col * (this.tileSize + this.gap),
        0,
        row * (this.tileSize + this.gap)
      );
    }
  }

  flipTile(tile: pc.Entity): void {
    console.log("flipTile", tile.name);
    const tileScript = this.getScript<Tile>(tile, Tile.scriptName);
    if (tileScript.isFlipped || tileScript.isPaired || this.checkingPair) {
      return;
    }
    if (this.flippedPair.length < 2) {
      this.flippedPair.push(tile);
      tileScript.flip();
    }
    if (this.flippedPair.length == 2) {
      this.checkPair();
    }
  }

  checkPair(): void {
    this.checkingPair = true;
    const tile1Script = this.getScript<Tile>(
      this.flippedPair[0],
      Tile.scriptName
    );
    const tile2Script = this.getScript<Tile>(
      this.flippedPair[1],
      Tile.scriptName
    );
    if (tile1Script.face == tile2Script.face) {
      console.log("Pair found!");
      this.flippedPair = [];
      this.pairedTiles.push(this.flippedPair[0]);
      tile1Script.setPaired(this.flippedPair[1]);
      this.pairedTiles.push(this.flippedPair[1]);
      tile2Script.setPaired(this.flippedPair[0]);
      this.checkingPair = false;
      if (this.pairedTiles.length == this.pairs * 2) {
        console.log("You won!");
        // TODO: Show win screen
      }
    } else {
      console.log("Pair not found!");
      setTimeout(() => {
        tile1Script.resetFlip();
        tile2Script.resetFlip();
        this.flippedPair = [];
        this.checkingPair = false;
      }, this.resetFlipTimeout);
    }
  }

  // TODO: upair/resetFlip tiles on new game
}

export class TileManager {
  static readonly instance = new TileManager();
  protected tilesScript: Tiles;

  private constructor() {
    /**/
  }

  public initialize(tilesScript: Tiles): void {
    this.tilesScript = tilesScript;
  }

  public flipTile(tile: pc.Entity): void {
    this.tilesScript.flipTile(tile);
  }

  public get canFlip(): boolean {
    return this.tilesScript.flippedPair.length < 2;
  }
}
