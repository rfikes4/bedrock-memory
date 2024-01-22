import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { GameManager } from "./GameManager";

@playCanvasScript("LevelSelectButton")
export class LevelSelectButton extends ScriptTypeBase {
  @attrib({
    type: "number",
    title: "Level",
    enum: [{ Level_1: 1 }, { Level_2: 2 }, { Level_3: 3 }],
  })
  level: number;

  public completed: boolean = false;

  initialize(): void {
    this.entity.button.on("mouseenter", this.onMouseEnter, this);
    this.entity.button.on("mouseleave", this.onMouseLeave, this);
    this.entity.button.on("click", this.onMouseDown, this);
  }

  setCursor(style: "default" | "pointer"): void {
    if (document.body.style.cursor != style) document.body.style.cursor = style;
  }

  onMouseEnter(e: pc.MouseEvent): void {
    // if (this.completed) return;
    this.setCursor("pointer");
  }

  onMouseLeave(e: pc.MouseEvent): void {
    // if (this.completed) return;
    this.setCursor("default");
  }

  onMouseDown(e: pc.MouseEvent): void {
    // if (this.completed) return;
    console.log("LevelSelectButton.onMouseDown", this.level);
    this.setCursor("default");
    GameManager.instance.loadLevel(this.level);
  }

  setCompleted(): void {
    console.log("LevelSelectButton.setCompleted");
    this.completed = true;
    this.entity.element.color = new pc.Color(0, 1, 0, 1);
  }
}
