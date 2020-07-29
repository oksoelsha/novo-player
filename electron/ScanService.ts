import * as crypto from 'crypto';
import { BrowserWindow, ipcMain } from 'electron';
import { ExtraData, ExtraDataService } from 'ExtraDataService';
import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';
import { FileTypeUtils } from './utils/FileTypeUtils';
import { Game } from '../src/app/models/game'
import { EmulatorRepositoryService, RepositoryData } from 'EmulatorRepositoryService';

export class ScanService {
    private extraDataInfo: Map<string, ExtraData>;
    private repositoryInfo: Map<string, RepositoryData>;
    private totalFilesToScan: number = 0
    private scannedFilesCounter: number = 0
    private games: Game[] = []

    constructor(
        private win: BrowserWindow,
        private extraDataService: ExtraDataService,
        private emulatorRepositoryService: EmulatorRepositoryService) {

        this.extraDataInfo = extraDataService.getExtraDataInfo()
        this.repositoryInfo = emulatorRepositoryService.getRepositoryInfo()
    }

    init() {
        ipcMain.on('scan', (event, arg: string[]) => {
            //before scanning, first get total files in given folders
            this.totalFilesToScan = this.countTotalFilesToScan(arg)

            this.startScan(arg)
        })
    }

    private countTotalFilesToScan(folderList: string[]): number {
        var count: number = 0
        for (const folder of folderList) {
            count += this.getTotalPerFolder(folder)
        }
        return count;
    }

    private getTotalPerFolder(folder: string): number {
        var contents = fs.readdirSync(folder, 'utf8');
        var count: number = contents.length
        contents.forEach(folderName => {
            var fullPath: string = path.join(folder, folderName)
            if (fs.statSync(fullPath).isDirectory()) {
                count += this.getTotalPerFolder(fullPath) - 1
            }
        })
        return count
    }

    private startScan(folderList: string[]) {
        for (const folder of folderList) {
            this.readFolder(folder)
        }
    }

    private readFolder(folder: string) {
        var currentDirectory = fs.readdirSync(folder, 'utf8');
        currentDirectory.forEach(file => {
            var fullPath: string = path.join(folder, file)
            if (fs.statSync(fullPath).isFile()) {
                this.processFile(fullPath)
            } else {
                this.readFolder(fullPath);
            }
        })
    }

    private processFile(file: string) {
        var sha1 = this.getSha1(file);
        sha1.then((hash) => {
            var extraData: ExtraData = this.extraDataInfo.get(hash)
            var game: Game = new Game(this.getGameName(hash, file), file, hash)

            if (extraData != null) {
                game.setGenerationMSXId(extraData.generationMSXID)
            }

            if (this.repositoryInfo != null) {
                let repositoryData: RepositoryData = this.repositoryInfo.get(hash)
                if (repositoryData != null) {
                    game.setTitle(repositoryData.title)
                    game.setCompany(repositoryData.company)
                    game.setYear(repositoryData.year)
                    game.setCountry(repositoryData.country)
                    game.setMapper(repositoryData.mapper)
                    game.setRemark(repositoryData.remark)
                }
            }

            this.games.push(game)

            this.scannedFilesCounter++
            if (this.scannedFilesCounter == this.totalFilesToScan) {
                this.win.webContents.send('scanResponse', this.games)
            }
        });
    }

    private getSha1(filename: string): Promise<string> {
        let shasum = crypto.createHash('sha1');
        if (FileTypeUtils.isZip(filename)) {
            const StreamZip = require('node-stream-zip')
            return new Promise<string>((resolve, reject) => {
                let zip = new StreamZip({
                    file: filename,
                    storeEntries: true
                })
                zip.on('ready', () => {
                    let entries = Object.keys(zip.entries()).map(e => zip.entries()[e])
                    if (entries.length > 0) {
                        zip.stream(entries[0].name, function (err: string, stm: Stream) {
                            stm.on('data', function (data) {
                                shasum.update(data)
                            })
                            stm.on('end', function () {
                                const hash = shasum.digest('hex')
                                zip.close()
                                return resolve(hash);
                            })
                        })
                    }
                });
            });
        } else {
            return new Promise<string>((resolve, reject) => {
                let s: fs.ReadStream = fs.createReadStream(filename)
                s.on('data', function (data) {
                    shasum.update(data)
                })
                s.on('end', function () {
                    const hash = shasum.digest('hex')
                    return resolve(hash);
                })
            });
        }
    }

    private getGameName(hash: string, file: string): string {
        if (this.repositoryInfo != null) {
            let repositoryData: RepositoryData = this.repositoryInfo.get(hash)
            if (repositoryData != null) {
                return repositoryData.title
            } else {
                return path.basename(file)
            }
        } else {
            return path.basename(file)
        }
    }
}
