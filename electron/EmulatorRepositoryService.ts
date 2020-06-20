import { ipcMain } from 'electron'
import { SettingsService } from 'SettingsService'
import * as path from 'path'
import * as fs from 'fs'
import * as parser from 'fast-xml-parser';

export class EmulatorRepositoryService implements UpdateListerner {

    repositoryInfo: Map<string, RepositoryData>;

    constructor(private settingsService: SettingsService) { 
        settingsService.addListerner(this);
    }

    init() {
        let gamesDataMap: Map<string, RepositoryData> = new Map<string, RepositoryData>();
        let softwaredbFilename: string = path.join(this.settingsService.getSettings().openmsxPath, 'share/softwaredb.xml');

        if (fs.existsSync(softwaredbFilename)) {
            fs.readFile(softwaredbFilename, function (err, data) {
                var result = parser.parse(data.toString());
                for (var s in result.softwaredb.software) {
                    var software = result.softwaredb.software
                    for (var y in software[s].dump) {
                        var dump = software[s].dump
                        if (dump[y].hasOwnProperty('rom')) {
                            let repositoryData = new RepositoryData(software[s].title, software[s].system, software[s].company,
                                software[s].year, software[s].country);

                            if (dump[y].rom.hasOwnProperty('type')) {
                                repositoryData.setMapper(dump[y].rom.type)
                            }

                            if (dump[y].rom.hasOwnProperty('remark')) {
                                repositoryData.setRemark(dump[y].rom.remark)
                            }

                            gamesDataMap.set(dump[y].rom.hash, repositoryData)

                        } else if (dump[y].hasOwnProperty('megarom')) {
                            let repositoryData = new RepositoryData(software[s].title, software[s].system, software[s].company,
                                software[s].year, software[s].country);

                            repositoryData.setMapper(dump[y].megarom.type)

                            if (dump[y].megarom.hasOwnProperty('remark')) {
                                repositoryData.setRemark(dump[y].megarom.remark)
                            }

                            gamesDataMap.set(dump[y].megarom.hash, repositoryData)
                        }
                    }
                }
            });
        }
        this.repositoryInfo = gamesDataMap
    }

    getRepositoryInfo(): Map<string, RepositoryData> {
        return this.repositoryInfo;
    }

    reinit() {
        this.init();
    }
}

export class RepositoryData {
    title: string;
    system: string;
    company: string;
    year: string;
    country: string;

    mapper: string;
    start: string;
    remark: string;

    constructor(title: string, system: string, company: string, year: string, country: string) {
        this.title = title;
        this.system = system;
        this.company = company;
        this.year = year;
        this.country = country;
    }

    setMapper(mapper: string) {
        this.mapper = mapper;
    }

    setStart(start: string) {
        this.start = start;
    }

    setRemark(remark: string) {
        this.remark = remark;
    }
}