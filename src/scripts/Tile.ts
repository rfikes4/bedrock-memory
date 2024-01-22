import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";

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

  initialize(): void {
    //
  }

  setFace(face: number): void {
    // TODO: tileFront instead of tileBack
    switch (face) {
      case 0:
        this.tileBack.render.material = this.tileMatFace1
          .resource as pc.Material;
        break;
      case 1:
        this.tileBack.render.material = this.tileMatFace2
          .resource as pc.Material;
        break;
      case 2:
        this.tileBack.render.material = this.tileMatFace3
          .resource as pc.Material;
        break;
      case 3:
        this.tileBack.render.material = this.tileMatFace4
          .resource as pc.Material;
        break;
      case 4:
        this.tileBack.render.material = this.tileMatFace5
          .resource as pc.Material;
        break;
      case 5:
        this.tileBack.render.material = this.tileMatFace6
          .resource as pc.Material;
        break;
      case 6:
        this.tileBack.render.material = this.tileMatFace7
          .resource as pc.Material;
        break;
      case 7:
        this.tileBack.render.material = this.tileMatFace8
          .resource as pc.Material;
        break;
      case 8:
        this.tileBack.render.material = this.tileMatFace9
          .resource as pc.Material;
        break;
      case 9:
        this.tileBack.render.material = this.tileMatFace10
          .resource as pc.Material;
        break;
      default:
        this.tileBack.render.material = this.tileMatHidden
          .resource as pc.Material;
        break;
    }
  }
}
