import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TileManager } from "./TileManager";

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
  winMenu: pc.Entity;

  // TODO: attrib level buttons

  initialize(): void {
    UiManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Ui>(this.entity, Ui.scriptName)
    );
    this.mainMenu.enabled = true;
    this.levelMenu.enabled = false;
    // this.winMenu.enabled = false;
  }

  loadLevel(level: number): void {
    console.log("ui.loadLevel", level);
    // TODO: hide MainMenu ui (manager), show back button
    this.mainMenu.enabled = false;
    this.levelMenu.enabled = true;
  }

  exitLevel(): void {
    console.log("ui:exitLevel");
    this.levelMenu.enabled = false;
    this.mainMenu.enabled = true;
    // TODO: show MainMenu ui (manager), hide back button
  }

  win(): void {
    console.log("ui:win");
    // this.levelMenu.enabled = false;
    // this.mainMenu.enabled = true;
    // TODO: Show win screen gamemanager
  }

  setLevelWon(level: number): void {
    console.log("ui:setLevelWon", level);
    // TODO: set level button to won, disable button click
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

  public win(): void {
    console.log("UiManager.win");
    this.uiScript.win();
  }
  // public get canFlip(): boolean {
  //   return this.tilesScript.flippedPair.length < 2;
  // }
}
