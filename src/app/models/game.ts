export class Game {
    name: string;
    rom: string;
    msxGenId: number;
    sha1Code: string;
    company: string;
    year: string;

    constructor(name: string, rom: string, sha1Code: string, msxGenId: number) {
        this.name = name;
        this.rom = rom;
        this.sha1Code = sha1Code;
        this.msxGenId = msxGenId;
    }

    setCompany(company: string) {
        this.company = company;
    }

    setYear(year: string) {
        this.year = year;
    }
}
