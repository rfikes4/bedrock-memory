/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import * as pc from "playcanvas";
import {
  Application,
  EventHandler,
  events,
  HandleEventCallback,
} from "playcanvas";
import set from "lodash/set";
import get from "lodash/get";

interface ITweenManager {
  add(tween: PcTween): PcTween;
  update(dt: number): boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace pc {
    interface AppBase {
      addTweenManager(): void;
      tween(target: any): PcTween;
      _tweenManager: ITweenManager;
    }

    interface Entity {
      tween(target: any, options?: any): PcTween;
    }
  }
}

export type TweenEasingFunction = (k: number) => number;

export type TweenPropsType = pc.Vec2 | pc.Vec3 | pc.Vec4 | pc.Quat | pc.Color;

export class PcTween extends EventHandler {
  entity: pc.Entity;
  manager: ITweenManager;
  time = 0;
  complete = false;
  playing = false;
  stopped = true;
  pending = false;

  target: any;
  duration = 0;
  _currentDelay = 0;
  timeScale = 1;
  _reverse = false;
  _delay = 0;
  _yoyo = false;
  _count = 0;
  _numRepeats = 0;
  _repeatDelay = 0;
  _from = false;
  _slerp = false;
  _fromQuat: pc.Quat = new pc.Quat();
  _toQuat: pc.Quat = new pc.Quat();
  _quat: pc.Quat = new pc.Quat();
  _repeat: true;
  _easing: TweenEasingFunction = Linear;

  _sv: any = {};
  _ev: any = {};
  _properties: Partial<TweenPropsType>;
  private _chained: any;
  element: string | null = null;

  constructor(target: any, manager: ITweenManager, entity?: pc.Entity) {
    super();
    events.attach(this);
    this.manager = manager;

    if (entity) {
      this.entity = entity;
    }

    this.target = target;
  }

  // on(name: string, callback: HandleEventCallback, scope?: any): PcTween {
  //   super.on(name, callback, scope);
  //   return this;
  // }

  parseProperties(properties: TweenPropsType | any): Partial<TweenPropsType> {
    let _properties: Partial<TweenPropsType>;
    if (properties instanceof pc.Vec2) {
      _properties = {
        x: properties.x,
        y: properties.y,
      };
    } else if (properties instanceof pc.Vec3) {
      _properties = {
        x: properties.x,
        y: properties.y,
        z: properties.z,
      };
    } else if (properties instanceof pc.Vec4) {
      _properties = {
        x: properties.x,
        y: properties.y,
        z: properties.z,
        w: properties.w,
      };
    } else if (properties instanceof pc.Quat) {
      _properties = {
        x: properties.x,
        y: properties.y,
        z: properties.z,
        w: properties.w,
      };
    } else if (properties instanceof pc.Color) {
      _properties = {
        r: properties.r,
        g: properties.g,
        b: properties.b,
      };
      if (properties.a !== undefined) {
        set(_properties, "a", properties.a);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      _properties = properties;
    }
    return _properties;
  }

  to(
    properties: TweenPropsType | any,
    duration: number,
    easing?: TweenEasingFunction,
    delay?: number,
    repeat?: number,
    yoyo?: boolean
  ): PcTween {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._properties = this.parseProperties(properties);
    this.duration = duration;
    if (easing) this._easing = easing;
    if (delay) {
      this.delay(delay);
    }

    if (repeat) {
      this.repeat(repeat);
    }

    if (yoyo) {
      this.yoyo(yoyo);
    }

    return this;
  }

  from(
    properties: TweenPropsType | any,
    duration: number,
    easing?: TweenEasingFunction,
    delay?: number,
    repeat?: number,
    yoyo?: boolean
  ): PcTween {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._properties = this.parseProperties(properties);
    this.duration = duration;

    if (easing) this._easing = easing;
    if (delay) {
      this.delay(delay);
    }
    if (repeat) {
      this.repeat(repeat);
    }

    if (yoyo) {
      this.yoyo(yoyo);
    }

    this._from = true;

    return this;
  }

  rotate(
    properties: TweenPropsType,
    duration: number,
    easing?: TweenEasingFunction,
    delay?: number,
    repeat?: number,
    yoyo?: true
  ): PcTween {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._properties = this.parseProperties(properties);

    this.duration = duration;

    if (easing) this._easing = easing;
    if (delay) {
      this.delay(delay);
    }
    if (repeat) {
      this.repeat(repeat);
    }

    if (yoyo) {
      this.yoyo(yoyo);
    }

    this._slerp = true;

    return this;
  }

  start(): PcTween {
    let prop: any;
    let _x,
      _y,
      _z = 0;
    this.playing = true;
    this.complete = false;
    this.stopped = false;
    this._count = 0;
    this.pending = this._delay > 0;

    if (this._reverse && !this.pending) {
      this.time = this.duration;
    } else {
      this.time = 0;
    }

    if (this._from) {
      for (const prop in this._properties) {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.prototype.hasOwnProperty.call(this._properties, prop)) {
          set(this._sv, prop, get(this._properties, prop));
          set(this._ev, prop, this.target[prop]);
        }
      }

      if (this._slerp) {
        this._toQuat.setFromEulerAngles(
          this.target.x,
          this.target.y,
          this.target.z
        );
        const vecProp = this._properties as pc.Vec3;
        _x = vecProp.x !== undefined ? vecProp.x : this.target.x;
        _y = vecProp.y !== undefined ? vecProp.y : this.target.y;
        _z = vecProp.z !== undefined ? vecProp.z : this.target.z;
        this._fromQuat.setFromEulerAngles(_x, _y, _z);
      }
    } else {
      for (prop in this._properties) {
        if (Object.prototype.hasOwnProperty.call(this._properties, prop)) {
          set(this._sv, prop, this.target[prop]);
          set(this._ev, prop, get(this._properties, prop));
        }
      }

      if (this._slerp) {
        const quatProp = this._properties as pc.Quat;
        _x = quatProp.x !== undefined ? quatProp.x : this.target.x;
        _y = quatProp.y !== undefined ? quatProp.y : this.target.y;
        _z = quatProp.z !== undefined ? quatProp.z : this.target.z;

        if (quatProp.w !== undefined) {
          this._fromQuat.copy(this.target);
          this._toQuat.set(_x, _y, _z, quatProp.w);
        } else {
          this._fromQuat.setFromEulerAngles(
            this.target.x,
            this.target.y,
            this.target.z
          );
          this._toQuat.setFromEulerAngles(_x, _y, _z);
        }
      }
    }

    // set delay
    this._currentDelay = this._delay;

    // add to manager when started
    this.manager.add(this);

    return this;
  }

