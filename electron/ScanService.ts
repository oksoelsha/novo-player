import * as crypto from 'crypto';
import { ipcMain, BrowserWindow } from 'electron';
import { ExtraData, ExtraDataService } from 'ExtraDataService';
import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';
import { FileTypeUtils } from './utils/FileTypeUtils';
import { Game } from '../src/app/models/game'
import { EmulatorRepositoryService, RepositoryData } from 'EmulatorRepositoryService';
import { GamesService } from 'GamesService';

export class ScanService {
    private extraDataInfo: Map<string, ExtraData>;
    private repositoryInfo: Map<string, RepositoryData>;
    private totalFilesToScan: number = 0
    private scannedFilesCounter: number = 0

    constructor(
        private win: BrowserWindow,
        private extraDataService: ExtraDataService,
        private emulatorRepositoryService: EmulatorRepositoryService,
        private gamesService: GamesService) {

        this.extraDataInfo = extraDataService.getExtraDataInfo()
        this.repositoryInfo = emulatorRepositoryService.getRepositoryInfo()
    }

    start(items: string[], machine: string) {
            //before scanning, first get total files in given file and directories
            this.totalFilesToScan = this.countTotalFilesToScan(items)

            this.scan(items, machine)
    }

    private countTotalFilesToScan(items: string[]): number {
        var count: number = 0
        for (const item of items) {
            count += this.getTotalFiles(item);
        }
        return count;
    }

    private getTotalFiles(item: string): number {
        if (fs.statSync(item).isDirectory()) {
            var contents: string[] = fs.readdirSync(item, 'utf8');
            var count: number = contents.length;
            contents.forEach(one => {
                var fullPath: string = path.join(item, one)
                if (fs.statSync(fullPath).isDirectory()) {
                    count += this.getTotalFiles(fullPath) - 1;
                }
            })
            return count;
        } else if (FileTypeUtils.isMSXFile(item)) {
            return 1;
        } else {
            return 0;
        }
    }

    private scan(items: string[], machine: string) {
        for (const item of items) {
            this.readFolder(item, machine)
        }
    }

    private readFolder(item: string, machine: string) {
        if (fs.statSync(item).isDirectory()) {
            var currentDirectory = fs.readdirSync(item, 'utf8');
            currentDirectory.forEach(file => {
                var fullPath: string = path.join(item, file)
                if (fs.statSync(fullPath).isFile()) {
                    if(FileTypeUtils.isMSXFile(fullPath)) {
                        this.processFile(fullPath, machine)
                    } else {
                        //a file that wasn't processed was still scanned
                        this.scannedFilesCounter++;
                    }
                } else {
                    this.readFolder(fullPath, machine);
                }
            })
        } else {
            if(FileTypeUtils.isMSXFile(item)) {
                this.processFile(item, machine)
            } else {
                //a file that wasn't processed was still scanned
                this.scannedFilesCounter++;
            }
        }
    }

    private setMainFileForGame(game: Game, filename: string, realFilename: string ) {
        if (FileTypeUtils.isROM(realFilename)) {
            game.setRomA(filename)
        } else if (FileTypeUtils.isDisk(realFilename)) {
            if (game.size <= FileTypeUtils.MAX_DISK_FILE_SIZE) {
                game.setDiskA(filename)
            } else {
                game.setHarddisk(filename);
                game.setExtensionRom(FileTypeUtils.EXTENSION_ROM_IDE);
            }
        } else if (FileTypeUtils.isTape(realFilename)) {
            game.setTape(filename)
        } else if (FileTypeUtils.isHarddisk(realFilename)) {
            game.setHarddisk(filename)
            game.setExtensionRom(FileTypeUtils.EXTENSION_ROM_IDE);
        } else if (FileTypeUtils.isLaserdisc(realFilename)) {
            game.setLaserdisc(filename)
        }
    }

    private processFile(filename: string, machine: string) {
        var sha1 = this.getSha1(filename);
        sha1.then((data: any) => {
            var extraData: ExtraData = this.extraDataInfo.get(data.hash)
            var game: Game = new Game(this.getGameName(data.hash, data.filename), data.hash, data.size)

            this.setMainFileForGame(game, filename, data.filename)
            game.setMachine(machine)

            if (extraData != null) {
                game.setGenerationMSXId(extraData.generationMSXID)
                game.setScreenshotSuffix(extraData.suffix)
                game.setGenerations(extraData.generations)
                game.setSounds(extraData.soundChips)
                game.setGenre1(extraData.genre1)
                game.setGenre2(extraData.genre2)
            }

            this.scannedFilesCounter++

            if (this.scannedFilesCounter == this.totalFilesToScan) {
                this.gamesService.saveGameInBatch(game, this.finishScan, this);
            } else {
                this.gamesService.saveGameInBatch(game);
            }
        });
    }

    private finishScan(totalAddedToDatabase: number, ref: any) {
        ref.win.webContents.send('scanResponse', totalAddedToDatabase)
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
        let index: number;
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
                return FileTypeUtils.getFilenameWithoutExt(path.basename(file))
            }
        } else {
            return FileTypeUtils.getFilenameWithoutExt(path.basename(file))
        }
    }
}
