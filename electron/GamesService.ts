import { BrowserWindow, ipcMain } from 'electron'
import { Game } from '../src/app/models/game'

export class GamesService {

    games: Game[];

    constructor(private win: BrowserWindow) { }

    init() {
        ipcMain.on('getGames', (event, arg) => {
            this.games = this.getGames();
            this.win.webContents.send('getGamesResponse', this.games)
        })
    }

    private getGames(): Game[] {
        return [
            new Game('Nemesis', 'Konami', 1986, 742, 'C:\\Games\\MSX System\\Software\\old-scc-Konami\\Improved SCC\\gradius.rom'),
            new Game('Nemesis II', 'Konami', 1987, 932, 'C:\\Games\\MSX System\\Software\\cheats\\NEM2-INV.ROM'),
            new Game('Car Fighter', 'CASIO', 1985, 412, 'C:\\Games\\MSX System\\Software\\roms\\CARFIGHT.ROM'),
            new Game('F1 Spirit - The Way To Formula 1', 'Konami', 1987, 905, 'C:\\Games\\MSX System\\Software\\roms\\F1SPIRIT.ROM'),
            new Game('King\'s Valley 2 - The Seal Of El Giza', 'Konami', 1988, 1079, 'C:\\Games\\MSX System\\Software\\roms\\VALLEY22.ROM'),
        ]
    }
}
