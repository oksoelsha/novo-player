import { ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as cp from 'child_process'
import { Game } from '../src/app/models/game'

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

    constructor(private settingsService: SettingsService) { }

    init() {
        ipcMain.on('launchGame', (event, game: Game) => {
            this.launch(game)
        })
    }

    private launch(game: Game) {
        var openmsx = '"' + path.join(this.settingsService.getSettings().openmsxPath, 'openmsx.exe') + '" ';
        const ls = cp.exec(openmsx + this.getArguments(game), function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack)
            }
        });
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