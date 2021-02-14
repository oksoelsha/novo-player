import { ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as cp from 'child_process'
import { Game } from '../src/app/models/game'

export class EmulatorLaunchService {

    private static readonly fieldsToArgs = [
        ["machine", "machine"],
        ["romA", "carta"],
        ["romB", "cartb"],
        ["diskA", "diska"],
        ["diskB", "diskb"],
        ["tape", "cassetteplayer"],
        ["harddisk", "hda"],
        ["extensionRom", "ext"],
        ["laserdisc", "laserdisc"],
    ];

    constructor(private settingsService: SettingsService) { }

    init() {
        ipcMain.on('launchGame', (event, game: Game) => {
            this.launch(game)
        })
    }

    private launch(game: Game) {
        var openmsx= '"' + path.join(this.settingsService.getSettings().openmsxPath, 'openmsx.exe') + '" ';
        const ls = cp.exec(openmsx + this.getArguments(game), function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack)
            }
        });
    }

    private getArguments(game: Game): string {
        return EmulatorLaunchService.fieldsToArgs
            .filter(e => game[e[0]])
            .map(e => '-' + e[1] + ' "' + game[e[0]] + '"')
            .join(' ');
    }
}
