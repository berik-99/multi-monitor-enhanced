import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import LayoutManager from './models/LayoutManager.js';

export default class MultiMonitorEnhancedExtension extends Extension {
  gsettings?: Gio.Settings;
  public layoutManager?: LayoutManager;

  enable() {
    (global as any).multiMonitorEnhancedExtension = this;
    this.gsettings = this.getSettings();
    this.layoutManager = new LayoutManager();
    this.layoutManager.showPanels();
  }

  disable() {
    this.gsettings = undefined;
    this.layoutManager?.hidePanels();
  }
}