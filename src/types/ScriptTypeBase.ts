import * as pc from 'playcanvas';

// Base class to inherit from for script types
export class ScriptTypeBase extends pc.ScriptType {
  // -- Utils
  getScript<T>(entity: pc.Entity, scriptName: string): T | undefined {
    const script = entity?.script?.get(scriptName);
    if (!script) {
      console.error(`[${this.entity.name}] Script ${scriptName} not found`);
      return;
    }
    return script as unknown as T;
  }

  get<T extends ScriptTypeBase>(scriptName: string): T {
    const script = this.entity.script?.get(scriptName);
    if (!script) {
      throw new Error(`[${this.entity.name}] Script ${scriptName} not found`);
    }

    return script as unknown as T;
  }

  static GetScriptFromApp<T>(app: pc.Application, scriptName: string): T | undefined {
    const entity = app.root.findByName(scriptName) as pc.Entity;
    const script = entity?.script?.get(scriptName);
    if (!script) {
      console.error(`[${entity.name}] Script ${scriptName} not found`);
      return;
    }
    return script as unknown as T;
  }

  static GetScriptFromEntity<T>(entity: pc.Entity, scriptName: string): T | undefined {
    const script = entity?.script?.get(scriptName);
    if (!script) {
      console.error(`[${entity.name}] Script ${scriptName} not found`);
      return;
    }
    return script as unknown as T;
  }

  // For logging the entity to the console
  static GetPathToEntity(entity: pc.GraphNode): string {
    let path: string = entity.name;
    while(entity.parent) {
        entity = entity.parent;
        path = entity.name + '->'+  path;
    }
    return path;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static CreateEnumAttrib(enumObj: Object): { [key: string]: unknown }[] {
    const attrib = [];
    const entries:[string, unknown][] = Object.entries(enumObj);
    for(let i = 0; i < entries.length; i++) {
      // Filter out reverse mapping of numeric enums
      if(isNaN(Number(entries[i][0]))) {
        const entry: { [key: string]: unknown } = {};
        entry[entries[i][0]] = entries[i][1];
        attrib.push(entry);
      }   
    }
    return attrib;
  }
}
