import { BrowserWindow } from 'electron'
import { ExtraData, ExtraDataService } from 'ExtraDataService'
import * as fs from 'fs'
import * as path from 'path'
import { FileTypeUtils } from './utils/FileTypeUtils'
import { Game } from '../src/app/models/game'
import { EmulatorRepositoryService, RepositoryData } from 'EmulatorRepositoryService'
import { GamesService } from 'GamesService'
import { HashService } from 'HashService'

export class ScanService {
    private extraDataInfo: Map<string, ExtraData>;
    private repositoryInfo: Map<string, RepositoryData>;
    private totalFilesToScan: number = 0;
    private scannedFilesCounter: number = 0;
    private totalAddedGamesCounter: number = 0;

    constructor(
        private win: BrowserWindow,
        private extraDataService: ExtraDataService,
        private emulatorRepositoryService: EmulatorRepositoryService,
        private gamesService: GamesService,
        private hashService: HashService) {

        this.extraDataInfo = extraDataService.getExtraDataInfo();
        this.repositoryInfo = emulatorRepositoryService.getRepositoryInfo();
    }

    start(items: string[], listing:string, machine: string) {
            //before scanning, first get total files in given file and directories
            this.totalFilesToScan = this.countTotalFilesToScan(items);

            this.scan(items, listing, machine);
    }

    private countTotalFilesToScan(items: string[]): number {
        var count: number = 0;
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
                var fullPath: string = path.join(item, one);
                if (fs.statSync(fullPath).isDirectory()) {
                    count += this.getTotalFiles(fullPath) - 1;
                }
            })
            return count;
        } else {
            return 1;
        }
    }

    private scan(items: string[], listing:string, machine: string) {
        for (const item of items) {
            this.readItem(item, listing, machine);
        }
    }

    private readItem(item: string, listing: string, machine: string) {
        if (fs.statSync(item).isDirectory()) {
            var currentDirectory = fs.readdirSync(item, 'utf8');
            currentDirectory.forEach(file => {
                var fullPath: string = path.join(item, file);
                this.readItem(fullPath, listing, machine);
            });
        } else {
            if (FileTypeUtils.isMSXFile(item)) {
                this.processFile(item, listing, machine);
            } else {
                this.incrementScanCounterAndCheckIfFinished();
            }
        }
    }

    private incrementScanCounterAndCheckIfFinished() {
        this.scannedFilesCounter++;
        this.win.setProgressBar(this.scannedFilesCounter / this.totalFilesToScan);
        if (this.scannedFilesCounter == this.totalFilesToScan) {
            this.finishScan();
        }
    }

    private finishScan() {
        this.win.setProgressBar(0);
        this.win.webContents.send('scanResponse', this.totalAddedGamesCounter);
    }

    private processFile(filename: string, listing:string, machine: string) {
        var sha1: Promise<any> = this.hashService.getSha1Code(filename);
        sha1.then((data: any) => {
            if (data != null) {
                var extraData: ExtraData = this.extraDataInfo.get(data.hash);
                var game: Game = new Game(this.getGameName(data.hash, data.filename), data.hash, data.size);

                this.setMainFileForGame(game, filename, data.filename);
                game.setMachine(machine);
                game.setListing(listing);

                if (extraData != null) {
                    game.setGenerationMSXId(extraData.generationMSXID);
                    game.setScreenshotSuffix(extraData.suffix);
                    game.setGenerations(extraData.generations);
                    game.setSounds(extraData.soundChips);
                    game.setGenre1(extraData.genre1);
                    game.setGenre2(extraData.genre2);
                }

                this.gamesService.saveGameFromScan(game).then((success:boolean) => {
                    if (success) {
                        this.totalAddedGamesCounter++;
                    }
                    this.incrementScanCounterAndCheckIfFinished();
                });
            } else {
                this.incrementScanCounterAndCheckIfFinished();
            }
        }).catch(error => this.incrementScanCounterAndCheckIfFinished());
    }

    private setMainFileForGame(game: Game, filename: string, realFilename: string ) {
        if (FileTypeUtils.isROM(realFilename)) {
            game.setRomA(filename);
        } else if (FileTypeUtils.isDisk(realFilename)) {
            if (game.size <= FileTypeUtils.MAX_DISK_FILE_SIZE) {
                game.setDiskA(filename);
            } else {
                game.setHarddisk(filename);
                game.setExtensionRom(FileTypeUtils.EXTENSION_ROM_IDE);
            }
        } else if (FileTypeUtils.isTape(realFilename)) {
            game.setTape(filename);
        } else if (FileTypeUtils.isHarddisk(realFilename)) {
            game.setHarddisk(filename);
            game.setExtensionRom(FileTypeUtils.EXTENSION_ROM_IDE);
        } else if (FileTypeUtils.isLaserdisc(realFilename)) {
            game.setLaserdisc(filename);
        }
    }
 
    private getGameName(hash: string, file: string): string {
        if (this.repositoryInfo != null) {
            let repositoryData: RepositoryData = this.repositoryInfo.get(hash);
            if (repositoryData != null) {
                //force game title to be string for account for game names that are numbers (e.g. 1942)
                return repositoryData.title.toString();
            } else {
                return FileTypeUtils.getFilenameWithoutExt(path.basename(file));
            }
        } else {
            return FileTypeUtils.getFilenameWithoutExt(path.basename(file));
        }
    }
}
