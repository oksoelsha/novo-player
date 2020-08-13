import { Game } from "../../src/app/models/game";
import { PersistenceUtils } from "../utils/PersistenceUtils";

export class GameDO {
    name: string;
    _id: string;        //this will be used for the sha1Code field
    size: number;
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
    generations: number;
    sounds: number;
    genre1: number;
    genre2: number;
    screenshotSuffix: string;

    constructor(game: Game) {
        for (var field of PersistenceUtils.fieldsToPersist) {
            if (game[field] != null ) {
                this[field] = game[field]
            }
         }
         this._id = game.sha1Code;
    }
}
