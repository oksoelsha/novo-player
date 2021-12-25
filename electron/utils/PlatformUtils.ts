import * as path from 'path'
import * as os from 'os';

export class PlatformUtils {

    static getHardwarePath(openmsxPath: string, hardwareType: string): string {
        if (this.isWindows()) {
            return path.join(openmsxPath, 'share/' + hardwareType);
        } else if (this.isLinux()) {
            return path.join('/usr/share/openmsx/', hardwareType);
        } else if (this.isMacOS()) {
            return path.join(openmsxPath, 'openmsx.app/share/' + hardwareType);
        } else {
            return this.unsupportedPlatform();
        }
    }

    static getOpenmsxBinary(): string {
        if (this.isWindows()) {
            return 'openmsx.exe';
        } else if (this.isLinux()) {
            return 'openmsx';
        } else if (this.isMacOS()) {
            return 'openmsx.app/Contents/MacOS/openmsx';
        } else {
            return this.unsupportedPlatform();
        }
    }

    static getOpenmsxSoftwareDb(openmsxPath: string): string {
        if (this.isWindows()) {
            return path.join(openmsxPath, 'share/softwaredb.xml');
        } else if (this.isLinux()) {
            return '/usr/share/openmsx/softwaredb.xml';
        } else if (this.isMacOS()) {
            return path.join(openmsxPath, 'openmsx.app/share/softwaredb.xml');
        } else {
            return this.unsupportedPlatform();
        }
    }

    static getFileManagerCommand(file: string): string {
        if (this.isWindows()) {
            return 'explorer.exe /select, "' + file + '"';
        } else if (this.isLinux()) {
            return 'nautilus --browser "' + path.dirname(file) + '"';
        } else if (this.isMacOS()) {
            return 'open -R "' + file + '"';
        } else {
            return this.unsupportedPlatform();
        }
    }

    private static isWindows(): boolean {
        return os.platform() == 'win32';
    }

    private static isLinux(): boolean {
        return os.platform() == 'linux';
    }

    private static isMacOS(): boolean {
        return os.platform() == 'darwin';
    }

    private static unsupportedPlatform(): string {
        console.log('Platform not supported: ' + os.platform());
        return 'Not supported';
    }
}