import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { SettingsService } from 'SettingsService'
import { FileTypeUtils } from './utils/FileTypeUtils';

export class EmulatorMachinesService {

    private readonly HARDWARE_CONFIG_FILENAME: string = "hardwareconfig.xml";

    constructor(private win: BrowserWindow, private settingsService: SettingsService) { }

    init() {
        ipcMain.on('getMachines', (event, arg) => {
            var machines = this.getMachines();
            this.win.webContents.send('getMachinesResponse', machines)
        })
    }

    private getMachines(): string[] {
        var self = this;
        var openMSXPath = this.settingsService.getSettings().openmsxPath;
        var machinesPath = path.join(openMSXPath, "share\\machines"); //On Windows for now
        var machines: string[] = [];

        if (fs.existsSync(machinesPath)) {
            var machinesDirectory = fs.readdirSync(machinesPath, 'utf8');
            machinesDirectory.forEach(file => {
                var machineFullPath: string = path.join(machinesPath, file)
                if (fs.statSync(machineFullPath).isFile()) {
                    if (FileTypeUtils.isXML(machineFullPath)) {
                        machines.push(FileTypeUtils.getFilenameWithoutExt(path.basename(machineFullPath)));
                    }
                } else {
                    var hardwareConfigFile: string = path.join(machineFullPath, this.HARDWARE_CONFIG_FILENAME);
                    if (fs.existsSync(hardwareConfigFile)) {
                        machines.push(path.basename(machineFullPath));
                    }
                }
            })    
        }

        return machines;
    }
}