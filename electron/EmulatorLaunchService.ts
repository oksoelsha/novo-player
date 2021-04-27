import { BrowserWindow, ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as cp from 'child_process'
import * as os from 'os';
import { Game } from '../src/app/models/game'
import { PlatformUtils } from './utils/PlatformUtils';

class TCLCommands {
    field: string;
    argCommands: string[][];

    constructor(field: string, argCommands: string[][]) {
        this.field = field;
        this.argCommands = argCommands;
    }
}

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

    private static readonly Input_Device_JOYSTICK: string = 'plug joyporta joystick1';
    private static readonly Input_Device_JOYSTICK_KEYBOARD: string = 'plug joyporta keyjoystick1';
    private static readonly Input_Device_MOUSE: string = 'plug joyporta mouse';
    private static readonly Input_Device_ARKANOID_PAD: string = 'plug joyporta arkanoidpad';
    private static readonly Input_Device_TRACKBALL: string = 'plug joyportb trackball';
    private static readonly Input_Device_TOUCHPAD: string = 'plug joyportb touchpad';

    private static readonly FDD_MODE_DISABLE_SECOND: string = 'after boot { keymatrixdown 6 2; after time 14 \\\"keymatrixup 6 2\\\" }';
    private static readonly FDD_MODE_DISABLE_BOTH: string = 'after boot { keymatrixdown 6 1; after time 14 \\\"keymatrixup 6 1\\\" }';

    private static readonly ENABLE_GFX9000_CMD: string = 'ext gfx9000; ' +
        'ext slotexpander; ' + 'after time 10 \\\"set videosource GFX9000\\\"';

    private static readonly tclCommandArgs: TCLCommands[] = [
        new TCLCommands('inputDevice', [
            ["1", EmulatorLaunchService.Input_Device_JOYSTICK],
            ["2", EmulatorLaunchService.Input_Device_JOYSTICK_KEYBOARD],
            ["3", EmulatorLaunchService.Input_Device_MOUSE],
            ["4", EmulatorLaunchService.Input_Device_ARKANOID_PAD],
            ["5", EmulatorLaunchService.Input_Device_TRACKBALL],
            ["6", EmulatorLaunchService.Input_Device_TOUCHPAD]
        ])
        ,
        new TCLCommands('fddMode', [
            ["1", EmulatorLaunchService.FDD_MODE_DISABLE_SECOND],
            ["2", EmulatorLaunchService.FDD_MODE_DISABLE_BOTH]
        ])
        ,
        new TCLCommands('connectGFX9000', [
            ["true", EmulatorLaunchService.ENABLE_GFX9000_CMD]
        ])
    ];

    private static readonly LAUNCH_ERROR_SPLIT_MSG_UNCAUGHT = "Uncaught exception: ";
    private static readonly LAUNCH_ERROR_SPLIT_MSG_ERROR_IN = "Error in ";

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('launchGame', (event, game: Game, time: number) => {
            this.launch(game, time)
        })
    }

    private launch(game: Game, time: number) {
        var self = this;
        var openmsx = '"' + path.join(this.settingsService.getSettings().openmsxPath, PlatformUtils.getOpenmsxBinary()) + '" ';
        const ls = cp.exec(openmsx + this.getArguments(game), function (error: cp.ExecException, stdout, stderr) {
            if (error) {
                console.log(error.message);
                let errorMessage: string;
                let splitText: string = self.getSplitText(error);
                if (splitText) {
                    errorMessage = error.message.substring(error.message.indexOf(splitText) + splitText.length);
                } else {
                    errorMessage = "Error launching openMSX";
                }
                self.win.webContents.send('launchGameResponse' + time, errorMessage);
            } else {
                //this is called when openMSX window is closed
                self.win.webContents.send('launchGameResponse' + time);
            }
        });
    }

    private getSplitText(error: cp.ExecException): string {
        if (error.message.indexOf(EmulatorLaunchService.LAUNCH_ERROR_SPLIT_MSG_UNCAUGHT) > 0) {
            return EmulatorLaunchService.LAUNCH_ERROR_SPLIT_MSG_UNCAUGHT;
        } else if (error.message.indexOf(EmulatorLaunchService.LAUNCH_ERROR_SPLIT_MSG_ERROR_IN) > 0) {
            return EmulatorLaunchService.LAUNCH_ERROR_SPLIT_MSG_ERROR_IN;
        } else {
            return null;
        }
    }

    private getArguments(game: Game): string {
        var basicArgs = EmulatorLaunchService.fieldsToArgs
            .filter(e => game[e[0]])
            .map(e => '-' + e[1] + ' "' + game[e[0]] + '"')
            .join(' ');

        return basicArgs + this.getTclCommandArguments(game);
    }

    private getTclCommandArguments(game: Game): string {
        let commandLineArgs: string[] = [];
        for (let item of EmulatorLaunchService.tclCommandArgs) {
            if (game[item.field]) {
                for (let command of item.argCommands) {
                    if (game[item.field].toString() == command[0]) {
                        commandLineArgs.push(command[1]);
                    }
                }
            }
        }

        if (commandLineArgs.length > 0) {
            return " -command \"" + commandLineArgs.join(';') + "\"";
        } else {
            return "";
        }
    }
}