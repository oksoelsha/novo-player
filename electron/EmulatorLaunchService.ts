import { ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as cp from 'child_process'

export class EmulatorLaunchService {

    constructor(private settingsService: SettingsService) { }

    init() {
        ipcMain.on('launchGame', (event, arg) => {
            var openmsx= '"' + path.join(this.settingsService.getSettings().openmsxPath, 'openmsx.exe') + '"';
            var args = ' -carta "' + arg.rom + '"';
            const ls = cp.exec(openmsx + args, function (error, stdout, stderr) {
                if (error) {
                    console.log(error.stack);
                }
            });
        })
    }
}
