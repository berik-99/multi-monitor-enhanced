import { Monitor } from '@girs/gnome-shell/ui/layout';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Panel from 'resource:///org/gnome/shell/ui/panel.js';


export class MMPanelClass extends Panel.Panel {
    monitor: Monitor;
    panelBox: St.BoxLayout;

    constructor(monitor: Monitor) {
        super();
        this.monitor = monitor;
        Main.layoutManager.panelBox.remove_child(this);
        this.panelBox = new St.BoxLayout({ name: 'panelBox', vertical: true, clip_to_allocation: true });
        Main.layoutManager.addChrome(this.panelBox, { affectsStruts: true, trackFullscreen: true });
        this.updatePanel();
        Main.layoutManager.uiGroup.set_child_below_sibling(this.panelBox, Main.layoutManager.panelBox);
        this.panelBox.add_child(this);
        this.set_style_class_name(Main.panel.get_style_class_name());
        this.connect('destroy', this._onDestroy.bind(this));
        console.log('MMPanel _init');
    }

    _onDestroy() {
        Main.ctrlAltTabManager.removeGroup(this);
    }

    destroy() {
        this.panelBox.destroy();
    }

    updatePanel() {
        this.panelBox.set_position(this.monitor.x, this.monitor.y);
        this.panelBox.set_size(this.monitor.width, -1);
    }

    vfunc_get_preferred_width(__for_height: number): [number, number] {
        if (this.monitor)
            return [0, this.monitor.width];
        return [0, 0];
    }

    activitiesButtonShow() {
        const activities = (this.statusArea as any).activities;
        if (activities && activities.container && typeof activities.container.show === 'function') {
            activities.container.show();
        }
    }

    activitiesButtonHide() {
        const activities = (this.statusArea as any).activities;
        if (activities && activities.container && typeof activities.container.hide === 'function') {
            activities.container.hide();
        }
    }

    quickSettingsMenuShow() {
        let quickSettings = this.statusArea.quickSettings;
        if (quickSettings) {
            quickSettings.container.show();
        }
    }

    quickSettingsMenuHide() {
        let quickSettings = this.statusArea.quickSettings;
        if (quickSettings) {
            quickSettings.container.hide();
        }
    }
}
export const MMPanel = GObject.registerClass(MMPanelClass);