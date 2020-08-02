import { Game } from './game';

export class GameUtils {

    private static readonly genres: string[] = [
        "Unknown",
        "Action",
        "Adult",
        "Adventure (All)",
        "Adventure | Point and Click",
        "Adventure | Text and Gfx",
        "Adventure | Text only",
        "Arcade",
        "Board Games",
        "Break-out",
        "Card Games",
        "Communication",
        "Compiler",
        "Database",
        "DTP",
        "Educational",
        "Fighting",
        "Financial",
        "Gambling / Fruit Machine",
        "Graphics",
        "Miscellaneous",
        "Office",
        "Operating System",
        "Parody",
        "Pinball",
        "Platform",
        "Puzzle",
        "Quiz",
        "Racing",
        "Remake",
        "RPG",
        "Shoot-'em-up (All)",
        "Shoot-'em-up | First-person shooter",
        "Shoot-'em-up | Horizontal",
        "Shoot-'em-up | Isometric",
        "Shoot-'em-up | Multi-directional",
        "Shoot-'em-up | Vertical",
        "Simulation",
        "Sound",
        "Sport Games",
        "Sport Management",
        "Spreadsheet",
        "Strategy",
        "Tool",
        "Variety",
        "War Games",
        "Word Processor",
        "Maze",
        "Pong",
        "Beat-'em-up",
        "Dexterity",
    ]

    static isMSX(game: Game): boolean {
        return (game.generations & game.MASK_GENERATION_MSX) > 0
    }

    static isMSX2(game: Game): boolean {
        return (game.generations & game.MASK_GENERATION_MSX2) > 0
    }

    static isMSX2Plus(game: Game): boolean {
        return (game.generations & game.MASK_GENERATION_MSX2PLUS) > 0
    }

    static isTurboR(game: Game): boolean {
        return (game.generations & game.MASK_GENERATION_TURBO_R) > 0
    }

    static isPSG(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_PSG) > 0
    }

    static isSCC(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_SCC) > 0
    }

    static isSCCI(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_SCC_I) > 0
    }

    static isPCM(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_PCM) > 0
    }

    static isMSXMusic(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_MSX_MUSIC) > 0
    }

    static isMSXAudio(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_MSX_AUDIO) > 0
    }

    static isMoonsound(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_MOONSOUND) > 0
    }

    static isMidi(game: Game): boolean {
        return (game.sounds & game.MASK_SOUND_MIDI) > 0
    }

    static getGenre(genre: number): string {
        if(genre < 1 || genre >= this.genres.length) {
            return null;
        } else {
            return this.genres[genre];
        }
    }
}
