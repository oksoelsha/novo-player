import { BrowserWindow, ipcMain } from 'electron'
import * as os from 'os';
import * as path from 'path'
import * as fs from 'fs'
import { Settings } from '../app/models/settings'

export class SettingsService {

    settings: Settings;
    settingsPath: string = path.join(os.homedir(), 'Novo Player');
    settingsFile: string = path.join(this.settingsPath, 'settings.nps');

    constructor(private win: BrowserWindow) { }

    init() {
        this.createFolderIfNecessary();

        ipcMain.on('getSettings', (event, arg) => {
            this.settings = this.getSettings();
            this.win.webContents.send('getSettingsResponse', this.settings)
        })

        ipcMain.on('saveSettings', (event, arg) => {
            this.saveSettings(arg)
        })
    }

    getSettings() {
        if (this.settings === undefined) {
            if (!fs.existsSync(this.settingsFile)) {
                return "";
            } else {
                let fileData = fs.readFileSync(this.settingsFile);
                return JSON.parse(fileData.toString());
            }
        } else {
            return this.settings;
        }
    }

    saveSettings(settings: Settings) {
        let data = JSON.stringify(settings);
        fs.writeFileSync(this.settingsFile, data);
        this.settings = settings;
    }

    private createFolderIfNecessary() {
        if (!fs.existsSync(this.settingsPath)) {
            fs.mkdirSync(this.settingsPath);
        }
    }
}
