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
        let games: Game[] = [
            new Game('Nemesis', 'C:\\Games\\MSX System\\Software\\old-scc-Konami\\Improved SCC\\gradius.rom', 'e31ac6520e912c27ce96431a1dfb112bf71cb7b9', 742),
            new Game('Nemesis II', 'C:\\Games\\MSX System\\Software\\cheats\\NEM2-INV.ROM', 'ab30cdeaacbdf14e6366d43d881338178fc665cb', 932),
            new Game('Car Fighter', 'C:\\Games\\MSX System\\Software\\roms\\CARFIGHT.ROM', 'e93c396649bf6328103e8da0247952ebef2a04e9', 412),
            new Game('F1 Spirit - The Way To Formula 1', 'C:\\Games\\MSX System\\Software\\roms\\F1SPIRIT.ROM', '42fbb18722df3e34e5b0f935a2dc0ce0d85099e9', 905),
            new Game('King\'s Valley 2 - The Seal Of El Giza', 'C:\\Games\\MSX System\\Software\\roms\\VALLEY22.ROM', '5ec8811254dc762c6852289a08acf22954404f0d', 1079),
            new Game('MSX Baseball 1', 'C:\\Games\\MSX System\\Software\\roms\\basebmsx.rom', '76d488497d9ba54b302a4326f45909f643bdcd7a', 272),
            new Game('Ninja Princess', 'C:\\Games\\MSX System\\Software\\roms\\NINJAPRI.ROM', '9dfc71887ffc6d94b8780b5d6f207e24c1f58b54', 820),
            new Game('Pointless Fighting', 'C:\\Games\\MSX System\\Software\\roms\\pfightin.rom', 'f026d150f97a1c9a13a5d5ce3e2621f7214b9dbb', 10020),
            new Game('Rambo', 'C:\\Games\\MSX System\\Software\\roms\\RAMBO.ROM', 'fe1d02284b0b051308e3c796e8e9eee2f86521b8', 676),
            new Game('Gofer no Yabou Episode 2 - Nemesis 3 The Eve Of Destruction', 'C:\\Games\\MSX System\\Software\\cheats\\Nem3-inv.rom', '7393f677e0fae5fc83071c6b74756117b7d75e2d', 1254),
        ]

        let repositoryInfo: Map<string, RepositoryData> = this.emulatorRepositoryService.getRepositoryInfo()

        games.forEach((game) => {
            let repositoryData: RepositoryData = repositoryInfo.get(game.sha1Code)
            if (repositoryData != null) {
                game.setCompany(repositoryData.company)
                game.setYear(repositoryData.year)
            }
        });

        return games;
    }
}
