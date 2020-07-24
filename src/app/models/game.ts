export class Game {
    name: string;
    rom: string;
    msxGenId: number;
    sha1Code: string;
    title: string;
    company: string;
    year: string;
    country: string;

    mapper: string;
    remark: string;

    constructor(name: string, rom: string, sha1Code: string, msxGenId: number) {
        this.name = name;
        this.rom = rom;
        this.sha1Code = sha1Code;
        this.msxGenId = msxGenId;
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
}
