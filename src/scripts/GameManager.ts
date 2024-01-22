import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TileManager } from "./TileManager";
import { UiManager } from "./UiManager";

@playCanvasScript("Game")
export class Game extends ScriptTypeBase {
  initialize(): void {
    GameManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Game>(this.entity, Game.scriptName)
    );
  }

  loadLevel(level: number): void {
    console.log("Game.loadLevel", level);
    // TODO: hide MainMenu ui (manager), show back button
    TileManager.instance.spawnTiles(level);
    UiManager.instance.loadLevel(level);
  }

  exitLevel(): void {
    console.log("exitLevel");
    TileManager.instance.exit();
    UiManager.instance.exitLevel();
    // TODO: show MainMenu ui (manager), hide back button
  }
}

export class GameManager {
  static readonly instance = new GameManager();
  protected gameScript: Game;

  private constructor() {
    /**/
  }

  public initialize(gameScript: Game): void {
    this.gameScript = gameScript;
  }

  public loadLevel(level: number): void {
    console.log("GameManager.loadLevel", level);
    this.gameScript.loadLevel(level);
  }

  public exitLevel(): void {
    console.log("GameManager.exitLevel");
    this.gameScript.exitLevel();
  }

  public win(): void {
    console.log("GameManager.win");
    // TODO: Show win screen gamemanager
  }
  // public get canFlip(): boolean {
  //   return this.tilesScript.flippedPair.length < 2;
  // }
}
