import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { GameManager } from "./GameManager";

@playCanvasScript("LevelExitButton")
export class LevelExitButton extends ScriptTypeBase {
  initialize(): void {
    this.entity.button.on("mouseenter", this.onMouseEnter, this);
    this.entity.button.on("mouseleave", this.onMouseLeave, this);
    this.entity.button.on("click", this.onMouseDown, this);
  }

  setCursor(style: "default" | "pointer"): void {
    if (document.body.style.cursor != style) document.body.style.cursor = style;
  }

  onMouseEnter(e: pc.MouseEvent): void {
    this.setCursor("pointer");
  }

  onMouseLeave(e: pc.MouseEvent): void {
    this.setCursor("default");
  }

  onMouseDown(e: pc.MouseEvent): void {
    this.setCursor("default");
    GameManager.instance.exitLevel();
  }
}
