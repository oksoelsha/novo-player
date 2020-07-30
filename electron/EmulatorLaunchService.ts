import { ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as cp from 'child_process'
import { Game } from '../src/app/models/game'

export class EmulatorLaunchService {

    constructor(private settingsService: SettingsService) { }

    init() {
        ipcMain.on('launchGame', (event, game: Game) => {
            this.launch(game)
        })
    }

    private launch(game: Game) {
        var openmsx= '"' + path.join(this.settingsService.getSettings().openmsxPath, 'openmsx.exe') + '"';
        var args = this.getGameFileArg(game) + this.getMachineArg(game)
        const ls = cp.exec(openmsx + args, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack)
            }
        });
    }

    private getGameFileArg(game: Game): string {
        if (game.romA != null) {
            return ' -carta "' + game.romA + '"'
        } else if (game.diskA != null) {
            return ' -diska "' + game.diskA + '"'
        } else if (game.tape != null) {
            return ' -cassetteplayer "' + game.tape + '"'
        } else {
            return ''
        }
    }

    private getMachineArg(game: Game) {
        return ' -machine "' + game.machine + '"'
    }
}
