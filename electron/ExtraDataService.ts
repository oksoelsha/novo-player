import * as fs from 'fs'
import * as path from 'path'

export class ExtraDataService implements UpdateListerner {

    private extraDataPath: string = path.join(__dirname, '/../../../dist/novo-player/assets/data/extra-data.dat')
    private extraDataMap: Map<string, ExtraData> = new Map()

    constructor() {}

    init(): void {
        var readInfo: boolean = false
        var readCodes: boolean = false
    
        var generationMSXID: number
        var generations: number
        var soundChips: number
        var genre1: number
        var genre2: number
        var suffix: string
        var extraData: ExtraData

        var data: string = fs.readFileSync(this.extraDataPath, { encoding: 'ascii' })
        var lines: string[] = data.split(/\r?\n/)
    
        lines.forEach((line) => {
            if (!line.startsWith('--')) {
                if (line.startsWith('#')) {
                    generationMSXID = +line.substring(1)
                    readInfo = true
                } else if (readInfo) {
                    var tokens: string[] = line.split(',')
                    generations = +tokens[0]
                    soundChips = +tokens[1]
                    if (tokens.length > 2) {
                        var genres: string[] = tokens[2].split('|')
                        genre1 = +genres[0]
                        if (genres.length > 1) {
                            genre2 = +genres[1]
                        } else {
                            genre2 = 0
                        }
                    } else {
                        genre1 = 0
                        genre2 = 0
                    }
                    if (tokens.length > 3) {
                        suffix = tokens[3]
                    }
    
                    extraData = new ExtraData(generationMSXID, generations, soundChips,
                        genre1, genre2, suffix)
    
                    readInfo = false
                    readCodes = true
                } else if (readCodes) {
                    var codes: string[] = line.split('|')
                    codes.forEach((code) => {
                        this.extraDataMap.set(code, extraData)
                    })
    
                    readCodes = false
                }
            }
        })    
    }

    reinit(): void {
        this.init()
    }
}

export class ExtraData {
    generationMSXID: number
    generations: number
    soundChips: number
    genre1: number
    genre2: number
    suffix: string

    constructor(generationMSXID: number, generations: number, soundChips: number,
        genre1: number, genre2: number, suffix: string) {
        this.generationMSXID = generationMSXID
        this.generations = generations
        this.genre1 = genre1
        this.genre2 = genre2
        this.soundChips = soundChips
        this.suffix = suffix
    }
}
