export class FileTypeUtils {
    public static readonly MAX_DISK_FILE_SIZE = 737280
    public static readonly EXTENSION_ROM_IDE = "ide"

    private static readonly romExtensions: Array<string> = ["rom", "ri", "col", "mx1", "mx2"]
    private static readonly diskExtensions: Array<string> = ["dsk", "di1", "di2", "dmk", "xsa", "fd1", "fd2"]
    private static readonly tapeExtensions: Array<string> = ["cas", "wav", "tsx"]
    private static readonly harddiskExtensions: Array<string> = ["dsk", "hdd"]
    private static readonly laserdiscExtensions: Array<string> = ["ogv"]
    private static readonly zipExtensions: Array<string> = ["zip", "gz"]
    private static readonly xmlExtensions: Array<string> = ["xml"]

    static isMSXFile(filename: string): boolean {
        return this.isROM(filename) || this.isZip(filename) || this.isDisk(filename) || this.isTape(filename) ||
            this.isHarddisk(filename) || this.isLaserdisc(filename)
    }

    static isROM(filename: string): boolean {
        return this.isType(filename, this.romExtensions);
    }

    static isDisk(filename: string): boolean {
        return this.isType(filename, this.diskExtensions);
    }

    static isTape(filename: string): boolean {
        return this.isType(filename, this.tapeExtensions);
    }

    static isHarddisk(filename: string): boolean {
        return this.isType(filename, this.harddiskExtensions);
    }

    static isLaserdisc(filename: string): boolean {
        return this.isType(filename, this.laserdiscExtensions);
    }

    static isZip(filename: string): boolean {
        return this.isType(filename, this.zipExtensions);
    }

    static isXML(filename: string): boolean {
        return this.isType(filename, this.xmlExtensions);
    }

    static getFilenameWithoutExt(filename: string): string {
        return filename.substring(0, filename.lastIndexOf('.'));
    }

    static getRomExtensions(): Array<string> {
        return this.romExtensions;
    }

    static getDiskExtensions(): Array<string> {
        return this.diskExtensions;
    }

    static getTapeExtensions(): Array<string> {
        return this.tapeExtensions;
    }

    static getHarddiskExtensions(): Array<string> {
        return this.harddiskExtensions;
    }

    static getLaserdiscExtensions(): Array<string> {
        return this.laserdiscExtensions;
    }

    static getZipExtensions(): Array<string> {
        return this.zipExtensions;
    }

    private static isType(filename: string, typeList: Array<string>) {
        var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
        return typeList.indexOf(ext) > -1;
    }
}