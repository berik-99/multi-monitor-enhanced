import { currentExtension } from "../utils.js";
import Gio from 'gi://Gio';
import { MMPanel } from "./MMPanel.js";
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class LayoutManager {
    private _settings: Gio.Settings;
    private _monitorchangedEventId: number | null = null;
    public panels: InstanceType<typeof MMPanel>[] = [];

    constructor() {
        this._settings = currentExtension().getSettings();
    }

    public showPanels() {
        this.hidePanels();
        this._monitorchangedEventId = Main.layoutManager.connect('monitors-changed', this._monitorsChanged.bind(this));
        for (let i = 0; i < Main.layoutManager.monitors.length; i++) {
            if (i != Main.layoutManager.primaryIndex) {
                let monitor = Main.layoutManager.monitors[i];
                let panel = new MMPanel(monitor);
                this.panels.push(panel);
            }
        }
    }

    public hidePanels() {
        Main.layoutManager.disconnect(this._monitorchangedEventId!);
        this._monitorchangedEventId = null;
        while (this.panels.length > 0) {
            let panel = this.panels.pop();
            panel?.destroy();
        }
    }

    private _monitorsChanged() {
        this.showPanels();
    }
}
