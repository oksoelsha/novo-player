import { BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as Datastore from 'nedb';
import * as os from 'os';
import * as path from 'path';
import { Game } from '../src/app/models/game';
import { Totals } from '../src/app/models/totals';
import { GameDO } from './data/game-do';
import { EmulatorRepositoryService, RepositoryData } from './EmulatorRepositoryService';
import { HashService } from './HashService';
import { PersistenceUtils } from './utils/PersistenceUtils';

export class GamesService {

    private database: Datastore;
    private readonly databasePath: string = path.join(os.homedir(), 'Novo Player');
    private readonly databaseFile: string = path.join(this.databasePath, 'datafile');

    private repositoryInfo: Map<string, RepositoryData> = null;

    constructor(private win: BrowserWindow, private emulatorRepositoryService: EmulatorRepositoryService, private hashService: HashService) {
        this.database = new Datastore({ filename: this.databaseFile, autoload: true });
        this.repositoryInfo = this.emulatorRepositoryService.getRepositoryInfo();
        this.init();
    }

    saveGameFromScan(game: Game): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            var gameDO: GameDO = new GameDO(game);
            this.database.insert(gameDO, function (err: any, savedGame: GameDO) {
                return resolve(err == null);
            });
        });
    }

    private init() {
        ipcMain.on('getListings', (event, arg) => {
            this.getListings();
        });

        ipcMain.on('getGames', (event, listing: string) => {
            this.getGames(listing);
        });

        ipcMain.on('saveGame', (event, game: Game) => {
            this.saveGame(game);
        });

        ipcMain.on('removeGame', (event, game: Game) => {
            this.removeGame(game);
        });

        ipcMain.on('updateGame', (event, oldGame: Game, newGame: Game) => {
            this.updateGame(oldGame, newGame);
        });

        ipcMain.on('getTotals', (event, arg) => {
            this.getTotals();
        });

        ipcMain.on('search', (event, text: string) => {
            this.search(text);
        });

        ipcMain.on('renameListing', (event, oldName: string, newName: string) => {
            this.renameListing(oldName, newName);
        });

        ipcMain.on('deleteListing', (event, name: string) => {
            this.deleteListing(name);
        });

        ipcMain.on('setFavoritesFlag', (event, game: Game, flag: boolean) => {
            this.setFavoritesFlag(game, flag);
        });

        ipcMain.on('getFavorites', (event) => {
            this.getFavorites();
        });
    }

    private saveGame(game: Game) {
        var self = this;
        var gameDO: GameDO = new GameDO(game);
        this.database.insert(gameDO, function (err: any, savedGame: GameDO) {
            self.win.webContents.send('saveGameResponse', err == null);
        });
    }

    private removeGame(game: Game) {
        var self = this;
        this.database.remove({ _id: game.sha1Code }, {}, function (err: any, numRemoved: number) {
            self.win.webContents.send('removeGameResponse', numRemoved == 1);
        });
    }

    private getListings() {
        var self = this;
        let listings: string[] = [];
        let tempSet = new Set();
        this.database.find({}, function (err: any, entries: any) {
            for (var entry of entries) {
                if (!tempSet.has(entry.listing)) {
                    tempSet.add(entry.listing);
                    listings.push(entry.listing);
                }
            }

            self.win.webContents.send('getListingsResponse', listings);
        });
    }

    private getGames(listing: string) {
        var self = this;
        let games: Game[] = [];
        this.database.find({ listing: listing }, function (err: any, entries: any) {
            for (var entry of entries) {
                let gameDO: GameDO = new GameDO(entry);
                let game: Game = new Game(entry.name, entry._id, entry.size);

                for (var field of PersistenceUtils.fieldsToPersist) {
                    if (gameDO[field] != game[field]) {
                        game[field] = gameDO[field];
                    }
                }

                if (self.repositoryInfo != null) {
                    let repositoryData: RepositoryData = self.repositoryInfo.get(entry._id);
                    if (repositoryData != null) {
                        game.setTitle(repositoryData.title);
                        game.setSystem(repositoryData.system);
                        game.setCompany(repositoryData.company);
                        game.setYear(repositoryData.year);
                        game.setCountry(repositoryData.country);
                        game.setMapper(repositoryData.mapper);
                        game.setRemark(repositoryData.remark);
                        game.setStart(repositoryData.start);
                    }
                }
                games.push(game);
            }

            self.win.webContents.send('getGamesResponse', games);
        });
    }

    private updateGame(oldGame: Game, newGame: Game) {
        var self = this;
        var gameDO: GameDO = new GameDO(newGame);

        if (this.getGameMainFile(oldGame) == this.getGameMainFile(newGame)) {
            this.database.update({ _id: oldGame.sha1Code }, gameDO, {}, function () {
                self.win.webContents.send('updateGameResponse');
            });
        } else {
            if(!fs.existsSync(this.getGameMainFile(newGame))) {
                self.win.webContents.send('updateGameResponse', true);
            } else {
                this.hashService.getSha1Code(this.getGameMainFile(newGame)).then(data => {
                    if (oldGame.sha1Code == data.hash) {
                        //only allow a game to be updated if the changed main file has the same hash
                        //e.g. this can happen if the file was moved to a different folder
                        this.database.update({ _id: oldGame.sha1Code }, gameDO, {}, function () {
                            self.win.webContents.send('updateGameResponse');
                        });
                    } else {
                        self.win.webContents.send('updateGameResponse', true);
                    }
                });    
            }
        }
    }

    private getGameMainFile(game: Game): string {
        if (game.romA != null) {
            return game.romA;
        } else if (game.diskA != null) {
            return game.diskA;
        } else if (game.tape != null) {
            return game.tape;
        } else if (game.harddisk != null) {
            return game.harddisk;
        } else if (game.laserdisc != null) {
            return game.laserdisc;
        } else {
            return '';
        }
    }

    private getTotals() {
        var self = this;
        let totals: Totals;
        let listings:number = 0;
        let games:number = 0;
        let roms:number = 0;
        let disks:number = 0;
        let tapes:number = 0;
        let harddisks:number = 0;
        let laserdiscs:number = 0;
        let tempSet = new Set();
        this.database.find({}, function (err: any, entries: any) {
            games = entries.length;
            for (var entry of entries) {
                if (!tempSet.has(entry.listing)) {
                    tempSet.add(entry.listing);
                    listings++;
                }

                if (entry.romA != null) {
                    roms++;
                } else if (entry.diskA != null) {
                    disks++;
                } else if (entry.tape != null) {
                    tapes++;
                } else if (entry.harddisk != null) {
                    harddisks++;
                } else if (entry.laserdisc != null) {
                    laserdiscs++;
                }
            }
            totals = new Totals(listings, games, roms, disks, tapes, harddisks, laserdiscs);

            self.win.webContents.send('getTotalsResponse', totals);
        });
    }

    private search(text: string) {
        var self = this;
        let games: Game[] = [];
        let sanitizedText: string = text.replace(/[(){}[\]\\?|]/g,'');

        this.database.find({$or: [{name:{$regex: new RegExp(sanitizedText, 'i') }}, {_id:{$regex: new RegExp('^' + sanitizedText, 'i')}}]}, function (err: any, entries: any) {
            let index: number = 0;
            for (var entry of entries) {
                let gameDO: GameDO = new GameDO(entry);
                let game: Game = new Game(entry.name, entry._id, entry.size);
                game.setListing(gameDO.listing);

                games.push(game)
                if (++index == 10) {
                    break;
                }
            }
            games.sort((a: Game, b: Game) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            self.win.webContents.send('searchResponse_' + text, games);
        });
    }

    private renameListing(oldName: string, newName: string) {
        var self = this;
        this.database.update({ listing: oldName }, { $set: { listing: newName } }, { multi: true }, function () {
            self.win.webContents.send('renameListingResponse');
        });
    }

    private deleteListing(name: string) {
        var self = this;
        this.database.remove({ listing: name }, { multi: true }, function () {
            self.win.webContents.send('deleteListingResponse', true);
        });
    }

    private setFavoritesFlag(game: Game, flag: boolean) {
        var self = this;
        this.database.update({ _id: game.sha1Code }, { $set: { favorite: flag } }, {}, function () {
            self.win.webContents.send('setFavoritesFlagResponse', false);
        });
    }

    private getFavorites() {
        var self = this;
        let favorites: Game[] = [];
        this.database.find({ favorite: true }, function (err: any, entries: any) {
            for (var entry of entries) {
                let gameDO: GameDO = new GameDO(entry);
                let game: Game = new Game(entry.name, entry._id, entry.size);
                game.setListing(gameDO.listing);
                favorites.push(game)
            }
            favorites.sort((a: Game, b: Game) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            self.win.webContents.send('getFavoritesResponse', favorites)
        });
    }
}
