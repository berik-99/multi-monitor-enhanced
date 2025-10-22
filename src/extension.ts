import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import LayoutManager from './models/LayoutManager.js';
import * as AltTab from 'resource:///org/gnome/shell/ui/altTab.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

type OriginalShowFunction = (this: AltTab.AppSwitcherPopup, ...args: any[]) => boolean;

export default class MultiMonitorEnhancedExtension extends Extension {
  private gsettings?: Gio.Settings;
  public layoutManager?: LayoutManager;
  private _originalShow: OriginalShowFunction | null = null;

  enable() {
    (global as any).multiMonitorEnhancedExtension = this;
    this.gsettings = this.getSettings();
    this.layoutManager = new LayoutManager();
    this.layoutManager.showPanels();

    // Patch Alt-Tab to work on all monitors

    this._originalShow = AltTab.AppSwitcherPopup.prototype.show;

    const extension = this;

    // Patch: usiamo una funzione standard per avere il `this` dinamico (la popup).
    AltTab.AppSwitcherPopup.prototype.show = function (this: AltTab.AppSwitcherPopup, ...args: any[]): boolean {
      // `this` qui si riferisce all'istanza di AppSwitcherPopup.
      const monitor = Main.layoutManager.focusMonitor;

      if (monitor) {
        const [minWidth, naturalWidth] = this.get_preferred_width(monitor.height);
        const [minHeight, naturalHeight] = this.get_preferred_height(monitor.width);

        const newX = monitor.x + Math.floor((monitor.width - naturalWidth) / 2);
        const newY = monitor.y + Math.floor((monitor.height - naturalHeight) / 2);

        this.set_position(newX, newY);
      }

      // Usiamo la variabile `extension` dalla closure per accedere a `_originalShow`.
      // Questo è il modo corretto per chiamare la funzione originale salvata.
      if (!extension._originalShow) {
        console.error(`[${extension.uuid}] Original 'show' method not found during execution.`);
        return false; // Fallback sicuro
      }

      // Chiamiamo l'originale usando .apply() per passare il `this` della popup
      // e gli argomenti originali.
      const returnValue = extension._originalShow.apply(this, args);

      return returnValue;
    };
  }

  disable() {
    this.gsettings = undefined;
    this.layoutManager?.hidePanels();

    // Se abbiamo una funzione originale salvata, ripristiniamola.
    if (this._originalShow) {
      AltTab.AppSwitcherPopup.prototype.show = this._originalShow;
    }

    // Pulisci la referenza.
    this._originalShow = null;
  }
}