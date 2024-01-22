import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TileManager } from "./TileManager";

@playCanvasScript("Raycast")
export class Raycast extends ScriptTypeBase {
  private hoveredElement: pc.ElementComponent;
  // private overUIElement: boolean;

  initialize(): void {
    // TODO: Adjust camera zoom
    // this.tileManager = this.getScript<TileManager>(this.entity, GameCamera.scriptName);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.on("destroy", () => {
      this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    });
  }

  raycast(e: pc.MouseEvent): pc.RaycastResult {
    const start = this.entity.camera.screenToWorld(
      e.x,
      e.y,
      this.entity.camera.nearClip
    );
    const end = this.entity.camera.screenToWorld(
      e.x,
      e.y,
      this.entity.camera.farClip
    );
    const result = this.app.systems.rigidbody.raycastFirst(start, end);
    return result;
  }

  raycastAll(e: pc.MouseEvent): pc.RaycastResult[] {
    const start = this.entity.camera.screenToWorld(
      e.x,
      e.y,
      this.entity.camera.nearClip
    );
    const end = this.entity.camera.screenToWorld(
      e.x,
      e.y,
      this.entity.camera.farClip
    );
    const results = this.app.systems.rigidbody.raycastAll(start, end);
    return results;
  }

  setCursor(style: "default" | "pointer"): void {
    if (document.body.style.cursor != style) document.body.style.cursor = style;
  }

  onMouseMove(e: pc.MouseEvent): void {
    this.hoveredElement = <pc.ElementComponent>(
      this.app.elementInput._hoveredElement
    );
    // this.overUIElement = !!this.hoveredElement;
    const result = this.raycast(e);
    if (result) {
      if (
        result.entity.tags.has("TILE") &&
        !result.entity.tags.has("FLIPPED") &&
        !result.entity.tags.has("PAIRED") &&
        TileManager.instance.canFlip
      ) {
        this.setCursor("pointer");
      }
    } else {
      this.setCursor("default");
    }
  }

  onMouseDown(e: pc.MouseEvent): void {
    const result = this.raycast(e);
    if (result) {
      if (
        result.entity.tags.has("TILE") &&
        !result.entity.tags.has("FLIPPED") &&
        !result.entity.tags.has("PAIRED") &&
        TileManager.instance.canFlip
      ) {
        TileManager.instance.flipTile(result.entity);
      }
    }
  }
}
