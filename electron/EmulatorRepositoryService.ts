import { SettingsService } from 'SettingsService';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as parser from 'fast-xml-parser';
import { PlatformUtils } from './utils/PlatformUtils';

export class EmulatorRepositoryService implements UpdateListerner {

    private repositoryInfo: Map<string, RepositoryData>;

    constructor(private settingsService: SettingsService) {
        settingsService.addListerner(this);
    }

    init(): void {
        var self = this;
        let gamesDataMap: Map<string, RepositoryData> = new Map<string, RepositoryData>();
        let softwaredbFilenames: string[] = [
            PlatformUtils.getOpenmsxSoftwareDb(this.settingsService.getSettings().openmsxPath),
            path.join(__dirname, '/../../../dist/novo-player/assets/data/msxdskdb.xml'),
            path.join(__dirname, '/../../../dist/novo-player/assets/data/msxcaswavdb.xml')
        ];
        var options = {
            parseTrueNumberOnly: true,
            tagValueProcessor : (val: any, tagName: any) => val.replace(/&amp;/g, '&').replace(/&#34;/g, '"')
        }

        for(var softwaredbFilename of softwaredbFilenames) {
            if (fs.existsSync(softwaredbFilename)) {
                fs.readFile(softwaredbFilename, function (err, data) {
                    var result = parser.parse(data.toString(), options);
                    for (var s in result.softwaredb.software) {
                        var software = result.softwaredb.software

                        if (Object.prototype.toString.call(software[s].dump) === '[object Array]') {
                            for (var y in software[s].dump) {
                                self.processDump(software[s], software[s].dump[y], gamesDataMap)
                            }
                        } else {
                            self.processDump(software[s], software[s].dump, gamesDataMap)
                        }
                    }
                });
            }
        }
        this.repositoryInfo = gamesDataMap
    }

    getRepositoryInfo(): Map<string, RepositoryData> {
        return this.repositoryInfo;
    }

    reinit(): void {
        this.init();
    }

    private processDump(software: any, dump: any, gamesDataMap: Map<string, RepositoryData>): void {
        if (dump.hasOwnProperty('rom')) {
            let repositoryData = new RepositoryData(software.title, software.system, software.company,
                software.year, software.country);

            if (dump.hasOwnProperty('original')) {
                repositoryData.setDump(dump.original)
            }
    
            if (dump.rom.hasOwnProperty('type')) {
                repositoryData.setMapper(dump.rom.type)
            } else {
                repositoryData.setMapper('Mirrored ROM')
            }

            if (dump.rom.hasOwnProperty('start')) {
                repositoryData.setStart(dump.rom.start)
            }

            if (dump.rom.hasOwnProperty('remark')) {
                repositoryData.setRemark(dump.rom.remark)
            }

            gamesDataMap.set(dump.rom.hash, repositoryData)
        }
        if (dump.hasOwnProperty('megarom')) {
            let repositoryData = new RepositoryData(software.title, software.system, software.company,
                software.year, software.country);

            if (dump.hasOwnProperty('original')) {
                repositoryData.setDump(dump.original)
            }

            repositoryData.setMapper(dump.megarom.type)

            if (dump.megarom.hasOwnProperty('remark')) {
                repositoryData.setRemark(dump.megarom.remark)
            }

            gamesDataMap.set(dump.megarom.hash, repositoryData)
        }
        if (dump.hasOwnProperty('dsk')) {
            let repositoryData = new RepositoryData(software.title, software.system, software.company,
                software.year, software.country);

            if (dump.dsk.hasOwnProperty('remark')) {
                repositoryData.setRemark(dump.dsk.remark)
            }

            gamesDataMap.set(dump.dsk.format.hash, repositoryData)
        }
        if (dump.hasOwnProperty('cas')) {
            let repositoryData = new RepositoryData(software.title, software.system, software.company,
                software.year, software.country);

            if (dump.cas.hasOwnProperty('remark')) {
                repositoryData.setRemark(dump.cas.remark.text)
            }

            if (dump.cas.hasOwnProperty('start')) {
                repositoryData.setStart(dump.cas.start.text)
            }

            for (var f in dump.cas.format) {
                gamesDataMap.set(dump.cas.format[f].hash, repositoryData)
            }
        }
    }
}

export class RepositoryData {
    title: string;
    system: string;
    company: string;
    year: string;
    country: string;

    dump: string;
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

    setDump(dump: string) {
        this.dump = dump;
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