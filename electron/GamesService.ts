import { BrowserWindow, ipcMain } from 'electron'
import { Game } from '../src/app/models/game'
import { EmulatorRepositoryService, RepositoryData } from './EmulatorRepositoryService';
import * as Datastore from 'nedb'
import * as os from 'os';
import * as path from 'path'
import { GameDO } from './data/game-do';
import { PersistenceUtils } from './utils/PersistenceUtils';

export class GamesService {

    private database: Datastore;
    private readonly databasePath: string = path.join(os.homedir(), 'Novo Player');
    private readonly databaseFile: string = path.join(this.databasePath, 'datafile');

    private repositoryInfo: Map<string, RepositoryData> = null;
    private totalAddedToDatabase: number = 0;

    constructor(private win: BrowserWindow, private emulatorRepositoryService: EmulatorRepositoryService) {
        this.database = new Datastore({ filename: this.databaseFile, autoload: true });
        this.repositoryInfo = this.emulatorRepositoryService.getRepositoryInfo()
    }

    init() {
        ipcMain.on('getGames', (event, arg) => {
            this.getGames();
        });

        ipcMain.on('saveGame', (event, game: Game) => {
            this.saveGame(game);
        });

        ipcMain.on('removeGame', (event, game: Game) => {
            this.removeGame(game);
        });
    }

    saveGameInBatch(game: Game, reportResult: any = null, ref: any = null) {
        var self = this;
        var gameDO: GameDO = new GameDO(game);
        this.database.insert(gameDO, function (err: any, savedGame: GameDO) {
            if (err == null) {
                self.totalAddedToDatabase++;
            }
            if (reportResult != null) {
                reportResult(self.totalAddedToDatabase, ref);
                self.totalAddedToDatabase = 0;
            }
        });
    }

    private saveGame(game: Game) {
        var self = this;
        var gameDO: GameDO = new GameDO(game);
        this.database.insert(gameDO, function (err: any, savedGame: GameDO) {
            self.win.webContents.send('saveGameResponse', err == null)
        });
    }

    private removeGame(game: Game) {
        var self = this;
        this.database.remove({ _id: game.sha1Code }, {}, function (err: any, numRemoved: number) {
            self.win.webContents.send('removeGameResponse', numRemoved == 1)
        });
    }

    private getGames() {
        var self = this;
        let games: Game[] = []
        this.database.find({}, function (err: any, entries: any) {
            for (var entry of entries) {
                let gameDO: GameDO = new GameDO(entry);
                let game: Game = new Game(entry.name, entry._id, entry.size);

                for (var field of PersistenceUtils.fieldsToPersist) {
                    if (gameDO[field] != game[field]) {
                        game[field] = gameDO[field]
                    }
                }

                if (self.repositoryInfo != null) {
                    let repositoryData: RepositoryData = self.repositoryInfo.get(entry._id)
                    if (repositoryData != null) {
                        game.setTitle(repositoryData.title)
                        game.setSystem(repositoryData.system)
                        game.setCompany(repositoryData.company)
                        game.setYear(repositoryData.year)
                        game.setCountry(repositoryData.country)
                        game.setMapper(repositoryData.mapper)
                        game.setRemark(repositoryData.remark)
                        game.setStart(repositoryData.start)
                    }
                }
                games.push(game)
            }

            self.win.webContents.send('getGamesResponse', games)
        });
    }
}