  pause() {
    this.playing = false;
  }

  resume() {
    this.playing = true;
  }

  stop() {
    this.playing = false;
    this.stopped = true;
  }

  delay(delay: number): PcTween {
    this._delay = delay;
    this.pending = true;

    return this;
  }

  repeat(num: number, delay?: number): PcTween {
    this._count = 0;
    this._numRepeats = num;
    if (delay) {
      this._repeatDelay = delay;
    } else {
      this._repeatDelay = 0;
    }

    return this;
  }

  loop(loop: boolean): PcTween {
    if (loop) {
      this._count = 0;
      this._numRepeats = Number.POSITIVE_INFINITY;
    } else {
      this._numRepeats = 0;
    }

    return this;
  }

  yoyo(yoyo: boolean): PcTween {
    this._yoyo = yoyo;
    return this;
  }

  reverse(): PcTween {
    this._reverse = !this._reverse;
    return this;
  }

  chain(): PcTween {
    let n = arguments.length;

    while (n--) {
      if (n > 0) {
        // eslint-disable-next-line prefer-rest-params
        arguments[n - 1]._chained = arguments[n];
      } else {
        // eslint-disable-next-line prefer-rest-params
        this._chained = arguments[n];
      }
    }

    return this;
  }

  update(dt: number): boolean {
    if (this.stopped) return false;

    if (!this.playing) return true;

    if (!this._reverse || this.pending) {
      this.time += dt * this.timeScale;
    } else {
      this.time -= dt * this.timeScale;
    }

    // delay start if required
    if (this.pending) {
      if (this.time > this._currentDelay) {
        if (this._reverse) {
          this.time = this.duration - (this.time - this._currentDelay);
        } else {
          this.time -= this._currentDelay;
        }
        this.pending = false;
      } else {
        return true;
      }
    }

    let _extra = 0;
    if (
      (!this._reverse && this.time > this.duration) ||
      (this._reverse && this.time < 0)
    ) {
      this._count++;
      this.complete = true;
      this.playing = false;
      if (this._reverse) {
        _extra = this.duration - this.time;
        this.time = 0;
      } else {
        _extra = this.time - this.duration;
        this.time = this.duration;
      }
    }

    const elapsed = this.duration === 0 ? 1 : this.time / this.duration;

    // run easing
    const a = this._easing(elapsed);

    // increment property
    let s,
      e = 0;
    for (const prop in this._properties) {
      if (Object.prototype.hasOwnProperty.call(this._properties, prop)) {
        s = get(this._sv, prop) as number;
        e = get(this._ev, prop) as number;
        this.target[prop] = s + (e - s) * a;
      }
    }

    if (this._slerp) {
      this._quat.slerp(this._fromQuat, this._toQuat, a);
    }

    // if this is a entity property then we should dirty the transform
    if (this.entity) {
      const _dirtifyLocal = (
        get(this.entity, "_dirtifyLocal") as () => void
      )?.bind(this.entity);
      if (_dirtifyLocal) _dirtifyLocal();

      // apply element property changes
      if (this.element && this.entity.element) {
        set(this.entity.element, this.element, this.target);
      }

      if (this._slerp) {
        this.entity.setLocalRotation(this._quat);
      }
    }

    this.fire("update", dt);

    if (this.complete) {
      const repeat = this._shouldRepeat(_extra);
      if (!repeat) {
        this.fire("complete", _extra);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        if (this.entity) this.entity.off("destroy", this.stop, this);
        if (this._chained) this._chained.start();
      } else {
        this.fire("loop");
      }

      return repeat;
    }

    return true;
  }

