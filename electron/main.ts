import { ipcMain, app, BrowserWindow } from 'electron'
import * as path from 'path'
import { SettingsService} from './SettingsService'
import { GamesService } from './GamesService'
import { EmulatorLaunchService } from './EmulatorLaunchService'
import { FilesService } from './FilesService'
import { EmulatorRepositoryService } from './EmulatorRepositoryService'
import { ExtraDataService } from './ExtraDataService'
import { ScanService } from './ScanService'
import { EmulatorHardwareService } from './EmulatorHardwareService'
import { HashService } from './HashService'
import { EventLogService } from './EventLogService'
import { OpenMSXControlService } from './OpenMSXControlService'

let win: BrowserWindow;

app.on('ready', startApp);

app.on('activate', () => {
    if (win === null) {
        startApp();
    }
});

function startApp() {
    createWindow();
    initializeServices();
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: process.platform !== 'win32',
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, `/../../../dist/novo-player/assets/icon.png`),
        backgroundColor: '#2e2c29',
        show: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    win.loadFile(path.join(__dirname, `/../../../dist/novo-player/index.html`));

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        win = null;
    });
}

function initializeServices() {
    const settingsService = new SettingsService(win);

    const extraDataService = new ExtraDataService(win);

    const emulatorRepositoryService = new EmulatorRepositoryService(settingsService);

    const hashService = new HashService();

    const gamesService = new GamesService(win, emulatorRepositoryService, hashService);

    new FilesService(win, settingsService);

    const eventLogService = new EventLogService(win);

    new EmulatorLaunchService(win, settingsService, eventLogService);

    new EmulatorHardwareService(win, settingsService);

    new OpenMSXControlService(win);

    //services that are rare to execute and have internal state -> create new instance per request
    ipcMain.on('scan', (event, directories: string[], listing: string, machine: string) => {
        const scanService = new ScanService(win, extraDataService, emulatorRepositoryService, gamesService, hashService);
        scanService.start(directories, listing, machine);
    })
}
