import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import * as pcTween from "./PlayCanvasTween";

@playCanvasScript("Tile")
export class Tile extends ScriptTypeBase {
  @attrib({
    type: "entity",
    title: "Front",
  })
  tileFront: pc.Entity;

  @attrib({
    type: "entity",
    title: "Back",
  })
  tileBack: pc.Entity;

  @attrib({
    type: "asset",
  })
  tileMatHidden: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace1: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace2: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace3: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace4: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace5: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace6: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace7: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace8: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace9: pc.Asset;

  @attrib({
    type: "asset",
  })
  tileMatFace10: pc.Asset;

  public isPaired: boolean;
  public isFlipped: boolean;
  public face: number;
  protected tweenFlip: pcTween.PcTween;
  protected pairedTile: pc.Entity;

  initialize(): void {
    //
  }

  setFace(face: number): void {
    this.face = face;
    switch (face) {
      case 0:
        this.tileFront.render.material = this.tileMatFace1
          .resource as pc.Material;
        break;
      case 1:
        this.tileFront.render.material = this.tileMatFace2
          .resource as pc.Material;
        break;
      case 2:
        this.tileFront.render.material = this.tileMatFace3
          .resource as pc.Material;
        break;
      case 3:
        this.tileFront.render.material = this.tileMatFace4
          .resource as pc.Material;
        break;
      case 4:
        this.tileFront.render.material = this.tileMatFace5
          .resource as pc.Material;
        break;
      case 5:
        this.tileFront.render.material = this.tileMatFace6
          .resource as pc.Material;
        break;
      case 6:
        this.tileFront.render.material = this.tileMatFace7
          .resource as pc.Material;
        break;
      case 7:
        this.tileFront.render.material = this.tileMatFace8
          .resource as pc.Material;
        break;
      case 8:
        this.tileFront.render.material = this.tileMatFace9
          .resource as pc.Material;
        break;
      case 9:
        this.tileFront.render.material = this.tileMatFace10
          .resource as pc.Material;
        break;
      default:
        this.tileFront.render.material = this.tileMatHidden
          .resource as pc.Material;
        break;
    }
  }

  flip(): void {
    if (this.isFlipped) {
      return;
    }
    if (this.tweenFlip) {
      this.tweenFlip.stop();
    }
    this.tweenFlip = this.entity
      .tween(this.entity.getLocalEulerAngles())
      .rotate(new pc.Vec3(0, 0, 180), 0.5, pcTween.BackOut)
      .start();
    this.isFlipped = true;
    this.entity.tags.add("FLIPPED");
  }

  resetFlip(): void {
    if (!this.isFlipped) {
      return;
    }
    if (this.tweenFlip) {
      this.tweenFlip.stop();
    }
    this.tweenFlip = this.entity
      .tween(this.entity.getLocalEulerAngles())
      .rotate(new pc.Vec3(0, 0, 0), 0.5, pcTween.BackOut)
      .start();
    this.isFlipped = false;
    this.entity.tags.remove("FLIPPED");
  }

  setPaired(pairedTile: pc.Entity): void {
    this.pairedTile = pairedTile;
    this.isPaired = true;
    this.entity.tags.add("PAIRED");
  }

  unpair(): void {
    this.isPaired = false;
    this.pairedTile = null;
    this.entity.tags.remove("PAIRED");
  }
}