  protected _shouldRepeat(extra: number): boolean {
    // test for repeat conditions
    if (this._count < this._numRepeats) {
      // do a repeat
      if (this._reverse) {
        this.time = this.duration - extra;
      } else {
        this.time = extra; // include overspill time
      }
      this.complete = false;
      this.playing = true;

      this._currentDelay = this._repeatDelay;
      this.pending = true;

      if (this._yoyo) {
        // swap start/end properties
        for (const prop in this._properties) {
          const tmp = this._sv[prop];
          this._sv[prop] = this._ev[prop];
          this._ev[prop] = tmp;
        }

        if (this._slerp) {
          this._quat.copy(this._fromQuat);
          this._fromQuat.copy(this._toQuat);
          this._toQuat.copy(this._quat);
        }
      }

      return true;
    }
    return false;
  }
}

export class TweenManager implements ITweenManager {
  protected _app: pc.AppBase;
  protected _tweens: Array<PcTween>;
  protected _add: Array<PcTween>;

  constructor(app: pc.AppBase) {
    this._app = app;
    this._tweens = [];
    this._add = []; // to be added
  }

  add(tween: PcTween): PcTween {
    this._add.push(tween);
    return tween;
  }

  update(dt: number): boolean {
    let i = 0;
    let n = this._tweens.length;
    while (i < n) {
      if (this._tweens[i].update(dt)) {
        i++;
      } else {
        this._tweens.splice(i, 1);
        n--;
      }
    }

    // add any tweens that were added mid-update
    if (this._add.length) {
      this._tweens = this._tweens.concat(this._add);
      this._add.length = 0;
    }

    return true;
  }
}

export const Linear: TweenEasingFunction = function (k: number): number {
  return k;
};

export const QuadraticIn: TweenEasingFunction = function (k: number): number {
  return k * k;
};

export const QuadraticOut: TweenEasingFunction = function (k: number): number {
  return k * (2 - k);
};

export const QuadraticInOut: TweenEasingFunction = function (
  k: number
): number {
  if ((k *= 2) < 1) {
    return 0.5 * k * k;
  }
  return -0.5 * (--k * (k - 2) - 1);
};

export const CubicIn: TweenEasingFunction = function (k: number): number {
  return k * k * k;
};

export const CubicOut: TweenEasingFunction = function (k: number): number {
  return --k * k * k + 1;
};

export const CubicInOut: TweenEasingFunction = function (k: number): number {
  if ((k *= 2) < 1) return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
};

export const QuarticIn: TweenEasingFunction = function (k: number): number {
  return k * k * k * k;
};

export const QuarticOut: TweenEasingFunction = function (k: number): number {
  return 1 - --k * k * k * k;
};

export const QuarticInOut: TweenEasingFunction = function (k: number): number {
  if ((k *= 2) < 1) return 0.5 * k * k * k * k;
  return -0.5 * ((k -= 2) * k * k * k - 2);
};

export const QuinticIn: TweenEasingFunction = function (k: number): number {
  return k * k * k * k * k;
};

export const QuinticOut: TweenEasingFunction = function (k: number): number {
  return --k * k * k * k * k + 1;
};

export const QuinticInOut: TweenEasingFunction = function (k: number): number {
  if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
  return 0.5 * ((k -= 2) * k * k * k * k + 2);
};

export const SineIn: TweenEasingFunction = function (k: number): number {
  if (k === 0) return 0;
  if (k === 1) return 1;
  return 1 - Math.cos((k * Math.PI) / 2);
};

export const SineOut: TweenEasingFunction = function (k: number): number {
  if (k === 0) return 0;
  if (k === 1) return 1;
  return Math.sin((k * Math.PI) / 2);
};

