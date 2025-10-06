import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as env from './generated/env.js';


export function currentExtension(): Extension  {
    return Extension.lookupByUUID(env.UUID) ?? (() => { throw new Error("Extension not found"); })();
}