import { ipcMain, app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { SettingsService} from './SettingsService'
import { GamesService } from './GamesService'
import { EmulatorLaunchService } from './EmulatorLaunchService'
import { FilesService } from './FilesService'
import { EmulatorRepositoryService } from './EmulatorRepositoryService'
import { ExtraDataService } from './ExtraDataService'
import { ScanService } from './ScanService'
import { EmulatorHardwareService } from './EmulatorHardwareService'

let win: BrowserWindow

app.on('ready', startApp)

app.on('activate', () => {
    if (win === null) {
        startApp()
    }
})

function startApp() {
    createWindow();
    initializeServices();
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, `/../../../dist/novo-player/assets/icon.ico`),
        backgroundColor: '#2e2c29',
        show: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })
    if (process.platform === "darwin") {
        app.dock.hide();  //hide menu on MacOS
    }

    const url = new URL(path.join(__dirname, `/../../../dist/novo-player/index.html`));
    url.protocol = "file:";
    win.loadURL(url.toString());

    win.once('ready-to-show', () => {
        win.show();
    })

    win.on('closed', () => {
        win = null;
    })
}

function initializeServices() {
    let settingsService = new SettingsService(win);
    settingsService.init();

    let extraDataService = new ExtraDataService();
    extraDataService.init();

    let emulatorRepositoryService = new EmulatorRepositoryService(settingsService)
    emulatorRepositoryService.init();

    let gamesService = new GamesService(win, emulatorRepositoryService);
    gamesService.init();

    let filesService = new FilesService(win, settingsService);
    filesService.init();

    let emulatorLaunchService = new EmulatorLaunchService(win, settingsService);
    emulatorLaunchService.init();

    let emulatorHardwareService = new EmulatorHardwareService(win, settingsService);
    emulatorHardwareService.init();

    //services that are rare to execute and have internal state -> create new instance per request
    ipcMain.on('scan', (event, directories: string[], listing: string, machine: string) => {
        let scanService = new ScanService(win, extraDataService, emulatorRepositoryService, gamesService);
        scanService.start(directories, listing, machine);
    })
}
