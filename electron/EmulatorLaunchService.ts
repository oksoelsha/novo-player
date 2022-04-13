import * as cp from 'child_process'
import { BrowserWindow, ipcMain } from 'electron'
import { EventLogService } from 'EventLogService'
import { SettingsService } from 'SettingsService'
import { Event, EventSource, EventType } from '../src/app/models/event'
import { Game } from '../src/app/models/game'
import { GameUtils } from '../src/app/models/game-utils'
import { PlatformUtils } from './utils/PlatformUtils'

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
        ['machine', 'machine'],
        ['romA', 'carta'],
        ['romB', 'cartb'],
        ['diskA', 'diska'],
        ['diskB', 'diskb'],
        ['tape', 'cassetteplayer'],
        ['harddisk', 'hda'],
        ['extensionRom', 'ext'],
        ['laserdisc', 'laserdisc']
    ];

    private static readonly Input_Device_JOYSTICK = 'plug joyporta joystick1';
    private static readonly Input_Device_JOYSTICK_KEYBOARD = 'plug joyporta keyjoystick1';
    private static readonly Input_Device_MOUSE = 'plug joyporta mouse';
    private static readonly Input_Device_ARKANOID_PAD = 'plug joyporta arkanoidpad';
    private static readonly Input_Device_TRACKBALL = 'plug joyportb trackball';
    private static readonly Input_Device_TOUCHPAD = 'plug joyportb touchpad';

    private static readonly FDD_MODE_DISABLE_SECOND = 'after boot { keymatrixdown 6 2; after time 14 \"keymatrixup 6 2\" }';
    private static readonly FDD_MODE_DISABLE_BOTH = 'after boot { keymatrixdown 6 1; after time 14 \"keymatrixup 6 1\" }';

    private static readonly ENABLE_GFX9000_CMD = 'ext gfx9000; ' +
        'ext slotexpander; ' + 'after time 10 \"set videosource GFX9000\"';

    private static readonly tclCommandArgs: TCLCommands[] = [
        new TCLCommands('inputDevice', [
            ['1', EmulatorLaunchService.Input_Device_JOYSTICK],
            ['2', EmulatorLaunchService.Input_Device_JOYSTICK_KEYBOARD],
            ['3', EmulatorLaunchService.Input_Device_MOUSE],
            ['4', EmulatorLaunchService.Input_Device_ARKANOID_PAD],
            ['5', EmulatorLaunchService.Input_Device_TRACKBALL],
            ['6', EmulatorLaunchService.Input_Device_TOUCHPAD]
        ])
        ,
        new TCLCommands('fddMode', [
            ['1', EmulatorLaunchService.FDD_MODE_DISABLE_SECOND],
            ['2', EmulatorLaunchService.FDD_MODE_DISABLE_BOTH]
        ])
        ,
        new TCLCommands('connectGFX9000', [
            ['true', EmulatorLaunchService.ENABLE_GFX9000_CMD]
        ])
    ];

    private static readonly LAUNCH_ERROR_SPLIT_MSG_UNCAUGHT = 'Uncaught exception: ';
    private static readonly LAUNCH_ERROR_SPLIT_MSG_ERROR_IN = 'Error in ';

    constructor(private win: BrowserWindow, private settingsService: SettingsService, private eventLogService: EventLogService) {
        this.init();
    }

    private init() {
        ipcMain.on('launchGame', (event, game: Game, time: number) => {
            this.launch(game, time)
        })
    }

    private launch(game: Game, time: number) {
        var self = this;
        var options = {
            cwd: this.settingsService.getSettings().openmsxPath,
            detached: true
        };

        const process = cp.spawn(PlatformUtils.getOpenmsxBinary(), this.getArguments(game), options);
        process.on("error", (error) => {
            console.log(error.message);
            let errorMessage: string;
            let splitText: string = self.getSplitText(error);
            if (splitText) {
                errorMessage = error.message.substring(error.message.indexOf(splitText) + splitText.length);
            } else {
                errorMessage = 'Error launching openMSX';
            }
            self.win.webContents.send('launchGameResponse' + time, errorMessage);
        });

        process.on("close", (error: any) => {
            self.win.webContents.send('launchGameResponse' + time);
        });

        this.win.webContents.send('launchGameProcessIdResponse' + game.sha1Code, process.pid);
        this.eventLogService.logEvent(new Event(EventSource.openMSX, EventType.LAUNCH, GameUtils.getMonikor(game)));
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

    private getArguments(game: Game): string[] {
        let args: string[] = [];
        EmulatorLaunchService.fieldsToArgs.forEach (field => {
            if (game[field[0]]) {
                args.push('-' + field[1]);
                args.push(game[field[0]]);
            }
        });
        this.addTclCommandArguments(args, game);

        return args;
    }

    private addTclCommandArguments(args: string[], game: Game) {
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
            args.push('-command');
            args.push(commandLineArgs.join(';'));
        }
    }
}
