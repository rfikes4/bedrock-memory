import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TJsonAttributeSchemaProp } from "../types/attributes";

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
    type: "json",
    schema: [
      {
        name: "material",
        type: "asset",
        assetType: "material",
      },
    ] as unknown as TJsonAttributeSchemaProp[],
    array: true,
  })
  tileFaces: pc.Asset[] = [];

  initialize(): void {}

  setFace(face: number): void {
    // this.tileFront.model.material = this.tileFaces[face];
    // this.tileBack.render.materialAssets[0]
    // this.tileBack.render.meshInstances[0].material =
    //   this.tileFaces[face].resource;
    // this.tileBack.render.material = this.tileFaces[face].resource;
    // this.tileBack.render!.material = this.tileFaces[face].resource;
    console.log(
      "setFace",
      face,
      this.tileBack.render.materialAssets[0],
      this.tileFaces[face]
    );
  }
}
