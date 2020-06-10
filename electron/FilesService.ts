import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { SettingsService } from 'SettingsService'
import { ScreenshotData } from '../src/app/models/screenshot-data'

export class FilesService {

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('getScreenshot', (event, arg) => {
            var screenshotData = this.getScreenshotData(arg);
            this.win.webContents.send('getScreenshotResponse', screenshotData)
        })
    }

    getScreenshotData(genMsxId: number): ScreenshotData {
        var screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a.png')
        var data1 = fs.readFileSync(screenshotsPath1).toString('base64');

        var screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b.png')
        var data2 = fs.readFileSync(screenshotsPath2).toString('base64');

        var prefix = 'data:image/png;base64,'
        return new ScreenshotData(prefix + data1, prefix + data2)
    }
}
