import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { SettingsService } from 'SettingsService'
import { ScreenshotData } from '../src/app/models/screenshot-data'

export class FilesService {

    private imageDataPrefix: string = 'data:image/png;base64,';

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('getScreenshot', (event, sha1Code, genMsxId, suffix) => {
            var screenshotData = this.getScreenshotData(genMsxId, suffix);
            this.win.webContents.send('getScreenshotResponse' + sha1Code, screenshotData)
        })
    }

    getScreenshotData(genMsxId: number, suffix: string): ScreenshotData {
        var screenshotsPath1: string;
        if (suffix == null) {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a.png')
        } else {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a' + suffix + '.png')
        }

        var data1: string;
        try {
            data1 = this.imageDataPrefix + fs.readFileSync(screenshotsPath1).toString('base64');
        } catch (err) {
            data1 = "";
        }

        var data2: string;
        if (data1) {
            var screenshotsPath2: string;
            if (suffix == null) {
                screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b.png')
            } else {
                screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b' + suffix + '.png')
            }
            try {
                data2 = this.imageDataPrefix + fs.readFileSync(screenshotsPath2).toString('base64');
            } catch (err) {
                data2 = "";
            }
        } else {
            data2 = "";
        }

        return new ScreenshotData(data1, data2)
    }
}