export const SineInOut: TweenEasingFunction = function (k: number): number {
  if (k === 0) return 0;
  if (k === 1) return 1;
  return 0.5 * (1 - Math.cos(Math.PI * k));
};

export const ExponentialIn: TweenEasingFunction = function (k: number): number {
  return k === 0 ? 0 : Math.pow(1024, k - 1);
};

export const ExponentialOut: TweenEasingFunction = function (
  k: number
): number {
  return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
};

export const ExponentialInOut: TweenEasingFunction = function (
  k: number
): number {
  if (k === 0) return 0;
  if (k === 1) return 1;
  if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
  return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
};

export const CircularIn: TweenEasingFunction = function (k: number): number {
  return 1 - Math.sqrt(1 - k * k);
};

export const CircularOut: TweenEasingFunction = function (k: number): number {
  return Math.sqrt(1 - --k * k);
};

export const CircularInOut: TweenEasingFunction = function (k: number): number {
  if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
  return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
};

export const ElasticIn: TweenEasingFunction = function (k: number): number {
  let s,
    a = 0.1;
  const p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
  return -(
    a *
    Math.pow(2, 10 * (k -= 1)) *
    Math.sin(((k - s) * (2 * Math.PI)) / p)
  );
};

export const ElasticOut: TweenEasingFunction = function (k: number): number {
  let s,
    a = 0.1;
  const p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
  return a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1;
};

export const ElasticInOut: TweenEasingFunction = function (k: number): number {
  let s,
    a = 0.1;
  const p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
  if ((k *= 2) < 1)
    return (
      -0.5 *
      (a * Math.pow(2, 10 * (k -= 1)) * Math.sin(((k - s) * (2 * Math.PI)) / p))
    );
  return (
    a *
      Math.pow(2, -10 * (k -= 1)) *
      Math.sin(((k - s) * (2 * Math.PI)) / p) *
      0.5 +
    1
  );
};

export const BackIn: TweenEasingFunction = function (k: number): number {
  const s = 1.70158;
  return k * k * ((s + 1) * k - s);
};

export const BackOut: TweenEasingFunction = function (k: number): number {
  const s = 1.70158;
  return --k * k * ((s + 1) * k + s) + 1;
};

export const BackInOut: TweenEasingFunction = function (k: number): number {
  const s = 1.70158 * 1.525;
  if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
  return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
};

export const BounceOut: TweenEasingFunction = function (k: number): number {
  if (k < 1 / 2.75) {
    return 7.5625 * k * k;
  } else if (k < 2 / 2.75) {
    return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
  } else if (k < 2.5 / 2.75) {
    return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
  }
  return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
};

export const BounceIn: TweenEasingFunction = function (k: number): number {
  return 1 - BounceOut(1 - k);
};

export const BounceInOut: TweenEasingFunction = function (k: number): number {
  if (k < 0.5) return BounceIn(k * 2) * 0.5;
  return BounceOut(k * 2 - 1) * 0.5 + 0.5;
};

let isInit = false;
let finishedInit = false;

export const waitTillInitialized = (maxWait = 5000): Promise<void> => {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    if (finishedInit) {
      resolve();
      return;
    }

    const ival = setInterval(() => {
      if (finishedInit) {
        resolve();
        clearInterval(ival);
      }
      const diff = Date.now() - start;
      if (diff < maxWait) {
        reject("~~~ did not load tween in time");
        clearInterval(ival);
      }
    }, 100);
  });
};

export const initializeTweenEngine = () => {
  if (finishedInit) return;

  const isInInit = isInit;
  isInit = true;
  if (!isInInit) {
    pc.AppBase.prototype.addTweenManager = function () {
      this._tweenManager = new TweenManager(this);

      this.on("update", (dt) => {
        this._tweenManager.update(dt);
      });
    };

    // Add pc.Application#tween method
    pc.AppBase.prototype.tween = function (target) {
      return new PcTween(target, this._tweenManager);
    };

    // Add pc.Entity#tween method
    pc.Entity.prototype.tween = function (target, options) {
      const app = get(this, "_app") as Application;
      const tween = app.tween(target);
      tween.entity = this;

      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.once("destroy", tween.stop, tween);

      if (options && options.element) {
        // specifiy a element property to be updated
        tween.element = options.element;
      }
      return tween;
    };
  }
  // Create a default tween manager on the application
  const application = pc.Application.getApplication() as pc.Application;
  if (application && !get(application, "_tweenManager")) {
    finishedInit = true;
    application.addTweenManager();
  } else {
    setTimeout(initializeTweenEngine, 50);
  }
};

initializeTweenEngine();
