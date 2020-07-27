import { BrowserWindow, ipcMain } from 'electron'
import { Game } from '../src/app/models/game'
import { EmulatorRepositoryService, RepositoryData } from 'EmulatorRepositoryService';

export class GamesService {

    games: Game[];

    constructor(private win: BrowserWindow, private emulatorRepositoryService: EmulatorRepositoryService) { }

    init() {
        ipcMain.on('getGames', (event, arg) => {
            this.games = this.getGames();
            this.win.webContents.send('getGamesResponse', this.games)
        })
    }

    private getGames(): Game[] {
        //get from db
        let games: Game[] = [
        ]

        let repositoryInfo: Map<string, RepositoryData> = this.emulatorRepositoryService.getRepositoryInfo()

        games.forEach((game) => {
            let repositoryData: RepositoryData = repositoryInfo.get(game.sha1Code)
            if (repositoryData != null) {
                game.setTitle(repositoryData.title)
                game.setCompany(repositoryData.company)
                game.setYear(repositoryData.year)
                game.setCountry(repositoryData.country)
                game.setMapper(repositoryData.mapper)
                game.setRemark(repositoryData.remark)
            }
        });

        return games;
    }
}
