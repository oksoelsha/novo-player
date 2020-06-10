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
            new Game('MSX Baseball 1', 'Panasoft', 1984, 272, 'C:\\Games\\MSX System\\Software\\roms\\basebmsx.rom'),
            new Game('Ninja Princess', 'Pony Canyon', 1986, 820, 'C:\\Games\\MSX System\\Software\\roms\\NINJAPRI.ROM'),
            new Game('Pointless Fighting', 'SoftCorp', 2014, 10020, 'C:\\Games\\MSX System\\Software\\roms\\pfightin.rom'),
            new Game('Rambo', 'Pack-In-Video', 1985, 676, 'C:\\Games\\MSX System\\Software\\roms\\RAMBO.ROM'),
        ]
    }
}
