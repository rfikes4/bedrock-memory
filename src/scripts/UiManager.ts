import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TileManager } from "./TileManager";
import { LevelSelectButton } from "./LevelSelectButton";

@playCanvasScript("Ui")
export class Ui extends ScriptTypeBase {
  @attrib({
    type: "entity",
  })
  mainMenu: pc.Entity;
  @attrib({
    type: "entity",
  })
  levelMenu: pc.Entity;
  @attrib({
    type: "entity",
  })
  level1SelectButton: pc.Entity;
  @attrib({
    type: "entity",
  })
  level2SelectButton: pc.Entity;
  @attrib({
    type: "entity",
  })
  level3SelectButton: pc.Entity;
  @attrib({
    type: "entity",
  })
  levelBackButton: pc.Entity;
  @attrib({
    type: "entity",
  })
  levelMenuScore: pc.Entity;
  @attrib({
    type: "entity",
  })
  levelRules: pc.Entity;
  @attrib({
    type: "entity",
  })
  winMenu: pc.Entity;
  @attrib({
    type: "entity",
  })
  winBackButton: pc.Entity;

  // TODO: attrib level buttons

  initialize(): void {
    UiManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Ui>(this.entity, Ui.scriptName)
    );
    this.mainMenu.enabled = true;
    this.levelMenu.enabled = false;
    this.winMenu.enabled = false;
  }

  loadLevel(level: number): void {
    console.log("ui.loadLevel", level);
    // TODO: hide MainMenu ui (manager), show back button
    // this.setScore(0, 0);
    this.mainMenu.enabled = false;
    this.winMenu.enabled = false;
    this.levelMenu.enabled = true;
    this.levelBackButton.enabled = true;
    this.levelRules.enabled = true;
  }

  exitLevel(): void {
    console.log("ui:exitLevel");
    this.levelMenu.enabled = false;
    this.winMenu.enabled = false;
    this.winBackButton.enabled = false;
    this.mainMenu.enabled = true;
    // TODO: show MainMenu ui (manager), hide back button
  }

  win(level: number): void {
    console.log("ui:win");
    this.levelBackButton.enabled = false;
    this.levelRules.enabled = false;
    this.winBackButton.enabled = true;
    this.winMenu.enabled = true;
    if (level == 1) {
      ScriptTypeBase.GetScriptFromEntity<LevelSelectButton>(
        this.level1SelectButton,
        LevelSelectButton.scriptName
      ).setCompleted();
    } else if (level == 2) {
      ScriptTypeBase.GetScriptFromEntity<LevelSelectButton>(
        this.level2SelectButton,
        LevelSelectButton.scriptName
      ).setCompleted();
    } else if (level == 3) {
      ScriptTypeBase.GetScriptFromEntity<LevelSelectButton>(
        this.level3SelectButton,
        LevelSelectButton.scriptName
      ).setCompleted();
    }
  }

  setScore(score: number, pairs: number): void {
    console.log("ui:setScore", score, pairs);
    this.levelMenuScore.element.text = `${score * 2} / ${pairs * 2}`;
  }
}

export class UiManager {
  static readonly instance = new UiManager();
  protected uiScript: Ui;

  private constructor() {
    /**/
  }

  public initialize(uiScript: Ui): void {
    this.uiScript = uiScript;
  }

  public loadLevel(level: number): void {
    console.log("UiManager.loadLevel", level);
    this.uiScript.loadLevel(level);
  }

  public exitLevel(): void {
    console.log("UiManager.exitLevel");
    this.uiScript.exitLevel();
  }

  public win(level: number): void {
    console.log("UiManager.win");
    this.uiScript.win(level);
  }

  public setScore(score: number, pairs: number): void {
    console.log("UiManager.setScore", score, pairs);
    this.uiScript.setScore(score, pairs);
  }
}
