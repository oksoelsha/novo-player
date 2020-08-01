export class Game {
    name: string;
    sha1Code: string;
    size: string;
    machine: string;

    romA: string;
    romB: string;
    extensionRom: string;
    diskA: string;
    diskB: string;
    tape: string;
    harddisk: string;
    laserdisc: string;

    title: string;
    company: string;
    year: string;
    country: string;
    mapper: string;
    remark: string;

    generationMSXId: number;
    generations: number;
    screenshotSuffix: string;

    private readonly MASK_GENERATION_MSX = 1;
    private readonly MASK_GENERATION_MSX2 = 2;
    private readonly MASK_GENERATION_MSX2PLUS = 4;
    private readonly MASK_GENERATION_TURBO_R = 8;

    constructor(name: string, sha1Code: string, size: number) {
        this.name = name;
        this.sha1Code = sha1Code;
        this.setSize(size);
    }

    setMachine(machine: string) {
        this.machine = machine;
    }

    setRomA(romA: string) {
        this.romA = romA;
    }

    setRomB(romB: string) {
        this.romB = romB;
    }

    setDiskA(diskA: string) {
        this.diskA = diskA;
    }

    setDiskB(diskB: string) {
        this.diskB = diskB;
    }

    setTape(tape: string) {
        this.tape = tape;
    }

    setHarddisk(harddisk: string) {
        this.harddisk = harddisk;
    }

    setLaserdisc(laserdisc: string) {
        this.laserdisc = laserdisc;
    }

    setGenerationMSXId(generationMSXId: number) {
        this.generationMSXId = generationMSXId;
    }

    setTitle(title: string) {
        this.title = title;
    }

    setCompany(company: string) {
        this.company = company;
    }

    setYear(year: string) {
        this.year = year;
    }

    setCountry(country: string) {
        this.country = country;
    }

    setMapper(mapper: string) {
        this.mapper = mapper;
    }

    setRemark(remark: string) {
        this.remark = remark;
    }

    setScreenshotSuffix(screenshotSuffix: string) {
        this.screenshotSuffix = screenshotSuffix;
    }

    isMSX(): boolean {
        return (this.generations & this.MASK_GENERATION_MSX) > 0
    }

    isMSX2(): boolean {
        return (this.generations & this.MASK_GENERATION_MSX2) > 0
    }

    isMSX2Plus(): boolean {
        return (this.generations & this.MASK_GENERATION_MSX2PLUS) > 0
    }

    isTurboR(): boolean {
        return (this.generations & this.MASK_GENERATION_TURBO_R) > 0
    }

    private setSize(sizeInBytes: number) {
        var humanReadableSize: number = sizeInBytes / 1024;
        this.size = humanReadableSize + " KB";
    }
}
