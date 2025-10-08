import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import LayoutManager from './models/LayoutManager.js';

export default class MultiMonitorEnhancedExtension extends Extension {
  private gsettings?: Gio.Settings;
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