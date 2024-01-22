import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { playCanvasScript } from "../decorators/playCanvasScript";
import { TileManager } from "./TileManager";
import { UiManager } from "./UiManager";

@playCanvasScript("Game")
export class Game extends ScriptTypeBase {
  initialize(): void {
    GameManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Game>(this.entity, Game.scriptName)
    );
  }
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
    TileManager.instance.spawnTiles(level);
    this.pairs = TileManager.instance.pairs;
    UiManager.instance.loadLevel(level);
    UiManager.instance.setScore(0, this.pairs);
  }

  public exitLevel(): void {
    TileManager.instance.exit();
    UiManager.instance.exitLevel();
    this.currentLevel = -1;
  }

  public win(): void {
    this.completedLevels.push(this.currentLevel);
    UiManager.instance.win(this.currentLevel);
  }

  public setScore(score: number, pairs: number): void {
    UiManager.instance.setScore(score, pairs);
  }
}
