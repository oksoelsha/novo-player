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
                if(FileTypeUtils.isMSXFile(fullPath)) {
                    this.processFile(fullPath)
                } else {
                    //a file that wasn't processed was still scanned
                    this.scannedFilesCounter++;
                }
            } else {
                this.readFolder(fullPath);
            }
        })
    }

    private setMainFileForGame(game: Game, filename: string, realFilename ) {
        if (FileTypeUtils.isROM(realFilename)) {
            game.setRomA(filename)
        } else if (FileTypeUtils.isDisk(realFilename)) {
            game.setDiskA(filename)
        } else if (FileTypeUtils.isTape(realFilename)) {
            game.setTape(filename)
        } else if (FileTypeUtils.isHarddisk(realFilename)) {
            game.setHarddisk(filename)
        } else if (FileTypeUtils.isLaserdisc(realFilename)) {
            game.setLaserdisc(filename)
        }
    }

    private processFile(filename: string) {
        var sha1 = this.getSha1(filename);
        sha1.then((data) => {
            var extraData: ExtraData = this.extraDataInfo.get(data.hash)
            var game: Game = new Game(this.getGameName(data.hash, filename), data.hash, data.size)

            this.setMainFileForGame(game, filename, data.filename)
            game.setMachine('Boosted_MSX2_EN')

            if (extraData != null) {
                game.setGenerationMSXId(extraData.generationMSXID)
                game.setScreenshotSuffix(extraData.suffix)
            }

            if (this.repositoryInfo != null) {
                let repositoryData: RepositoryData = this.repositoryInfo.get(data.hash)
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

    private getSha1(filename: string): Promise<any> {
        let shasum = crypto.createHash('sha1');
        if (FileTypeUtils.isZip(filename)) {
            const StreamZip = require('node-stream-zip')
            return new Promise<any>((resolve, reject) => {
                let zip = new StreamZip({
                    file: filename,
                    storeEntries: true
                })
                zip.on('ready', () => {
                    let entries = Object.keys(zip.entries()).map(e => zip.entries()[e])
                    let msxFileIndex = this.getMSXFileIndexInZip(entries);
                    if (msxFileIndex < entries.length) {
                        zip.stream(entries[msxFileIndex].name, function (err: string, stm: Stream) {
                            stm.on('data', function (data) {
                                shasum.update(data)
                            })
                            stm.on('end', function () {
                                const hash = shasum.digest('hex')
                                zip.close()
                                return resolve({"hash": hash, "size": entries[msxFileIndex].size, "filename": entries[msxFileIndex].name});
                            })
                        })
                    } else {
                        return resolve({});
                    }
                });
            });
        } else {
            return new Promise<any>((resolve, reject) => {
                let s: fs.ReadStream = fs.createReadStream(filename)
                s.on('data', function (data) {
                    shasum.update(data)
                })
                s.on('end', function () {
                    const hash = shasum.digest('hex')
                    return resolve({"hash": hash, "size": fs.statSync(filename)["size"], "filename": filename});
                })
            });
        }
    }

    private getMSXFileIndexInZip(entries: any): number {
        let index: number = 0;
        for(index = 0; index < entries.length; index++) {
            if(FileTypeUtils.isMSXFile(entries[index].name)) {
                return index;
            }
        }

        return index;
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
