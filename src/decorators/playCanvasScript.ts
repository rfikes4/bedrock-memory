import * as pc from 'playcanvas';
import { TAttributeParams } from '../types/attributes';

class TemporaryAttributeStorage
{
  static attributesData: Map<string, TAttributeParams> = new Map();
}

export function playCanvasScript(name: string) {
  return function (obj: typeof pc.ScriptType): void {
    pc.registerScript(obj, name);

    TemporaryAttributeStorage.attributesData.forEach((value, key) => {
      obj.attributes.add(key, value);
    });
    TemporaryAttributeStorage.attributesData.clear();
  };
}

export function attrib(params: TAttributeParams) {
  return function (
    target: unknown,
    propertyKey: string,
  ): void {
    TemporaryAttributeStorage.attributesData.set(propertyKey, params);
  }
}
