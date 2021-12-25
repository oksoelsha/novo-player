import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { SettingsService } from 'SettingsService';
import { GameSecondaryData } from '../src/app/models/secondary-data';
import * as cp from 'child_process'
import { PlatformUtils } from './utils/PlatformUtils';

export class FilesService {

    private imageDataPrefix: string = 'data:image/png;base64,';

    constructor(private win: BrowserWindow, private settingsService: SettingsService) {
        this.init();
    }

    private init() {
        ipcMain.on('getSecondaryData', (event, sha1Code, genMsxId, suffix) => {
            var secondaryData = this.getSecondaryData(genMsxId, suffix);
            this.win.webContents.send('getSecondaryDataResponse' + sha1Code, secondaryData);
        })

        ipcMain.on('openFileExplorer', (event, file) => {
            this.openFileExplorer(file);
        })

        ipcMain.on('getWebMSXPath', (event, folder: string, file: string) => {
            var fullpath: string = path.join(folder, file);
            if (fs.existsSync(fullpath)) {
                this.win.webContents.send('getWebMSXPathResponse', fullpath);
            } else {
                this.win.webContents.send('getWebMSXPathResponse', null);
            }
        })

        ipcMain.on('getScreenshotsVersion', (event) => {
            var screenshotVersion = this.getScreenshotVersion();
            this.win.webContents.send('getScreenshotsVersionResponse', screenshotVersion);
        })

        ipcMain.on('getGameMusicVersion', (event) => {
            var gameMusicVersion = this.getGameMusicVersion();
            this.win.webContents.send('getGameMusicVersionResponse', gameMusicVersion);
        })
    }

    private getSecondaryData(genMsxId: number, suffix: string): GameSecondaryData {
        var screenshotsPath1: string;
        if (suffix == null) {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a.png');
        } else {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a' + suffix + '.png');
        }

        var data1: string;
        try {
            data1 = this.imageDataPrefix + fs.readFileSync(screenshotsPath1).toString('base64');
        } catch (err) {
            data1 = '';
        }

        var data2: string;
        if (data1) {
            var screenshotsPath2: string;
            if (suffix == null) {
                screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b.png');
            } else {
                screenshotsPath2 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'b' + suffix + '.png');
            }
            try {
                data2 = this.imageDataPrefix + fs.readFileSync(screenshotsPath2).toString('base64');
            } catch (err) {
                data2 = '';
            }
        } else {
            data2 = '';
        }

        let musicFiles: string[] = this.getMusicFiles(genMsxId);

        return new GameSecondaryData(data1, data2, musicFiles);
    }

    private getMusicFiles(genMsxId: number): string[] {
        if (genMsxId && this.settingsService.getSettings().gameMusicPath) {
            let folder = path.join(this.settingsService.getSettings().gameMusicPath, genMsxId.toString());
            if (fs.existsSync(folder)) {
                var list: string[] = [];
                var contents: string[] = fs.readdirSync(folder, 'utf8');
                contents.forEach(file => {
                    list.push(path.join(folder, file));
                });
                list.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));
                return list;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    private openFileExplorer(file: string) {
        let fileManagerCommand = PlatformUtils.getFileManagerCommand(file);
        const ls = cp.exec(fileManagerCommand, function (error: cp.ExecException, stdout, stderr) {
            if (error) {
            }
        });
    }

    private getScreenshotVersion(): string {
        return this.getVersionValue(this.settingsService.getSettings().screenshotsPath, 'version.txt');
    }

    private getGameMusicVersion(): string {
        return this.getVersionValue(this.settingsService.getSettings().gameMusicPath, 'version.txt');
    }

    private getVersionValue(filepath: string, filename: string) :string {
        if (filepath) {
            let versionFile = path.join(filepath, filename);
            if (fs.existsSync(versionFile)) {
                return fs.readFileSync(versionFile).toString();
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
