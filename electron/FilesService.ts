import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { SettingsService } from 'SettingsService'
import { ScreenshotData } from '../src/app/models/screenshot-data'

export class FilesService {

    private imageDataPrefix: string = 'data:image/png;base64,';

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('getScreenshot', (event, arg) => {
            var screenshotData = this.getScreenshotData(arg);
            this.win.webContents.send('getScreenshotResponse', screenshotData)
        })
    }

    getScreenshotData(genMsxId: number): ScreenshotData {
        var screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a.png')
        var data1: string;
        try {
            data1 = this.imageDataPrefix + fs.readFileSync(screenshotsPath1).toString('base64');
        } catch (err) {
            data1 = "";
        }

        if (data1 != "") {
            var screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b.png')
            var data2: string;
            try {
                data2 = this.imageDataPrefix + fs.readFileSync(screenshotsPath2).toString('base64');
            } catch (err) {
                data2 = "";
            }
        }

        return new ScreenshotData(data1, data2)
    }
}