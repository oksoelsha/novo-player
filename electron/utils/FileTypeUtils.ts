export class FileTypeUtils {
    private static romExtensions: Array<string> = ["rom", "ri", "col"]
	private static diskExtensions: Array<string> = ["dsk", "di1", "di2", "dmk", "xsa"]
	private static tapeExtensions: Array<string> = ["cas", "wav", "tsx"]
	private static harddiskExtensions: Array<string> = ["dsk", "hdd"]
	private static laserdiscExtensions: Array<string> = ["ogv"]
	private static zipExtensions: Array<string> = ["zip", "gz"]

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

    private static isType(filename: string, typeList: Array<string>) {
        var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
        return typeList.indexOf(ext) > -1;
    }
}