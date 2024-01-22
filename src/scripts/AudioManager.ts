import * as pc from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { attrib, playCanvasScript } from "../decorators/playCanvasScript";
import { TJsonAttributeSchemaProp } from "../types/attributes";

@playCanvasScript("Audio")
export class Audio extends ScriptTypeBase {
  @attrib({
    type: "json",
    schema: [
      {
        name: "name",
        type: "string",
        default: "",
      },
      {
        name: "asset",
        type: "asset",
        assetType: "audio",
      },
    ] as unknown as TJsonAttributeSchemaProp[],
    array: true,
  })
  audioRegistryEffects: pc.Asset[];

  initialize(): void {
    AudioManager.instance.initialize(
      ScriptTypeBase.GetScriptFromEntity<Audio>(this.entity, Audio.scriptName)
    );
    this.entity.addComponent("sound"); // add sound component to object to load all the sound slots onto
    this.registerSounds(); // load all the sound slots onto the pc object
  }

  registerSounds(): void {
    for (const effectSound of this.audioRegistryEffects) {
      this.entity.sound.addSlot(effectSound.name, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        asset: effectSound.asset,
        autoPlay: false,
        loop: false,
        overlap: true,
        volume: AudioManager.instance.volumeEffects,
      });
    }
  }

  playSound(sound: string): void {
    this.entity.sound.play(sound);
  }
}

export enum AudioEnum {
  AUDIO_BEATGAME = "AUDIO_BEATGAME",
  AUDIO_MATCHED = "AUDIO_MATCHED",
  AUDIO_MISMATCHED = "AUDIO_MISMATCHED",
  AUDIO_PLAYAGAIN = "AUDIO_PLAYAGAIN",
  AUDIO_TILE = "AUDIO_TILE",
}

export class AudioManager {
  static readonly instance = new AudioManager();
  protected audioScript: Audio;
  volumeEffects: 1;

  private constructor() {
    /**/
  }

  public static readonly AUDIO_BEATGAME = "AUDIO_BEATGAME";
  public static readonly AUDIO_MATCHED = "AUDIO_MATCHED";
  public static readonly AUDIO_MISMATCHED = "AUDIO_MISMATCHED";
  public static readonly AUDIO_PLAYAGAIN = "AUDIO_PLAYAGAIN";
  public static readonly AUDIO_TILE = "AUDIO_TILE";

  public initialize(audioScript: Audio): void {
    this.audioScript = audioScript;
  }

  public playSound(sound: AudioEnum): void {
    this.audioScript.playSound(sound);
  }
}
