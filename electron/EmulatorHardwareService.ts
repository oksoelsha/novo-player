import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os';
import { SettingsService } from 'SettingsService'
import { FileTypeUtils } from './utils/FileTypeUtils';
import { PlatformUtils } from './utils/PlatformUtils';

export class EmulatorHardwareService {

    private readonly HARDWARE_CONFIG_FILENAME: string = "hardwareconfig.xml";

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('getMachines', (event, arg) => {
            var machines = this.getFromEmulator("machines");
            this.win.webContents.send('getMachinesResponse', machines);
        })

        ipcMain.on('getExtensions', (event, arg) => {
            var extensions = this.getFromEmulator("extensions");
            this.win.webContents.send('getExtensionsResponse', extensions);
        })
    }

    private getFromEmulator(hardware: string): string[] {
        var self = this;
        var openMSXPath = this.settingsService.getSettings().openmsxPath;
        var hardwarePath = PlatformUtils.getHardwarePath(openMSXPath, hardware);
        var hardwareList: string[] = [];

        if (fs.existsSync(hardwarePath)) {
            var hardwareDirectory = fs.readdirSync(hardwarePath, 'utf8');
            hardwareDirectory.forEach(file => {
                var hardwareFullPath: string = path.join(hardwarePath, file);
                if (fs.statSync(hardwareFullPath).isFile()) {
                    if (FileTypeUtils.isXML(hardwareFullPath)) {
                        hardwareList.push(FileTypeUtils.getFilenameWithoutExt(path.basename(hardwareFullPath)));
                    }
                } else {
                    var hardwareConfigFile: string = path.join(hardwareFullPath, this.HARDWARE_CONFIG_FILENAME);
                    if (fs.existsSync(hardwareConfigFile)) {
                        hardwareList.push(path.basename(hardwareFullPath));
                    }
                }
            })    
        }

        return hardwareList;
    }
}