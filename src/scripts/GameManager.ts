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

  // loadLevel(level: number): void {
  //   console.log("Game.loadLevel", level);
  //   // TODO: hide MainMenu ui (manager), show back button
  //   TileManager.instance.spawnTiles(level);
  //   UiManager.instance.loadLevel(level);
  // }

  // exitLevel(): void {
  //   console.log("exitLevel");
  //   TileManager.instance.exit();
  //   UiManager.instance.exitLevel();
  //   // TODO: show MainMenu ui (manager), hide back button
  // }

  // setScore(score: number, pairs: number): void {
  //   console.log("setScore");
  //   UiManager.instance.setScore(score, pairs);
  // }
}

export class GameManager {
  static readonly instance = new GameManager();
  protected gameScript: Game;
  public score: number = 0;
  public pairs: number = 0;
  protected completedLevels: number[] = [];
  private currentLevel: number = -1; // -1 = main menu

  private constructor() {
    /**/
  }

  public initialize(gameScript: Game): void {
    this.gameScript = gameScript;
  }

  public loadLevel(level: number): void {
    this.currentLevel = level;
    console.log("GameManager.loadLevel", level);
    // this.gameScript.loadLevel(level);
    // console.log("Game.loadLevel", level);
    // TODO: hide MainMenu ui (manager), show back button
    TileManager.instance.spawnTiles(level);
    this.pairs = TileManager.instance.pairs;
    UiManager.instance.loadLevel(level);
    UiManager.instance.setScore(0, this.pairs);
  }

  public exitLevel(): void {
    console.log("GameManager.exitLevel");
    // this.gameScript.exitLevel();
    TileManager.instance.exit();
    UiManager.instance.exitLevel();
    this.currentLevel = -1;
  }

  public win(): void {
    console.log("GameManager.win");
    // TODO: Show win screen gamemanager
    this.completedLevels.push(this.currentLevel);
    UiManager.instance.win(this.currentLevel);
  }

  public setScore(score: number, pairs: number): void {
    console.log("GameManager.setScore", score, pairs);
    // this.gameScript.setScore(score, pairs);
    UiManager.instance.setScore(score, pairs);
  }

  // public get canFlip(): boolean {
  //   return this.tilesScript.flippedPair.length < 2;
  // }
}
