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

    generationMSXId: number;
    title: string;
    company: string;
    year: string;
    country: string;
    mapper: string;
    remark: string;

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

    private setSize(sizeInBytes: number) {
        var humanReadableSize: number = sizeInBytes / 1024;
        this.size = humanReadableSize + " KB";
    }
}
