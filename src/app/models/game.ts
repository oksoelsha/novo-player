export class Game {
    name: string;
    company: string;
    year: number;
    msxGenId: number;
    rom: string;

    constructor(name: string, company: string, year: number, msxGenId: number, rom: string) {
        this.name = name;
        this.company = company;
        this.year = year;
        this.msxGenId = msxGenId;
        this.rom = rom;
    }
}
