import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { SettingsService } from 'SettingsService';
import { GameSecondaryData } from '../src/app/models/secondary-data';
import * as cp from 'child_process'
import { PlatformUtils } from './utils/PlatformUtils';
import { FileTypeUtils } from './utils/FileTypeUtils';

export class FilesService {

    private imageDataPrefix: string = 'data:image/png;base64,';

    constructor(private win: BrowserWindow, private settingsService: SettingsService) {
        this.init();
    }

    private init() {
        ipcMain.on('getSecondaryData', (event, sha1Code, genMsxId, suffix) => {
            let secondaryData = this.getSecondaryData(genMsxId, suffix);
            this.win.webContents.send('getSecondaryDataResponse' + sha1Code, secondaryData);
        })

        ipcMain.on('openFileExplorer', (event, file) => {
            this.openFileExplorer(file);
        });

        ipcMain.on('getWebMSXPath', (event, folder: string, file: string) => {
            let fullpath: string = path.join(folder, file);
            if (fs.existsSync(fullpath)) {
                this.win.webContents.send('getWebMSXPathResponse', fullpath);
            } else {
                this.win.webContents.send('getWebMSXPathResponse', null);
            }
        });

        ipcMain.on('getScreenshotsVersion', (event) => {
            let screenshotVersion = this.getScreenshotVersion();
            this.win.webContents.send('getScreenshotsVersionResponse', screenshotVersion);
        });

        ipcMain.on('getGameMusicVersion', (event) => {
            let gameMusicVersion = this.getGameMusicVersion();
            this.win.webContents.send('getGameMusicVersionResponse', gameMusicVersion);
        });

        ipcMain.on('getFileGroup', (event, pid: number, filename: string) => {
            let fileGroup = this.getFileGroup(filename);
            this.win.webContents.send('getFileGroupResponse' + pid, fileGroup);
        });
    }

    private getSecondaryData(genMsxId: number, suffix: string): GameSecondaryData {
        var screenshotsPath1: string;
        if (suffix == null) {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a.png');
        } else {
            screenshotsPath1 = path.join(this.settingsService.getSettings().screenshotsPath, genMsxId + 'a' + suffix + '.png');
        }

        let data1: string;
        try {
            data1 = this.imageDataPrefix + fs.readFileSync(screenshotsPath1).toString('base64');
        } catch (err) {
            data1 = '';
        }

        let data2: string;
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

    private getFileGroup(filename: string): string[] {
        const diskPatternIndexParenthesis = filename.indexOf('(Disk ');
        const diskPatternIndexSquare = filename.indexOf('[Disk ');
        let counterIndex: number;
        if (diskPatternIndexParenthesis > 0 && filename.indexOf(' of ') == (diskPatternIndexParenthesis + 7)) {
            counterIndex = diskPatternIndexParenthesis + 6;
        } else if (diskPatternIndexSquare > 0 && filename.indexOf(' of ') == (diskPatternIndexSquare + 7)) {
            counterIndex = diskPatternIndexSquare + 6;
        } else {
            counterIndex = filename.lastIndexOf('.') - 1;
        }

        return this.examineFileFormat(filename, counterIndex);
    }

    private examineFileFormat(filename: string, counterIndex: number): string[] {
        const counterCharacter = filename.charAt(counterIndex);
        let potentialMatches: string[] = [];
        let currentDirectory = path.dirname(filename);
        let files = fs.readdirSync(currentDirectory, 'utf8');
        files.forEach(file => {
            var fullPath: string = path.join(currentDirectory, file);
            if (fullPath.substring(0, counterIndex - 1) == filename.substring(0, counterIndex - 1) &&
                fullPath.substring(counterIndex + 1) == filename.substring(counterIndex + 1)) {
                potentialMatches.push(fullPath);
            }
        });
        potentialMatches = potentialMatches.sort();
        const matches: string[] = [];
        let done: boolean = false;
        let index = 0;
        let fileCounter = counterCharacter;
        for (index; index < potentialMatches.length && !done; index++) {
            if (fileCounter == potentialMatches[index].charAt(counterIndex)) {
                matches.push(potentialMatches[index]);
                fileCounter = String.fromCharCode((fileCounter.charCodeAt(0) + 1));
            } else {
                done = true;
            }
        }
        return matches;
    }
}
